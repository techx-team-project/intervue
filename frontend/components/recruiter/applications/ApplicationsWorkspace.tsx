'use client';

import { getColumnIdForStatus, getColumnMeta } from '@/constants/application-status';
import { ROUTES } from '@/constants/routes';
import { useApplicationActionFlow } from '@/hooks/useApplicationActionFlow';
import { useApplicationBoard } from '@/hooks/useApplicationBoard';
import type {
  ApplicationColumnId,
  ApplicationFilters,
  ApplicationStatus,
  RecruiterApplication,
} from '@/types/recruiter-application';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import ApplicationCard from './ApplicationCard';
import ApplicationsFilterBar from './ApplicationsFilterBar';
import BulkActionBar from './BulkActionBar';
import SwimlaneBoard from './SwimlaneBoard';

interface ApplicationsWorkspaceProps {
  initialApplications: RecruiterApplication[];
  initialJobId?: string;
}

export default function ApplicationsWorkspace({ initialApplications, initialJobId = '' }: ApplicationsWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const board = useApplicationBoard(initialApplications, initialJobId);
  const { requestStatusChange, actionModals } = useApplicationActionFlow(board);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const draggingApplication = board.applications.find((application) => application.id === draggingId) ?? null;

  const syncJobFilterUrl = (jobId: string) => {
    router.replace(jobId.length > 0 ? `${pathname}?job=${jobId}` : pathname, { scroll: false });
  };

  const handleFilterChange = <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => {
    board.updateFilter(key, value);
    if (key === 'jobId') syncJobFilterUrl(value as string);
  };

  const handleResetFilters = () => {
    board.resetFilters();
    syncJobFilterUrl('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingId(null);

    const { active, over } = event;
    if (!over) return;

    const application = board.applications.find((item) => item.id === active.id);
    if (!application) return;

    const columnId = String(over.id).split(':').pop() as ApplicationColumnId;
    if (getColumnIdForStatus(application.status) === columnId) return;

    requestStatusChange([application.id], getColumnMeta(columnId).statuses[0]);
  };

  return (
    <div className="space-y-4">
      <ApplicationsFilterBar
        filters={board.filters}
        resultCount={board.visibleApplications.length}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <DndContext
        sensors={sensors}
        onDragStart={(event) => setDraggingId(String(event.active.id))}
        onDragCancel={() => setDraggingId(null)}
        onDragEnd={handleDragEnd}
      >
        <SwimlaneBoard
          columns={board.columns}
          visibleApplications={board.visibleApplications}
          handlers={{
            onOpen: (application) => router.push(`${ROUTES.RECRUITER_APPLICATIONS}/${application.id}`),
            onToggleSaved: board.toggleSaved,
            onToggleSelected: board.toggleSelected,
            onRequestStatusChange: (application: RecruiterApplication, status: ApplicationStatus) =>
              requestStatusChange([application.id], status),
          }}
          totalVisible={board.visibleApplications.length}
          selectedIds={board.selectedIds}
          showJobTitle={false}
        />

        <DragOverlay dropAnimation={null}>
          {draggingApplication && (
            <ApplicationCard application={draggingApplication} variant="rich" isOverlay className="w-[280px]" />
          )}
        </DragOverlay>
      </DndContext>

      <BulkActionBar
        selectedCount={board.selectedIds.length}
        onClear={board.clearSelection}
        onChangeStatus={(status) => requestStatusChange(board.selectedIds, status)}
        onReject={() => requestStatusChange(board.selectedIds, 'REJECTED')}
        onSave={() => board.saveMany(board.selectedIds)}
      />

      {actionModals}
    </div>
  );
}

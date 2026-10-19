'use client';

import type { ApplicationsBoardVariant } from '@/constants/application-board';
import { getColumnIdForStatus, getColumnMeta } from '@/constants/application-status';
import { useApplicationBoard } from '@/hooks/useApplicationBoard';
import type {
  ApplicationColumnId,
  ApplicationFilters,
  ApplicationInterview,
  ApplicationStatus,
  RecruiterApplication,
} from '@/types/recruiter-application';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ApplicationCard from './ApplicationCard';
import ApplicationDetailContent from './ApplicationDetailContent';
import ApplicationDetailDrawer from './ApplicationDetailDrawer';
import ApplicationDetailModal from './ApplicationDetailModal';
import ApplicationsFilterBar from './ApplicationsFilterBar';
import BoardVariantNav from './BoardVariantNav';
import BulkActionBar from './BulkActionBar';
import CommandCenterBoard from './CommandCenterBoard';
import HireConfirmModal from './HireConfirmModal';
import InterviewScheduleModal from './InterviewScheduleModal';
import MinimalBoard from './MinimalBoard';
import RejectApplicationModal from './RejectApplicationModal';
import ReportCandidateModal from './ReportCandidateModal';
import SplitBoard from './SplitBoard';
import SwimlaneBoard from './SwimlaneBoard';

interface ApplicationsWorkspaceProps {
  initialApplications: RecruiterApplication[];
  variant: ApplicationsBoardVariant;
  initialJobId?: string;
  initialApplicationId?: string | null;
}

interface CloseTarget {
  ids: string[];
  initialStatus: 'REJECTED' | 'NO_AGREEMENT';
}

interface HireTarget {
  ids: string[];
  jobTitle: string;
}

export default function ApplicationsWorkspace({
  initialApplications,
  variant,
  initialJobId = '',
  initialApplicationId = null,
}: ApplicationsWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const board = useApplicationBoard(initialApplications, initialJobId);
  const [activeId, setActiveId] = useState<string | null>(initialApplicationId);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [closeTarget, setCloseTarget] = useState<CloseTarget | null>(null);
  const [hireTarget, setHireTarget] = useState<HireTarget | null>(null);
  const [interviewTarget, setInterviewTarget] = useState<RecruiterApplication | null>(null);
  const [reportTarget, setReportTarget] = useState<RecruiterApplication | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const activeApplication = board.applications.find((application) => application.id === activeId) ?? null;
  const draggingApplication = board.applications.find((application) => application.id === draggingId) ?? null;

  const syncUrl = (jobId: string, applicationId: string | null) => {
    const params = new URLSearchParams();
    if (jobId.length > 0) params.set('job', jobId);
    if (applicationId) params.set('application', applicationId);

    const query = params.toString();
    router.replace(query.length > 0 ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openDetail = (application: RecruiterApplication) => {
    setActiveId(application.id);
    board.markAsViewed(application.id);
    syncUrl(board.filters.jobId, application.id);
  };

  const closeDetail = () => {
    setActiveId(null);
    syncUrl(board.filters.jobId, null);
  };

  const handleFilterChange = <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => {
    board.updateFilter(key, value);
    if (key === 'jobId') syncUrl(value as string, activeId);
  };

  const handleResetFilters = () => {
    board.resetFilters();
    syncUrl('', activeId);
  };

  const requestStatusChange = (ids: string[], status: ApplicationStatus) => {
    if (ids.length === 0) return;

    if (status === 'REJECTED' || status === 'NO_AGREEMENT') {
      setCloseTarget({ ids, initialStatus: status });
      return;
    }

    if (status === 'HIRED') {
      const first = board.applications.find((application) => application.id === ids[0]);
      setHireTarget({ ids, jobTitle: first ? first.jobTitle : '' });
      return;
    }

    if (status === 'INTERVIEW') {
      if (ids.length === 1) {
        const application = board.applications.find((item) => item.id === ids[0]);
        if (application) {
          setInterviewTarget(application);
          return;
        }
      }
      board.moveApplications(ids, status);
      toast.info('Hãy mở từng hồ sơ để đặt lịch phỏng vấn cho ứng viên.');
      return;
    }

    board.moveApplications(ids, status);
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

  const confirmInterview = (interview: ApplicationInterview | null) => {
    if (!interviewTarget) return;
    board.moveApplications([interviewTarget.id], 'INTERVIEW', interview ? { interview } : {});
    setInterviewTarget(null);
  };

  const candidateNamesOf = (ids: string[]) =>
    board.applications
      .filter((application) => ids.includes(application.id))
      .map((application) => application.candidate.fullName);

  const viewProps = {
    columns: board.columns,
    visibleApplications: board.visibleApplications,
    handlers: {
      onOpen: openDetail,
      onToggleSaved: board.toggleSaved,
      onToggleSelected: board.toggleSelected,
      onRequestStatusChange: (application: RecruiterApplication, status: ApplicationStatus) =>
        requestStatusChange([application.id], status),
    },
    totalVisible: board.visibleApplications.length,
    activeApplicationId: activeId,
    selectedIds: board.selectedIds,
    showJobTitle: board.filters.jobId === '',
  };

  const detailContent = activeApplication && (
    <ApplicationDetailContent
      key={activeApplication.id}
      application={activeApplication}
      onRequestStatusChange={(status) => requestStatusChange([activeApplication.id], status)}
      onToggleSaved={() => board.toggleSaved(activeApplication.id)}
      onAddNote={(content) => board.addNote(activeApplication.id, content)}
      onReport={() => setReportTarget(activeApplication)}
    />
  );

  return (
    <div className="space-y-4">
      <BoardVariantNav current={variant} />

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
        {variant === 'command-center' && <CommandCenterBoard {...viewProps} />}
        {variant === 'split' && <SplitBoard {...viewProps} inspector={detailContent} />}
        {variant === 'swimlane' && <SwimlaneBoard {...viewProps} />}
        {variant === 'minimal' && <MinimalBoard {...viewProps} />}

        <DragOverlay dropAnimation={null}>
          {draggingApplication && (
            <ApplicationCard
              application={draggingApplication}
              variant={variant === 'command-center' ? 'rich' : 'compact'}
              isOverlay
              className="w-[280px]"
            />
          )}
        </DragOverlay>
      </DndContext>

      {variant !== 'split' &&
        (variant === 'minimal' ? (
          <ApplicationDetailModal
            application={activeApplication}
            onClose={closeDetail}
            onRequestStatusChange={(application, status) => requestStatusChange([application.id], status)}
            onToggleSaved={board.toggleSaved}
            onAddNote={board.addNote}
            onReport={setReportTarget}
          />
        ) : (
          <ApplicationDetailDrawer
            application={activeApplication}
            onClose={closeDetail}
            onRequestStatusChange={(application, status) => requestStatusChange([application.id], status)}
            onToggleSaved={board.toggleSaved}
            onAddNote={board.addNote}
            onReport={setReportTarget}
          />
        ))}

      <BulkActionBar
        selectedCount={board.selectedIds.length}
        onClear={board.clearSelection}
        onChangeStatus={(status) => requestStatusChange(board.selectedIds, status)}
        onReject={() => setCloseTarget({ ids: board.selectedIds, initialStatus: 'REJECTED' })}
        onSave={() => board.saveMany(board.selectedIds)}
      />

      {closeTarget && (
        <RejectApplicationModal
          candidateNames={candidateNamesOf(closeTarget.ids)}
          initialStatus={closeTarget.initialStatus}
          onClose={() => setCloseTarget(null)}
          onConfirm={(data) => {
            board.moveApplications(closeTarget.ids, data.status, { reason: data.reason, detail: data.detail });
            setCloseTarget(null);
          }}
        />
      )}

      {hireTarget && (
        <HireConfirmModal
          candidateNames={candidateNamesOf(hireTarget.ids)}
          jobTitle={hireTarget.jobTitle}
          onClose={() => setHireTarget(null)}
          onConfirm={() => {
            board.moveApplications(hireTarget.ids, 'HIRED');
            setHireTarget(null);
          }}
        />
      )}

      {interviewTarget && (
        <InterviewScheduleModal
          candidateName={interviewTarget.candidate.fullName}
          jobTitle={interviewTarget.jobTitle}
          onClose={() => setInterviewTarget(null)}
          onSkip={() => confirmInterview(null)}
          onConfirm={(interview) => confirmInterview(interview)}
        />
      )}

      {reportTarget && (
        <ReportCandidateModal
          candidateName={reportTarget.candidate.fullName}
          onClose={() => setReportTarget(null)}
          onConfirm={() => {
            toast.success('Đã gửi báo cáo tới đội ngũ kiểm duyệt InterVue.');
            setReportTarget(null);
          }}
        />
      )}
    </div>
  );
}

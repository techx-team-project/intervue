'use client';

import type { ApplicationBoardColumn as BoardColumn } from '@/hooks/useApplicationBoard';
import { cn } from '@/lib/utils';
import type { ApplicationCardHandlers } from '@/types/recruiter-application';
import { useDroppable } from '@dnd-kit/core';
import { ChevronDown, Inbox } from 'lucide-react';
import type { ApplicationCardVariant } from './ApplicationCard';
import DraggableApplicationCard from './DraggableApplicationCard';

interface ApplicationBoardColumnProps {
  column: BoardColumn;
  droppableId?: string;
  handlers: ApplicationCardHandlers;
  cardVariant: ApplicationCardVariant;
  headerStyle?: 'metrics' | 'plain';
  totalVisible?: number;
  selectedIds?: string[];
  showJobTitle?: boolean;
  showStatusBadge?: boolean;
  enableSelection?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  bodyClassName?: string;
  className?: string;
}

export default function ApplicationBoardColumn({
  column,
  droppableId,
  handlers,
  cardVariant,
  headerStyle = 'plain',
  totalVisible = 0,
  selectedIds = [],
  showJobTitle = true,
  showStatusBadge = false,
  enableSelection = true,
  isCollapsed = false,
  onToggleCollapse,
  bodyClassName,
  className,
}: ApplicationBoardColumnProps) {
  const { meta, applications, newCount } = column;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId ?? meta.id });
  const share = totalVisible > 0 ? Math.round((applications.length / totalVisible) * 100) : 0;

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hover:border-outline flex w-12 shrink-0 cursor-pointer flex-col items-center gap-3 rounded-xl border border-[#e5e9ef] bg-white py-4 transition-colors"
      >
        <span className={cn('h-2 w-2 rounded-full', meta.accentDotClassName)} />
        <span className="text-navy text-body-sm font-bold">{applications.length}</span>
        <span className="text-body-sm text-on-surface-variant font-bold [writing-mode:vertical-rl]">{meta.label}</span>
      </button>
    );
  }

  return (
    <section
      ref={setNodeRef}
      aria-label={`${meta.label} — ${applications.length} applications`}
      className={cn(
        'flex min-w-0 flex-col rounded-xl border transition-colors',
        isOver ? cn('border-transparent bg-white ring-2', meta.accentRingClassName) : 'border-[#e5e9ef] bg-[#fafbfc]',
        className,
      )}
    >
      <header className={cn('rounded-t-xl border-b border-[#eef1f5] px-3.5 pt-3.5 pb-3')}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.accentDotClassName)} />
            <h3 className={cn('text-body-md truncate font-bold', meta.accentTextClassName)}>{meta.label}</h3>
            <span className="text-navy text-label-sm shrink-0 rounded-full bg-white px-1.5 py-0.5 font-bold">
              {applications.length}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {newCount > 0 && (
              <span className="bg-primary text-label-sm rounded-full px-1.5 py-0.5 font-bold text-white">
                {newCount} new
              </span>
            )}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={`Collapse the ${meta.label} column`}
                className="text-outline hover:text-on-surface flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-white"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {headerStyle === 'metrics' && (
          <>
            <p className="text-label-sm text-outline mt-1.5 leading-snug">{meta.description}</p>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                <div className={cn('h-full rounded-full', meta.accentBarClassName)} style={{ width: `${share}%` }} />
              </div>
              <span className="text-label-sm text-outline font-bold">{share}%</span>
            </div>
          </>
        )}
      </header>

      <div className={cn('flex-1 space-y-2.5 overflow-y-auto p-3', bodyClassName)}>
        {applications.length === 0 ? (
          <div className="border-outline-variant flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed py-8 text-center">
            <Inbox className="text-outline h-5 w-5" />
            <p className="text-label-sm text-outline font-semibold">No applications yet</p>
            <p className="text-label-sm text-outline px-3">Drop an application here to change its status</p>
          </div>
        ) : (
          applications.map((application) => (
            <DraggableApplicationCard
              key={application.id}
              application={application}
              variant={cardVariant}
              isSelected={selectedIds.includes(application.id)}
              showJobTitle={showJobTitle}
              showStatusBadge={showStatusBadge}
              onOpen={() => handlers.onOpen(application)}
              onToggleSaved={() => handlers.onToggleSaved(application.id)}
              onToggleSelected={enableSelection ? () => handlers.onToggleSelected(application.id) : undefined}
              onChangeStatus={(status) => handlers.onRequestStatusChange(application, status)}
            />
          ))
        )}
      </div>
    </section>
  );
}

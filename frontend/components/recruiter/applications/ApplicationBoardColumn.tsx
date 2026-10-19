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
  activeApplicationId?: string | null;
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
  activeApplicationId = null,
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
        className="flex w-12 shrink-0 cursor-pointer flex-col items-center gap-3 rounded-2xl border border-[#e5e9ef] bg-white py-4 transition-colors hover:border-slate-300"
      >
        <span className={cn('h-2 w-2 rounded-full', meta.accentDotClassName)} />
        <span className="text-navy text-[12px] font-black">{applications.length}</span>
        <span className="text-[12px] font-bold text-[#64748b] [writing-mode:vertical-rl]">{meta.label}</span>
      </button>
    );
  }

  return (
    <section
      ref={setNodeRef}
      aria-label={`${meta.label} — ${applications.length} hồ sơ`}
      className={cn(
        'flex min-w-0 flex-col rounded-2xl border transition-colors',
        isOver ? cn('border-transparent bg-white ring-2', meta.accentRingClassName) : 'border-[#e5e9ef] bg-[#fafbfc]',
        className,
      )}
    >
      <header
        className={cn(
          'rounded-t-2xl border-b border-[#eef1f5] bg-linear-to-b to-transparent px-3.5 pt-3.5 pb-3',
          meta.accentSurfaceClassName,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.accentDotClassName)} />
            <h3 className={cn('truncate text-[13px] font-black', meta.accentTextClassName)}>{meta.label}</h3>
            <span className="text-navy shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[11.5px] font-black shadow-2xs">
              {applications.length}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {newCount > 0 && (
              <span className="bg-primary rounded-full px-1.5 py-0.5 text-[10.5px] font-black text-white">
                {newCount} mới
              </span>
            )}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={`Thu gọn cột ${meta.label}`}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {headerStyle === 'metrics' && (
          <>
            <p className="mt-1.5 text-[11px] leading-snug text-[#94a3b8]">{meta.description}</p>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                <div className={cn('h-full rounded-full', meta.accentBarClassName)} style={{ width: `${share}%` }} />
              </div>
              <span className="text-[10.5px] font-bold text-[#94a3b8]">{share}%</span>
            </div>
          </>
        )}
      </header>

      <div className={cn('flex-1 space-y-2.5 overflow-y-auto p-3', bodyClassName)}>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#e2e8f0] py-8 text-center">
            <Inbox className="h-5 w-5 text-[#cbd5e1]" />
            <p className="text-[11.5px] font-semibold text-[#94a3b8]">Chưa có hồ sơ</p>
            <p className="px-3 text-[10.5px] text-[#cbd5e1]">Kéo một hồ sơ vào đây để chuyển trạng thái</p>
          </div>
        ) : (
          applications.map((application) => (
            <DraggableApplicationCard
              key={application.id}
              application={application}
              variant={cardVariant}
              isActive={activeApplicationId === application.id}
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

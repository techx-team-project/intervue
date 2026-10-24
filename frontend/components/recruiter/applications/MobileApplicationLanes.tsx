'use client';

import { cn } from '@/lib/utils';
import type { ApplicationCardHandlers, ApplicationColumnId } from '@/types/recruiter-application';
import { Briefcase, ChevronDown, ChevronRight, Inbox } from 'lucide-react';
import { useState } from 'react';
import ApplicationCard from './ApplicationCard';
import type { JobLane } from './SwimlaneBoard';

interface MobileApplicationLanesProps {
  lanes: JobLane[];
  handlers: ApplicationCardHandlers;
  selectedIds: string[];
}

function getDefaultStatus(lane: JobLane): ApplicationColumnId {
  const firstFilled = lane.columns.find((column) => column.applications.length > 0);
  return firstFilled ? firstFilled.meta.id : lane.columns[0].meta.id;
}

export default function MobileApplicationLanes({ lanes, handlers, selectedIds }: MobileApplicationLanesProps) {
  const [collapsedJobIds, setCollapsedJobIds] = useState<string[]>([]);
  const [activeStatusByJob, setActiveStatusByJob] = useState<Record<string, ApplicationColumnId>>({});

  const toggleLane = (jobId: string) => {
    setCollapsedJobIds((previous) =>
      previous.includes(jobId) ? previous.filter((item) => item !== jobId) : [...previous, jobId],
    );
  };

  return (
    <div className="space-y-3">
      {lanes.map((lane) => {
        const isCollapsed = collapsedJobIds.includes(lane.jobId);
        const activeStatus = activeStatusByJob[lane.jobId] ?? getDefaultStatus(lane);
        const activeColumn = lane.columns.find((column) => column.meta.id === activeStatus) ?? lane.columns[0];

        return (
          <section key={lane.jobId} className="overflow-hidden rounded-2xl border border-[#e5e9ef] bg-white shadow-xs">
            <button
              type="button"
              onClick={() => toggleLane(lane.jobId)}
              aria-expanded={!isCollapsed}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-3 text-left"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 shrink-0 text-[#94a3b8]" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-[#94a3b8]" />
              )}

              <span className="text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Briefcase className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="text-navy block truncate text-[13.5px] font-bold">{lane.jobTitle}</span>
                <span className="block text-[11.5px] text-[#64748b]">{lane.applications.length} applications</span>
              </span>
            </button>

            {!isCollapsed && (
              <>
                <div className="-mx-px overflow-x-auto border-y border-[#eef1f5] bg-[#fafbfc]">
                  <div className="flex min-w-max gap-1 px-2 py-2">
                    {lane.columns.map((column) => {
                      const isActive = column.meta.id === activeStatus;
                      const isEmpty = column.applications.length === 0;

                      return (
                        <button
                          key={column.meta.id}
                          type="button"
                          onClick={() =>
                            setActiveStatusByJob((previous) => ({ ...previous, [lane.jobId]: column.meta.id }))
                          }
                          aria-pressed={isActive}
                          className={cn(
                            'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors',
                            isActive
                              ? 'bg-navy text-white'
                              : isEmpty
                                ? 'text-[#b6c0cb] hover:bg-white'
                                : 'text-[#475569] hover:bg-white',
                          )}
                        >
                          <span className={cn('h-1.5 w-1.5 rounded-full', column.meta.accentDotClassName)} />
                          {column.meta.label}
                          <span className={cn('font-black', isActive ? 'text-white/80' : 'text-[#94a3b8]')}>
                            {column.applications.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 p-3">
                  {activeColumn.applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#e2e8f0] py-10 text-center">
                      <Inbox className="h-5 w-5 text-[#cbd5e1]" />
                      <p className="text-[12px] font-semibold text-[#94a3b8]">No applications in this stage</p>
                      <p className="px-6 text-[11px] text-[#cbd5e1]">
                        Use the arrow button on a card to move someone here
                      </p>
                    </div>
                  ) : (
                    activeColumn.applications.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        variant="rich"
                        isSelected={selectedIds.includes(application.id)}
                        showJobTitle={false}
                        showStatusBadge={activeColumn.meta.id === 'CLOSED'}
                        onOpen={() => handlers.onOpen(application)}
                        onToggleSaved={() => handlers.onToggleSaved(application.id)}
                        onToggleSelected={() => handlers.onToggleSelected(application.id)}
                        onChangeStatus={(status) => handlers.onRequestStatusChange(application, status)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}

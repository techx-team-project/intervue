'use client';

import { APPLICATION_COLUMNS, getColumnIdForStatus } from '@/constants/application-status';
import type { ApplicationBoardColumn as BoardColumn, ApplicationBoardViewProps } from '@/hooks/useApplicationBoard';
import { ROUTES } from '@/constants/routes';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { Briefcase, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ApplicationBoardColumn from './ApplicationBoardColumn';
import MobileApplicationLanes from './MobileApplicationLanes';

export interface JobLane {
  jobId: string;
  jobTitle: string;
  applications: RecruiterApplication[];
  columns: BoardColumn[];
}

function buildLanes(applications: RecruiterApplication[]): JobLane[] {
  const grouped = new Map<string, RecruiterApplication[]>();

  applications.forEach((application) => {
    const current = grouped.get(application.jobId);
    if (current) {
      current.push(application);
    } else {
      grouped.set(application.jobId, [application]);
    }
  });

  return [...grouped.entries()]
    .map(([jobId, laneApplications]) => ({
      jobId,
      jobTitle: laneApplications[0].jobTitle,
      applications: laneApplications,
      columns: APPLICATION_COLUMNS.map((meta) => {
        const columnApplications = laneApplications.filter(
          (application) => getColumnIdForStatus(application.status) === meta.id,
        );
        return {
          meta,
          applications: columnApplications,
          newCount: columnApplications.filter((application) => !application.isViewed).length,
        };
      }),
    }))
    .sort((left, right) => right.applications.length - left.applications.length);
}

export default function SwimlaneBoard({ visibleApplications, handlers, selectedIds }: ApplicationBoardViewProps) {
  const [collapsedJobIds, setCollapsedJobIds] = useState<string[]>([]);
  const lanes = buildLanes(visibleApplications);

  const toggleLane = (jobId: string) => {
    setCollapsedJobIds((previous) =>
      previous.includes(jobId) ? previous.filter((item) => item !== jobId) : [...previous, jobId],
    );
  };

  if (lanes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#e5e9ef] bg-white py-20 text-center">
        <Briefcase className="text-outline h-9 w-9" />
        <p className="text-navy text-body-md font-bold">No applications match these filters</p>
        <p className="text-body-sm text-on-surface-variant max-w-sm">
          Try clearing the filters or picking another job post.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <MobileApplicationLanes lanes={lanes} handlers={handlers} selectedIds={selectedIds} />
      </div>

      <div className="hidden space-y-4 lg:block">
        {lanes.map((lane) => {
          const isCollapsed = collapsedJobIds.includes(lane.jobId);

          return (
            <section key={lane.jobId} className="rounded-xl border border-[#e5e9ef] bg-white">
              <header className="flex flex-wrap items-center gap-3 border-b border-[#eef1f5] px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleLane(lane.jobId)}
                  aria-expanded={!isCollapsed}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight className="text-outline h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronDown className="text-outline h-4 w-4 shrink-0" />
                  )}
                  <span className="text-navy bg-surface-container-low flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-navy text-body-md block truncate font-bold">{lane.jobTitle}</span>
                    <span className="text-label-sm text-on-surface-variant block">
                      {lane.applications.length} applications
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  {lane.columns
                    .filter((column) => column.applications.length > 0)
                    .map((column) => (
                      <span
                        key={column.meta.id}
                        title={column.meta.label}
                        className="bg-surface-container-low text-label-sm text-on-surface-variant inline-flex items-center gap-1 rounded-full border border-[#eef2f7] px-2 py-0.5 font-bold"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${column.meta.accentDotClassName}`} />
                        {column.applications.length}
                      </span>
                    ))}

                  <Link
                    href={`${ROUTES.RECRUITER_JOBS}/${lane.jobId}/edit`}
                    className="text-label-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View job post
                  </Link>
                </div>
              </header>

              {!isCollapsed && (
                <div className="-mx-1 overflow-x-auto px-1 py-3">
                  <div className="flex min-w-max items-stretch gap-3 px-3">
                    {lane.columns.map((column) => (
                      <ApplicationBoardColumn
                        key={column.meta.id}
                        column={column}
                        droppableId={`${lane.jobId}:${column.meta.id}`}
                        handlers={handlers}
                        cardVariant="rich"
                        headerStyle="plain"
                        totalVisible={lane.applications.length}
                        selectedIds={selectedIds}
                        showJobTitle={false}
                        showStatusBadge={column.meta.id === 'CLOSED'}
                        className="w-[304px] shrink-0"
                        bodyClassName="max-h-[34rem] min-h-[11rem]"
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

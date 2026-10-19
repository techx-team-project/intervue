'use client';

import { APPLICATION_COLUMNS, getColumnIdForStatus } from '@/constants/application-status';
import type { ApplicationBoardColumn as BoardColumn, ApplicationBoardViewProps } from '@/hooks/useApplicationBoard';
import { ROUTES } from '@/constants/routes';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { Briefcase, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ApplicationBoardColumn from './ApplicationBoardColumn';

interface JobLane {
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

export default function SwimlaneBoard({
  visibleApplications,
  handlers,
  activeApplicationId,
  selectedIds,
}: ApplicationBoardViewProps) {
  const [collapsedJobIds, setCollapsedJobIds] = useState<string[]>([]);
  const lanes = buildLanes(visibleApplications);

  const toggleLane = (jobId: string) => {
    setCollapsedJobIds((previous) =>
      previous.includes(jobId) ? previous.filter((item) => item !== jobId) : [...previous, jobId],
    );
  };

  if (lanes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#e5e9ef] bg-white py-20 text-center shadow-xs">
        <Briefcase className="h-9 w-9 text-[#cbd5e1]" />
        <p className="text-navy text-[14px] font-bold">Không có hồ sơ nào khớp bộ lọc</p>
        <p className="max-w-sm text-[12px] text-[#64748b]">Thử xoá bộ lọc hoặc chọn một tin tuyển dụng khác.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lanes.map((lane) => {
        const isCollapsed = collapsedJobIds.includes(lane.jobId);

        return (
          <section key={lane.jobId} className="rounded-2xl border border-[#e5e9ef] bg-white shadow-xs">
            <header className="flex flex-wrap items-center gap-3 border-b border-[#eef1f5] px-4 py-3">
              <button
                type="button"
                onClick={() => toggleLane(lane.jobId)}
                aria-expanded={!isCollapsed}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                )}
                <span className="text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <Briefcase className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="text-navy block truncate text-[14px] font-bold">{lane.jobTitle}</span>
                  <span className="block text-[11.5px] text-[#64748b]">{lane.applications.length} hồ sơ ứng tuyển</span>
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-1.5">
                {lane.columns
                  .filter((column) => column.applications.length > 0)
                  .map((column) => (
                    <span
                      key={column.meta.id}
                      title={column.meta.label}
                      className="inline-flex items-center gap-1 rounded-full border border-[#eef2f7] bg-[#f8fafc] px-2 py-0.5 text-[11px] font-bold text-[#475569]"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${column.meta.accentDotClassName}`} />
                      {column.applications.length}
                    </span>
                  ))}

                <Link
                  href={`${ROUTES.RECRUITER_JOBS}/${lane.jobId}/edit`}
                  className="ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-bold text-[#64748b] transition-colors hover:bg-slate-100 hover:text-slate-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  Xem tin
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
                      cardVariant="compact"
                      headerStyle="plain"
                      totalVisible={lane.applications.length}
                      activeApplicationId={activeApplicationId}
                      selectedIds={selectedIds}
                      showJobTitle={false}
                      showStatusBadge={column.meta.id === 'CLOSED'}
                      className="w-[240px] shrink-0"
                      bodyClassName="max-h-[22rem] min-h-[9rem]"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

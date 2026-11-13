'use client';

import Spinner from '@/components/common/Spinner';
import { useAdminJobInsights } from '@/hooks/useAdminJobs';
import { cn } from '@/lib/utils';
import { ADMIN_JOB_INSIGHT_WINDOWS } from '@/types/admin-job';
import { formatDate } from '@/utils/datetime';
import { useState } from 'react';

function formatHours(hours: number | null) {
  if (hours === null) return '—';
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} days`;
}

function formatPercent(rate: number | null) {
  return rate === null ? '—' : `${Math.round(rate * 100)}%`;
}

export default function AdminJobInsightsPanel() {
  const [days, setDays] = useState<number>(30);
  const { data, isLoading, isError } = useAdminJobInsights(days);

  if (isError) return null;

  const peak = Math.max(1, ...(data?.publishedPerDay.map((day) => day.count) ?? [0]));
  const totalPublished = data?.publishedPerDay.reduce((sum, day) => sum + day.count, 0) ?? 0;

  const stats = [
    { label: 'Waiting for review', value: data?.pendingReview ?? 0 },
    { label: 'Approval rate', value: formatPercent(data?.approvalRate ?? null) },
    { label: 'Avg. review time', value: formatHours(data?.avgReviewHours ?? null) },
    { label: 'Approved / rejected', value: `${data?.approved ?? 0} / ${data?.rejected ?? 0}` },
  ];

  return (
    <section
      aria-label="Job insights"
      className="border-outline-variant space-y-4 rounded-2xl border bg-white p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-on-surface text-sm font-bold">Moderation insights</h2>
        <div role="group" aria-label="Time window" className="flex gap-1">
          {ADMIN_JOB_INSIGHT_WINDOWS.map((window) => (
            <button
              key={window}
              type="button"
              aria-pressed={days === window}
              onClick={() => setDays(window)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
                days === window
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low',
              )}
            >
              {window} days
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface-container-low rounded-xl px-3 py-2.5">
                <dt className="text-on-surface-variant text-xs">{stat.label}</dt>
                <dd className="text-on-surface mt-0.5 text-xl font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
            <div>
              <p className="text-on-surface-variant mb-2 text-xs font-semibold">
                Jobs going live per day · {totalPublished} total
              </p>
              <div className="flex h-24 items-end gap-0.5" role="img" aria-label="Jobs going live per day">
                {data.publishedPerDay.map((day) => (
                  <div
                    key={day.date}
                    tabIndex={0}
                    aria-label={`${formatDate(day.date)}: ${day.count} ${day.count === 1 ? 'job' : 'jobs'}`}
                    className="group relative flex h-full min-w-0 flex-1 items-end outline-none"
                  >
                    <div
                      className={cn(
                        'w-full rounded-t transition-colors',
                        day.count > 0
                          ? 'bg-emerald-500 group-hover:bg-emerald-600 group-focus:bg-emerald-600'
                          : 'bg-emerald-100 group-hover:bg-emerald-200 group-focus:bg-emerald-200',
                      )}
                      style={{ height: `${Math.max(4, (day.count / peak) * 100)}%` }}
                    />
                    <span className="bg-navy pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-lg group-hover:block group-focus:block">
                      {formatDate(day.date)} · {day.count} {day.count === 1 ? 'job' : 'jobs'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-on-surface-variant mb-2 text-xs font-semibold">Most reported jobs (pending reports)</p>
              {data.mostReported.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No pending reports.</p>
              ) : (
                <ul className="space-y-1.5">
                  {data.mostReported.map((job) => (
                    <li key={job.jobId} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate">
                        <span className="text-on-surface font-medium">{job.title}</span>
                        <span className="text-outline"> · {job.companyName}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                        {job.pendingReports}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

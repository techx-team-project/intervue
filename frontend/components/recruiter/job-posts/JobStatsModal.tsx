'use client';

import Spinner from '@/components/common/Spinner';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useJobStats } from '@/hooks/useRecruiterJobs';
import ExportApplicantsButton from './ExportApplicantsButton';
import JobFunnel from './JobFunnel';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';

const RANGES = [7, 30] as const;
const BAR_AREA_PX = 128;
const MIN_BAR_PX = 2;

const numberFormatter = new Intl.NumberFormat('en-US');

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-outline-variant rounded-xl border p-4">
      <dt className="text-on-surface-variant text-xs font-semibold">{label}</dt>
      <dd className="text-navy mt-1 text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}

interface JobStatsModalProps {
  job: RecruiterJobPost | null;
  onClose: () => void;
}

export default function JobStatsModal({ job, onClose }: JobStatsModalProps) {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const { data, isLoading, error } = useJobStats(job ? Number(job.id) : null, days);
  const peak = Math.max(1, ...(data?.daily ?? []).map((day) => Math.max(day.views, day.applications)));
  const conversion = data?.conversionRate == null ? '—' : `${data.conversionRate.toFixed(1)}%`;

  return (
    <Modal isOpen={job !== null} onClose={onClose} title="Job post statistics" description={job?.title} maxWidth="lg">
      <div className="flex justify-end gap-1.5" role="tablist" aria-label="Time range">
        {RANGES.map((range) => (
          <button
            key={range}
            type="button"
            role="tab"
            aria-selected={days === range}
            onClick={() => setDays(range)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
              days === range
                ? 'border-primary bg-primary-light text-primary-deep'
                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low bg-white',
            )}
          >
            {range} days
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error || !data ? (
        <p className="py-8 text-center text-sm font-semibold text-rose-600">{getErrorMessage(error)}</p>
      ) : (
        <div className="mt-4 space-y-5">
          <dl className="grid grid-cols-3 gap-3">
            <Tile label="Views" value={numberFormatter.format(data.totalViews)} />
            <Tile label="Applications" value={numberFormatter.format(data.totalApplications)} />
            <Tile label="Conversion rate" value={conversion} />
          </dl>

          {job && <JobFunnel jobId={Number(job.id)} views={data.totalViews} />}

          {job && (
            <div className="flex justify-end">
              <ExportApplicantsButton jobId={Number(job.id)} jobTitle={job.title} />
            </div>
          )}

          {data.totalViews === 0 && data.totalApplications === 0 ? (
            <p className="text-on-surface-variant py-6 text-center text-sm">
              No views or applications in the last {days} days.
            </p>
          ) : (
            <div>
              <div
                role="img"
                aria-label={`Chart of views and applications over the last ${days} days`}
                className="flex items-end gap-0.5"
                style={{ height: BAR_AREA_PX }}
              >
                {data.daily.map((day) => (
                  <div
                    key={day.date}
                    className="flex h-full min-w-0 flex-1 items-end justify-center gap-px"
                    title={`${formatDate(day.date)}: ${day.views} views, ${day.applications} applications`}
                  >
                    <span
                      className="bg-primary/30 w-full rounded-t-sm"
                      style={{ height: Math.max(MIN_BAR_PX, (day.views / peak) * BAR_AREA_PX) }}
                    />
                    <span
                      className="bg-primary-deep w-full rounded-t-sm"
                      style={{ height: Math.max(0, (day.applications / peak) * BAR_AREA_PX) }}
                    />
                  </div>
                ))}
              </div>
              <div className="text-on-surface-variant mt-2 flex items-center justify-between text-xs">
                <span>{formatDate(data.daily[0].date)}</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="bg-primary/30 h-2.5 w-2.5 rounded-sm" aria-hidden />
                    Views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="bg-primary-deep h-2.5 w-2.5 rounded-sm" aria-hidden />
                    Applications
                  </span>
                </span>
                <span>{formatDate(data.daily[data.daily.length - 1].date)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

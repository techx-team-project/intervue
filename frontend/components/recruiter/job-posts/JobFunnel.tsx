'use client';

import Spinner from '@/components/common/Spinner';
import { useReviewCounts } from '@/hooks/useRecruiterApplications';
import type { CandidateApplicationStatus } from '@/types/candidate-application';

const numberFormatter = new Intl.NumberFormat('en-US');
const MIN_BAR_PERCENT = 3;

const STAGES: Array<{ label: string; statuses: CandidateApplicationStatus[] }> = [
  {
    label: 'Applications',
    statuses: ['APPLIED', 'VIEWED', 'IN_REVIEW', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN', 'JOB_CLOSED'],
  },
  { label: 'In review or further', statuses: ['IN_REVIEW', 'INTERVIEW', 'OFFER', 'HIRED'] },
  { label: 'Interview or further', statuses: ['INTERVIEW', 'OFFER', 'HIRED'] },
  { label: 'Offer or further', statuses: ['OFFER', 'HIRED'] },
  { label: 'Hired', statuses: ['HIRED'] },
];

interface JobFunnelProps {
  jobId: number;
  views: number;
}

export default function JobFunnel({ jobId, views }: JobFunnelProps) {
  const { data, isLoading } = useReviewCounts(jobId);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  const stages = [
    { label: 'Views', value: views },
    ...STAGES.map((stage) => ({
      label: stage.label,
      value: stage.statuses.reduce((sum, status) => sum + (data.byStatus[status] ?? 0), 0),
    })),
  ];
  const peak = Math.max(1, ...stages.map((stage) => stage.value));

  return (
    <section aria-label="Hiring funnel" className="space-y-2">
      <h3 className="text-on-surface text-sm font-bold">Hiring funnel</h3>
      <ul className="space-y-1.5">
        {stages.map((stage) => (
          <li key={stage.label} className="flex items-center gap-3 text-xs">
            <span className="text-on-surface-variant w-36 shrink-0">{stage.label}</span>
            <span className="bg-surface-container-low h-5 flex-1 overflow-hidden rounded">
              <span
                className="bg-primary-deep block h-full rounded"
                style={{ width: `${Math.max(MIN_BAR_PERCENT, (stage.value / peak) * 100)}%` }}
              />
            </span>
            <span className="text-navy w-12 shrink-0 text-right font-bold tabular-nums">
              {numberFormatter.format(stage.value)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-on-surface-variant text-xs">
        Counted by current status, so a rejected candidate is not counted in later stages.
      </p>
    </section>
  );
}

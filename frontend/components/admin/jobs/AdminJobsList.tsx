'use client';

import JobPostStatusBadge from '@/components/recruiter/job-posts/JobPostStatusBadge';
import { Button } from '@/components/ui/Button';
import type { AdminJobSummaryResource } from '@/types/admin-job';
import { formatDate } from '@/utils/datetime';
import { formatSalary } from '@/utils/public-company';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';

interface AdminJobsListProps {
  jobs: AdminJobSummaryResource[];
  onView: (job: AdminJobSummaryResource) => void;
  onHide: (job: AdminJobSummaryResource) => void;
  onRestore: (job: AdminJobSummaryResource) => void;
}

const HIDEABLE = new Set(['PUBLISHED', 'PAUSED']);

export default function AdminJobsList({ jobs, onView, onHide, onRestore }: AdminJobsListProps) {
  return (
    <ul className="divide-outline-variant border-outline-variant divide-y overflow-hidden rounded-2xl border bg-white shadow-xs">
      {jobs.map((job) => (
        <li key={job.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onView(job)}
                className="text-navy truncate text-left text-sm font-bold hover:underline"
              >
                {job.title}
              </button>
              <JobPostStatusBadge status={job.status} />
            </div>
            <p className="text-on-surface-variant text-xs">
              {job.companyName}
              {job.city && ` · ${job.city}`} · {formatSalary(job.salary)}
              {job.deadline && ` · Deadline ${formatDate(job.deadline)}`}
            </p>
            {job.hiddenReason && <p className="text-xs font-medium text-rose-600">Reason: {job.hiddenReason}</p>}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />} onClick={() => onView(job)}>
              View
            </Button>
            {HIDEABLE.has(job.status) && (
              <Button variant="outline" size="sm" leftIcon={<EyeOff className="h-4 w-4" />} onClick={() => onHide(job)}>
                Hide
              </Button>
            )}
            {job.status === 'HIDDEN_BY_ADMIN' && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={() => onRestore(job)}
              >
                Restore
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

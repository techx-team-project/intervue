'use client';

import type { useJobPostActions } from '@/hooks/useJobPostActions';
import { cn } from '@/lib/utils';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { formatDate } from '@/utils/datetime';
import { CalendarClock, MapPin, Users } from 'lucide-react';
import JobPostRowActionsMenu from './JobPostRowActionsMenu';
import JobPostStatusBadge from './JobPostStatusBadge';

interface JobPostsMobileListProps {
  jobs: RecruiterJobPost[];
  actions: ReturnType<typeof useJobPostActions>;
  onPreview: (job: RecruiterJobPost) => void;
  onViewRejectionReason: (job: RecruiterJobPost) => void;
}

export default function JobPostsMobileList({
  jobs,
  actions,
  onPreview,
  onViewRejectionReason,
}: JobPostsMobileListProps) {
  return (
    <div className="space-y-2.5">
      {jobs.map((job) => {
        const isPending = actions.pendingId === job.id;

        return (
          <article
            key={job.id}
            className={cn(
              'rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs transition',
              isPending && 'opacity-50',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-navy text-[14px] leading-snug font-bold">{job.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#64748b]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
                  <span className="truncate">
                    {job.location.city}
                    {job.location.district ? `, ${job.location.district}` : ''}
                  </span>
                </p>
              </div>

              <JobPostRowActionsMenu
                job={job}
                isPending={isPending}
                onPause={() => actions.pauseJob(job.id)}
                onReopen={() => actions.reopenJob(job.id)}
                onClose={() => actions.closeJob(job.id)}
                onExtend={() => actions.extendJob(job.id)}
                onSubmitForReview={() => actions.submitForReview(job.id)}
                onRepost={() => actions.repostJob(job.id)}
                onDuplicate={() => actions.duplicateJob(job.id)}
                onPreview={() => onPreview(job)}
                onViewRejectionReason={() => onViewRejectionReason(job)}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f1f5f9] pt-3">
              <JobPostStatusBadge status={job.status} />

              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#475569]">
                <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
                {job.recruitsCount} people
              </span>

              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[#94a3b8]">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDate(job.updatedAt)}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

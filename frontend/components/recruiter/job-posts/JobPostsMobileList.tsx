'use client';

import Switch from '@/components/ui/Switch';
import { JOB_ARRANGEMENT_LABELS, JOB_LEVEL_LABELS, getJobExpiryDetails } from '@/constants/recruiter-job';
import { ROUTES } from '@/constants/routes';
import type { useJobPostActions } from '@/hooks/useJobPostActions';
import { cn } from '@/lib/utils';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { formatDate } from '@/utils/datetime';
import { ArrowUpRight, Check, Flame, Link2, MapPin, Pencil, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import JobPostRowActionsMenu from './JobPostRowActionsMenu';
import JobPostStatusBadge from './JobPostStatusBadge';

interface JobPostsMobileListProps {
  jobs: RecruiterJobPost[];
  actions: ReturnType<typeof useJobPostActions>;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onViewRejectionReason: (job: RecruiterJobPost) => void;
  onCopyLink: (jobId: string) => void;
}

export default function JobPostsMobileList({
  jobs,
  actions,
  selectedIds,
  onToggleSelect,
  onViewRejectionReason,
  onCopyLink,
}: JobPostsMobileListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleMobileCopy = (id: string) => {
    onCopyLink(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
  };

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const isPending = actions.pendingId === job.id || actions.pendingId === 'bulk';
        const isSelected = selectedIds.has(job.id);
        const expiry = getJobExpiryDetails(job.expiresAt, job.status);
        const canToggle = job.status === 'PUBLISHED' || job.status === 'PAUSED';

        return (
          <article
            key={job.id}
            className={cn(
              'rounded-2xl border bg-white p-4 shadow-xs transition-colors',
              isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200',
              isPending && 'opacity-50',
            )}
          >
            {/* Top row: Checkbox + Badges + Menu */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(job.id)}
                  aria-label={`Select ${job.title}`}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />

                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-orange-300/60 bg-orange-50 px-1.5 py-0.5 text-[10.5px] font-bold text-orange-600">
                    <Flame className="h-3 w-3 fill-orange-500" />
                    Urgent
                  </span>
                )}

                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-amber-300/60 bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-bold text-amber-700">
                    <Sparkles className="h-3 w-3 fill-amber-500" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMobileCopy(job.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  title={copiedId === job.id ? 'Copied!' : 'Copy public link'}
                >
                  {copiedId === job.id ? (
                    <Check className="animate-in zoom-in-75 h-4 w-4 text-emerald-600 duration-150" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </button>

                <Link
                  href={`${ROUTES.RECRUITER_JOBS}/${job.id}/edit`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  title="Edit job"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

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
                  onViewRejectionReason={() => onViewRejectionReason(job)}
                  onCopyLink={() => onCopyLink(job.id)}
                  onDelete={() => actions.deleteJob(job.id)}
                />
              </div>
            </div>

            {/* Title & metadata */}
            <div className="mt-2">
              <Link
                href={`${ROUTES.RECRUITER_JOBS}/${job.id}/edit`}
                className="text-navy text-[15px] leading-snug font-bold transition-colors hover:text-emerald-600"
              >
                {job.title}
              </Link>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  {JOB_LEVEL_LABELS[job.level]}
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  {JOB_ARRANGEMENT_LABELS[job.workingArrangement]}
                </span>
                <span className="flex items-center gap-1 text-[11.5px] text-slate-500">
                  <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                  <span>{job.location.city}</span>
                </span>
              </div>
            </div>

            {/* Skills chips */}
            {job.skills && job.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {job.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="py-0.2 rounded border border-slate-200 bg-slate-50 px-1.5 text-[10.5px] font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="text-[10px] font-bold text-slate-400">+{job.skills.length - 3} more</span>
                )}
              </div>
            )}

            {/* Mid row: Status + Quick Toggle */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <JobPostStatusBadge status={job.status} />
                {canToggle && (
                  <Switch
                    checked={job.status === 'PUBLISHED'}
                    onChange={() => actions.toggleJobStatus(job.id, job.status)}
                    size="sm"
                    disabled={isPending}
                    ariaLabel="Toggle active status"
                  />
                )}
              </div>

              {job.status !== 'DRAFT' && (
                <Link
                  href={`${ROUTES.RECRUITER_APPLICATIONS}?job=${job.id}`}
                  className="group flex items-center gap-1 text-xs font-bold text-slate-700 transition-colors hover:text-emerald-600"
                >
                  <Users className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600" />
                  <span>{job.applicantsCount ?? 0} applicants</span>
                  {(job.newApplicantsCount ?? 0) > 0 && (
                    <span className="py-0.2 rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold text-emerald-800">
                      +{job.newApplicantsCount}
                    </span>
                  )}
                  <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-emerald-600" />
                </Link>
              )}
            </div>

            {/* Bottom row: Expiry progress */}
            {job.expiresAt && job.status !== 'DRAFT' && (
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className={`font-bold ${
                      expiry.tone === 'danger'
                        ? 'text-rose-600'
                        : expiry.tone === 'warning'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                    }`}
                  >
                    {expiry.label}
                  </span>
                  <span className="text-slate-400">{formatDate(job.expiresAt)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      expiry.tone === 'danger'
                        ? 'bg-rose-500'
                        : expiry.tone === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, expiry.progressPercent))}%` }}
                  />
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

'use client';

import Modal from '@/components/ui/Modal';
import Switch from '@/components/ui/Switch';
import { JOB_ARRANGEMENT_LABELS, JOB_LEVEL_LABELS, getJobExpiryDetails } from '@/constants/recruiter-job';
import { ROUTES } from '@/constants/routes';
import type { useJobPostActions } from '@/hooks/useJobPostActions';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { formatDate } from '@/utils/datetime';
import { AlertCircle, ArrowUpRight, Flame, Link2, MapPin, Pencil, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import JobPostPreviewModal from './JobPostPreviewModal';
import JobPostRowActionsMenu from './JobPostRowActionsMenu';
import JobPostStatusBadge from './JobPostStatusBadge';
import JobPostsMobileList from './JobPostsMobileList';

interface JobPostsTableProps {
  jobs: RecruiterJobPost[];
  actions: ReturnType<typeof useJobPostActions>;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function JobPostsTable({
  jobs,
  actions,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  isAllSelected,
}: JobPostsTableProps) {
  const [previewJob, setPreviewJob] = useState<RecruiterJobPost | null>(null);
  const [rejectionJob, setRejectionJob] = useState<RecruiterJobPost | null>(null);

  const handleCopyLink = (jobId: string) => {
    const url =
      typeof window !== 'undefined' ? `${window.location.origin}/jobs/${jobId}` : `https://intervue.vn/jobs/${jobId}`;
    navigator.clipboard.writeText(url);
    toast.success('Public job post link copied to clipboard!');
  };

  return (
    <>
      {/* Mobile Card View (< lg) */}
      <div className="lg:hidden">
        <JobPostsMobileList
          jobs={jobs}
          actions={actions}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onPreview={setPreviewJob}
          onViewRejectionReason={setRejectionJob}
          onCopyLink={handleCopyLink}
        />
      </div>

      {/* Desktop Smart Data Table (>= lg) */}
      <div className="hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:block">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            {/* Table Header */}
            <div className="grid grid-cols-[40px_3.2fr_1.3fr_1.4fr_1.5fr_104px] items-center gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected && jobs.length > 0}
                  onChange={onSelectAll}
                  aria-label="Select all jobs on page"
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <span>Job Post</span>
              <span>Status</span>
              <span>Applicants</span>
              <span>Expiry & Timeline</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
              {jobs.map((job) => {
                const isPending = actions.pendingId === job.id || actions.pendingId === 'bulk';
                const isSelected = selectedIds.has(job.id);
                const expiry = getJobExpiryDetails(job.expiresAt, job.status);
                const canToggle = job.status === 'PUBLISHED' || job.status === 'PAUSED';

                return (
                  <div
                    key={job.id}
                    className={`grid grid-cols-[40px_3.2fr_1.3fr_1.4fr_1.5fr_104px] items-center gap-4 px-4 py-3.5 transition-colors ${
                      isSelected ? 'bg-emerald-50/30' : isPending ? 'opacity-50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* 1. Selection Checkbox */}
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(job.id)}
                        aria-label={`Select job ${job.title}`}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>

                    {/* 2. Job Post Details */}
                    <div className="min-w-0 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`${ROUTES.RECRUITER_JOBS}/${job.id}/edit`}
                          className="text-navy truncate text-sm font-bold transition-colors hover:text-emerald-600"
                        >
                          {job.title}
                        </Link>

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

                      {/* Sub-info chips */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {JOB_LEVEL_LABELS[job.level]}
                        </span>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {JOB_ARRANGEMENT_LABELS[job.workingArrangement]}
                        </span>
                        <span className="flex items-center gap-1 text-[11.5px] text-slate-500">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">
                            {job.location.district ? `${job.location.district}, ` : ''}
                            {job.location.city}
                          </span>
                        </span>
                      </div>

                      {/* Skills Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
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
                    </div>

                    {/* 3. Status & Quick Toggle */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <JobPostStatusBadge status={job.status} />
                        {canToggle && (
                          <div title={job.status === 'PUBLISHED' ? 'Click to pause' : 'Click to reopen'}>
                            <Switch
                              checked={job.status === 'PUBLISHED'}
                              onChange={() => actions.toggleJobStatus(job.id, job.status)}
                              size="sm"
                              disabled={isPending}
                              ariaLabel="Toggle active status"
                            />
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">Updated {formatDate(job.updatedAt)}</p>
                    </div>

                    {/* 4. Applicants Column */}
                    <div className="min-w-0">
                      {job.status === 'DRAFT' ? (
                        <span className="text-xs font-medium text-slate-400">—</span>
                      ) : (
                        <Link
                          href={`${ROUTES.RECRUITER_APPLICATIONS}?job=${job.id}`}
                          className="group inline-flex flex-col text-left transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-emerald-600" />
                            <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-emerald-600">
                              {job.applicantsCount ?? 0} applicants
                            </span>
                            <ArrowUpRight className="h-3 w-3 text-slate-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600 group-hover:opacity-100" />
                          </div>

                          {(job.newApplicantsCount ?? 0) > 0 && (
                            <span className="mt-1 inline-flex w-fit items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-800">
                              +{job.newApplicantsCount} new
                            </span>
                          )}
                        </Link>
                      )}
                    </div>

                    {/* 5. Expiry & Timeline */}
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-bold ${
                            expiry.tone === 'danger'
                              ? 'text-rose-600'
                              : expiry.tone === 'warning'
                                ? 'text-amber-600'
                                : expiry.tone === 'normal'
                                  ? 'text-slate-700'
                                  : 'text-slate-400'
                          }`}
                        >
                          {expiry.label}
                        </span>
                        {job.expiresAt && (
                          <span className="text-[11px] text-slate-400">{formatDate(job.expiresAt)}</span>
                        )}
                      </div>

                      {/* Visual progress bar */}
                      {job.expiresAt && job.status !== 'DRAFT' && (
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
                      )}
                    </div>

                    {/* 6. Quick Actions */}
                    <div className="flex items-center justify-end gap-1">
                      {/* Copy link button */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(job.id)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                        title="Copy public link"
                      >
                        <Link2 className="h-4 w-4" />
                      </button>

                      {/* Edit button */}
                      <Link
                        href={`${ROUTES.RECRUITER_JOBS}/${job.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                        title="Edit job post"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      {/* More actions dropdown */}
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
                        onPreview={() => setPreviewJob(job)}
                        onViewRejectionReason={() => setRejectionJob(job)}
                        onCopyLink={() => handleCopyLink(job.id)}
                        onDelete={() => actions.deleteJob(job.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Candidate Modal */}
      {previewJob && <JobPostPreviewModal job={previewJob} onClose={() => setPreviewJob(null)} />}

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectionJob !== null}
        onClose={() => setRejectionJob(null)}
        title="Rejection Reason"
        maxWidth="md"
      >
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold tracking-wide text-rose-800 uppercase">Admin feedback</h4>
            <p className="text-[13.5px] leading-relaxed text-rose-700">
              {rejectionJob?.rejectionReason || 'No specific reason provided.'}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

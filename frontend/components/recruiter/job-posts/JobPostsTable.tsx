'use client';

import Modal from '@/components/ui/Modal';
import type { useJobPostActions } from '@/hooks/useJobPostActions';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import JobPostPreviewModal from './JobPostPreviewModal';
import JobPostRowActionsMenu from './JobPostRowActionsMenu';
import JobPostStatusBadge from './JobPostStatusBadge';

interface JobPostsTableProps {
  jobs: RecruiterJobPost[];
  actions: ReturnType<typeof useJobPostActions>;
}

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function JobPostsTable({ jobs, actions }: JobPostsTableProps) {
  const [previewJob, setPreviewJob] = useState<RecruiterJobPost | null>(null);
  const [rejectionJob, setRejectionJob] = useState<RecruiterJobPost | null>(null);

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <div className="overflow-x-auto">
        <div className="min-w-180">
          <div className="grid grid-cols-[3fr_1.2fr_1fr_1fr_auto] gap-4 border-b border-[#f1f5f9] px-2.5 pb-2.5 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">
            <span>Job post</span>
            <span>Status</span>
            <span>Openings</span>
            <span>Updated</span>
            <span />
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {jobs.map((job) => {
              const isPending = actions.pendingId === job.id;

              return (
                <div
                  key={job.id}
                  className={`grid grid-cols-[3fr_1.2fr_1fr_1fr_auto] items-center gap-4 rounded-lg px-2.5 py-3.5 transition ${
                    isPending ? 'opacity-50' : 'hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-navy truncate text-[13.5px] font-bold">{job.title}</p>
                    <p className="truncate text-[12px] text-[#64748b]">
                      {job.location.city}
                      {job.location.district ? `, ${job.location.district}` : ''}
                    </p>
                  </div>

                  <span>
                    <JobPostStatusBadge status={job.status} />
                  </span>

                  <span className="text-[12.5px] text-[#475569]">{job.recruitsCount} people</span>

                  <span className="text-[11.5px] text-[#94a3b8]">{dateFormatter.format(new Date(job.updatedAt))}</span>

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
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {previewJob && <JobPostPreviewModal job={previewJob} onClose={() => setPreviewJob(null)} />}

      <Modal
        isOpen={rejectionJob !== null}
        onClose={() => setRejectionJob(null)}
        title="Rejection reason"
        maxWidth="md"
      >
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <p className="text-[13.5px] leading-relaxed text-rose-700">{rejectionJob?.rejectionReason}</p>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import Spinner from '@/components/common/Spinner';
import JobPostStatusBadge from '@/components/recruiter/job-posts/JobPostStatusBadge';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import { useAdminJob } from '@/hooks/useAdminJobs';
import { getErrorMessage } from '@/utils/error';
import { formatSalary } from '@/utils/public-company';

interface AdminJobPreviewModalProps {
  jobId: number;
  onClose: () => void;
}

function Block({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <section className="space-y-1">
      <h4 className="text-on-surface-variant text-xs font-bold tracking-wide uppercase">{title}</h4>
      <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-line">{text}</p>
    </section>
  );
}

export default function AdminJobPreviewModal({ jobId, onClose }: AdminJobPreviewModalProps) {
  const { data: job, isLoading, error } = useAdminJob(jobId);

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title={job?.title ?? 'Job details'}
      footer={
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error || !job ? (
        <p className="py-6 text-center text-sm font-semibold text-rose-600">{getErrorMessage(error)}</p>
      ) : (
        <div className="space-y-4">
          <div className="text-on-surface-variant flex flex-wrap items-center gap-2 text-xs">
            <JobPostStatusBadge status={job.status} />
            <span className="text-on-surface font-semibold">{job.companyName}</span>
            {job.location.city && <span>· {job.location.city}</span>}
            {job.level && <span>· {JOB_LEVEL_LABELS[job.level]}</span>}
            {job.contractType && <span>· {JOB_CONTRACT_LABELS[job.contractType]}</span>}
            {job.workingArrangement && <span>· {JOB_ARRANGEMENT_LABELS[job.workingArrangement]}</span>}
            <span>· {formatSalary(job.salary)}</span>
          </div>

          {job.hiddenReason && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              Hidden: {job.hiddenReason}
            </p>
          )}

          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          <Block title="Description" text={job.description} />
          <Block title="Requirements" text={job.requirements} />
          <Block title="Benefits" text={job.benefits} />
        </div>
      )}
    </Modal>
  );
}

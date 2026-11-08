'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useApplyForm } from '@/hooks/useCandidateApplication';
import { useCandidateCvs } from '@/hooks/useCandidateCvs';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ApplyDraftForm from './ApplyDraftForm';
import ApplyReapplyView from './ApplyReapplyView';
import ApplySubmittedView from './ApplySubmittedView';

interface ApplyJob {
  id: number;
  title: string;
  companyName: string;
  requirements: string[];
  description?: string;
}

interface CandidateApplyModalProps {
  job: ApplyJob;
  isOpen: boolean;
  onClose: () => void;
}

function ApplyContent({ job }: { job: ApplyJob }) {
  const form = useApplyForm(job.id, true);
  const resumes = useCandidateCvs();
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (form.isLoading || resumes.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }
  if (form.isError || resumes.isError || !form.data || !resumes.data) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-error text-sm font-semibold">{getErrorMessage(form.error ?? resumes.error)}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            form.refetch();
            resumes.refetch();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  const application = form.data.application;

  if (justSubmitted && application) {
    return <ApplySubmittedView application={application} />;
  }
  if (application && application.status !== 'DRAFT' && application.status !== 'WITHDRAWN') {
    return <ApplySubmittedView application={application} />;
  }
  if (application?.status === 'WITHDRAWN') {
    return <ApplyReapplyView application={application} resumes={resumes.data} open={form.data.open} />;
  }
  if (!form.data.open) {
    return <p className="text-on-surface-variant py-8 text-center text-sm font-semibold">This job post is closed.</p>;
  }

  return (
    <ApplyDraftForm
      jobTitle={job.title}
      companyName={job.companyName}
      requirements={job.requirements}
      description={job.description}
      form={form.data}
      resumes={resumes.data}
      onSubmitted={() => setJustSubmitted(true)}
    />
  );
}

export default function CandidateApplyModal({ job, isOpen, onClose }: CandidateApplyModalProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const isCandidate = isAuthenticated && hasRole('CANDIDATE');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title="Apply for this job"
      description={`${job.title} - ${job.companyName}`}
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : isCandidate ? (
        <ApplyContent job={job} />
      ) : isAuthenticated ? (
        <p className="text-on-surface-variant py-8 text-center text-sm">
          Your current account is not a candidate account, so you cannot apply.
        </p>
      ) : (
        <div className="space-y-4 py-6 text-center">
          <CheckCircle2 className="text-primary mx-auto h-10 w-10" aria-hidden />
          <p className="text-on-surface-variant text-sm">
            Sign in with a candidate account to apply for this position.
          </p>
          <Link href={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/jobs/${job.id}`)}`}>
            <Button>Sign in to apply</Button>
          </Link>
        </div>
      )}
    </Modal>
  );
}

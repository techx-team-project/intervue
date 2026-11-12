'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useRecruiterJob } from '@/hooks/useRecruiterJobs';
import { getErrorMessage } from '@/utils/error';
import { emptyFormValues, toFormValues } from '@/utils/recruiter-job';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import JobPostWizard from './form/JobPostWizard';

const EDITABLE_STATUSES = ['DRAFT', 'PUBLISHED', 'PAUSED'];

interface JobPostFormViewProps {
  jobId?: number;
}

function Notice({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-outline-variant mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-white px-6 py-14 text-center shadow-xs">
      <h2 className="text-on-surface text-base font-bold">{title}</h2>
      <p className="text-on-surface-variant text-sm">{description}</p>
      <Link href={ROUTES.RECRUITER_JOBS}>
        <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to job posts
        </Button>
      </Link>
    </div>
  );
}

export default function JobPostFormView({ jobId }: JobPostFormViewProps) {
  const { data: job, isLoading, error } = useRecruiterJob(jobId ?? null);

  if (jobId === undefined) {
    return <JobPostWizard initialValues={emptyFormValues()} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error || !job) {
    return <Notice title="Could not load the job post" description={getErrorMessage(error)} />;
  }

  if (!EDITABLE_STATUSES.includes(job.status)) {
    return (
      <Notice
        title="This job post cannot be edited"
        description="Closed, expired or admin-hidden job posts cannot be edited."
      />
    );
  }

  return <JobPostWizard key={job.id} jobId={job.id} status={job.status} initialValues={toFormValues(job)} />;
}

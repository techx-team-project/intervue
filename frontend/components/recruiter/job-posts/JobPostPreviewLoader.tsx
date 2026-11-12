'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useRecruiterJob } from '@/hooks/useRecruiterJobs';
import { getErrorMessage } from '@/utils/error';
import { resourceToJobPost } from '@/utils/recruiter-job';
import Link from 'next/link';
import JobPostPreviewPageView from './JobPostPreviewPageView';

interface JobPostPreviewLoaderProps {
  jobId: number;
}

export default function JobPostPreviewLoader({ jobId }: JobPostPreviewLoaderProps) {
  const { data: job, isLoading, error } = useRecruiterJob(jobId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 text-center">
        <p className="text-on-surface text-sm font-semibold">{getErrorMessage(error)}</p>
        <Link href={ROUTES.RECRUITER_JOBS}>
          <Button variant="outline">Back to job posts</Button>
        </Link>
      </div>
    );
  }

  return <JobPostPreviewPageView initialJob={resourceToJobPost(job)} />;
}

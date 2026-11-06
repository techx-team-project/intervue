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
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-xs">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
      <Link href={ROUTES.RECRUITER_JOBS}>
        <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Về danh sách tin
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
    return <Notice title="Không tải được tin tuyển dụng" description={getErrorMessage(error)} />;
  }

  if (!EDITABLE_STATUSES.includes(job.status)) {
    return (
      <Notice
        title="Tin này không thể chỉnh sửa"
        description="Tin đã đóng, hết hạn hoặc bị ẩn bởi quản trị viên không thể sửa nội dung."
      />
    );
  }

  return <JobPostWizard key={job.id} jobId={job.id} status={job.status} initialValues={toFormValues(job)} />;
}

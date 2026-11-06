import JobPostPreviewLoader from '@/components/recruiter/job-posts/JobPostPreviewLoader';
import { notFound } from 'next/navigation';

interface JobPostPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPostPreviewPage({ params }: JobPostPreviewPageProps) {
  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) notFound();

  return <JobPostPreviewLoader jobId={jobId} />;
}

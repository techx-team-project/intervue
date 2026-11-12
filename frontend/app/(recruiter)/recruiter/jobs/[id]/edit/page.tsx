import JobPostFormView from '@/components/recruiter/job-posts/JobPostFormView';
import PageHeader from '@/components/recruiter/PageHeader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { notFound } from 'next/navigation';

interface EditJobPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPostPage({ params }: EditJobPostPageProps) {
  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) notFound();

  return (
    <>
      <Breadcrumb
        showHome={false}
        items={[{ label: 'Job posts', href: ROUTES.RECRUITER_JOBS }, { label: 'Edit' }]}
        className="mb-3"
      />
      <PageHeader title="Edit job post" />
      <JobPostFormView jobId={jobId} />
    </>
  );
}

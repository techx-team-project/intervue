import JobPostFormView from '@/components/recruiter/job-posts/JobPostFormView';
import PageHeader from '@/components/recruiter/PageHeader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { getRecruiterJobById } from '@/mocks/job.mock';
import { notFound } from 'next/navigation';

interface EditJobPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPostPage({ params }: EditJobPostPageProps) {
  const { id } = await params;
  const job = getRecruiterJobById(id);

  if (!job) notFound();

  return (
    <>
      <Breadcrumb
        showHome={false}
        items={[{ label: 'Job posts', href: ROUTES.RECRUITER_JOBS }, { label: 'Edit' }]}
        className="mb-3"
      />
      <PageHeader title={`Edit: ${job.title}`} />
      <JobPostFormView mode="edit" initialData={job} />
    </>
  );
}

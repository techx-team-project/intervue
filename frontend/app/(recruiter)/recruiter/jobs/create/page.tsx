import JobPostFormView from '@/components/recruiter/job-posts/JobPostFormView';
import PageHeader from '@/components/recruiter/PageHeader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';

export default function CreateJobPostPage() {
  return (
    <>
      <Breadcrumb
        showHome={false}
        items={[{ label: 'Job posts', href: ROUTES.RECRUITER_JOBS }, { label: 'Create' }]}
        className="mb-3"
      />
      <PageHeader title="New job post" />
      <JobPostFormView mode="create" />
    </>
  );
}

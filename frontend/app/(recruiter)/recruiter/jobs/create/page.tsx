import JobPostFormView from '@/components/recruiter/job-posts/JobPostFormView';
import PageHeader from '@/components/recruiter/PageHeader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';

export default function CreateJobPostPage() {
  return (
    <>
      <Breadcrumb
        showHome={false}
        items={[{ label: 'Job posts', href: ROUTES.RECRUITER_JOBS }, { label: 'Post a new job' }]}
        className="mb-3"
      />
      <PageHeader title="Post a job" description="Complete 3 short steps. You can save a draft at any time." />
      <JobPostFormView />
    </>
  );
}

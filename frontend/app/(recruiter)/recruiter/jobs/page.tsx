import JobPostsListView from '@/components/recruiter/job-posts/JobPostsListView';
import PageHeader from '@/components/recruiter/PageHeader';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function RecruiterJobsPage() {
  return (
    <>
      <PageHeader
        title="Job posts"
        description="Manage all of your job posts"
        actions={
          <Link href={ROUTES.RECRUITER_JOBS_CREATE}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Post a new job</Button>
          </Link>
        }
      />
      <JobPostsListView />
    </>
  );
}

import JobPostsListView from '@/components/recruiter/job-posts/JobPostsListView';
import PageHeader from '@/components/recruiter/PageHeader';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { MOCK_RECRUITER_JOB_POSTS } from '@/mocks/job.mock';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering so the mock fetch delay (and loading.tsx) run on every
// visit instead of only once at build time, matching how a real API call would behave.
export const dynamic = 'force-dynamic';

const MOCK_FETCH_DELAY_MS = 1200;

// TEMP: simulated network latency until the job posts API exists
async function getJobPosts() {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_DELAY_MS));
  return MOCK_RECRUITER_JOB_POSTS;
}

export default async function RecruiterJobsPage() {
  const jobs = await getJobPosts();

  return (
    <>
      <PageHeader
        title="Tin tuyển dụng"
        description="Quản lý toàn bộ tin tuyển dụng của bạn"
        actions={
          <Link href={ROUTES.RECRUITER_JOBS_CREATE}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Đăng tin mới</Button>
          </Link>
        }
      />
      <JobPostsListView initialJobs={jobs} />
    </>
  );
}

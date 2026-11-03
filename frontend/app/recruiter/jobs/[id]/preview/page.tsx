import JobPostPreviewPageView from '@/components/recruiter/job-posts/JobPostPreviewPageView';
import { getRecruiterJobById } from '@/mocks/job.mock';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface JobPostPreviewPageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_DRAFT_JOB: RecruiterJobPost = {
  id: 'draft',
  title: 'Untitled Job Post',
  status: 'DRAFT',
  level: 'MID',
  contractType: 'FULL_TIME',
  workingArrangement: 'HYBRID',
  location: { city: 'Hà Nội', district: 'Cầu Giấy' },
  salary: { negotiable: true, currency: 'VND' },
  skills: ['TypeScript', 'React', 'Next.js'],
  description: 'Mô tả chi tiết công việc, nhiệm vụ chính và các mục tiêu của vị trí này.',
  requirements: 'Yêu cầu kinh nghiệm, kỹ năng chuyên môn, tinh thần làm việc nhóm và giải quyết vấn đề.',
  benefits: 'Lương thưởng cạnh tranh, bảo hiểm sức khỏe toàn diện, thiết bị làm việc hiện đại, du lịch hằng năm.',
  screeningQuestions: [],
  recruitsCount: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default async function JobPostPreviewPage({ params }: JobPostPreviewPageProps) {
  const { id } = await params;

  if (id === 'draft' || id === 'new') {
    return <JobPostPreviewPageView initialJob={FALLBACK_DRAFT_JOB} jobId={id} />;
  }

  const job = getRecruiterJobById(id);

  if (!job) {
    notFound();
  }

  return <JobPostPreviewPageView initialJob={job} jobId={id} />;
}

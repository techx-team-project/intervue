import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import JobDetailView from '@/components/job-detail/JobDetailView';
import { getJobDetailById, MOCK_RELATED_JOBS } from '@/mocks/job-detail.mock';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobDetailById(id);

  return {
    title: `${job.title} | ${job.company.name} - InterVue`,
    description: `Tuyển dụng ${job.title} tại ${job.company.name} (${job.location.city}). Mức lương ${job.salary.display}, kinh nghiệm ${job.experience}. Ứng tuyển ngay trên InterVue.`,
    openGraph: {
      title: `${job.title} - ${job.company.name}`,
      description: `Mức lương: ${job.salary.display} • Địa điểm: ${job.location.city} • Hạn nộp: ${job.deadline}`,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = getJobDetailById(id);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Job Detail Page View */}
      <main className="flex-1">
        <JobDetailView job={job} relatedJobs={MOCK_RELATED_JOBS} />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}

import { publicJobApi } from '@/apiRequest/public-job';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import PublicJobDetailView from '@/components/jobs/PublicJobDetailView';
import { formatSalary } from '@/utils/public-company';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

async function loadJob(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();
  try {
    return await publicJobApi.get(id);
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await loadJob(id);
  const city = job.location.city ? ` (${job.location.city})` : '';

  return {
    title: `${job.title} | ${job.company.name} - InterVue`,
    description: `Tuyển dụng ${job.title} tại ${job.company.name}${city}. Mức lương ${formatSalary(job.salary)}. Ứng tuyển ngay trên InterVue.`,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await loadJob(id);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      <Header />
      <main className="flex-1">
        <PublicJobDetailView job={job} />
      </main>
      <Footer />
    </div>
  );
}

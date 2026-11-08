import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import CompanyDetailView from '@/components/company-detail/CompanyDetailView';
import { companyApi } from '@/apiRequest/company';
import { toCompanyDetail } from '@/utils/public-company';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

async function loadCompany(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();
  try {
    const [company, jobs] = await Promise.all([companyApi.getPublic(id), companyApi.listJobs(id)]);
    return toCompanyDetail(company, jobs.items);
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await loadCompany(id);

  return {
    title: `${company.name} Tuyển Dụng, Việc Làm Mới Nhất - InterVue`,
    description: `Khám phá ${company.openJobsCount} vị trí việc làm đang tuyển dụng tại ${company.name} trên InterVue.`,
    openGraph: {
      title: `${company.name} - Thông Tin Doanh Nghiệp & Tuyển Dụng`,
      description: `Địa chỉ: ${company.address} • Đang tuyển ${company.openJobsCount} vị trí`,
    },
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const company = await loadCompany(id);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      <Header />

      <main className="flex-1">
        <CompanyDetailView company={company} />
      </main>

      <Footer />
    </div>
  );
}

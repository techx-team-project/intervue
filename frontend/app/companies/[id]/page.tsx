import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CompanyDetailView from '@/components/company-detail/CompanyDetailView';
import { getCompanyDetailById } from '@/mocks/company-detail.mock';

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const company = getCompanyDetailById(id);

  return {
    title: `${company.name} Tuyển Dụng, Việc Làm Mới Nhất - InterVue`,
    description: `Khám phá môi trường làm việc, chế độ đãi ngộ và ${company.openJobsCount} vị trí việc làm đang tuyển dụng tại ${company.name} trên InterVue.`,
    openGraph: {
      title: `${company.name} - Thông Tin Doanh Nghiệp & Tuyển Dụng`,
      description: `Quy mô: ${company.size} • Địa chỉ: ${company.address} • Đang tuyển ${company.openJobsCount} vị trí`,
    },
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const company = getCompanyDetailById(id);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Company Detail View */}
      <main className="flex-1">
        <CompanyDetailView company={company} />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}

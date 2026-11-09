import ServicePackageDetailView from '@/components/recruiter/services/ServicePackageDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết dịch vụ | InterVue Recruiter',
  description: 'Thông tin chi tiết gói dịch vụ tuyển dụng của InterVue',
};

type ServicePackageDetailPageProps = { params: Promise<{ slug: string }> };

export default async function ServicePackageDetailPage({ params }: ServicePackageDetailPageProps) {
  const { slug } = await params;

  return <ServicePackageDetailView slug={slug} />;
}

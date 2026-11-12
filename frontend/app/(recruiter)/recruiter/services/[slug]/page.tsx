import ServicePackageDetailView from '@/components/recruiter/services/ServicePackageDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Details | InterVue Recruiter',
  description: 'Details of an InterVue recruitment service package',
};

type ServicePackageDetailPageProps = { params: Promise<{ slug: string }> };

export default async function ServicePackageDetailPage({ params }: ServicePackageDetailPageProps) {
  const { slug } = await params;

  return <ServicePackageDetailView slug={slug} />;
}

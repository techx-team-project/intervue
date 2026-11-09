import PageHeader from '@/components/recruiter/PageHeader';
import ServiceCatalogView from '@/components/recruiter/services/ServiceCatalogView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mua dịch vụ | InterVue Recruiter',
  description: 'Các gói dịch vụ đăng tin, quảng bá và hỗ trợ tuyển dụng của InterVue',
};

export default function RecruiterServicesPage() {
  return (
    <>
      <PageHeader title="Mua dịch vụ" description="Chọn gói dịch vụ phù hợp với nhu cầu tuyển dụng của doanh nghiệp" />
      <ServiceCatalogView />
    </>
  );
}

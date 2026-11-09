import PageHeader from '@/components/recruiter/PageHeader';
import MyServicesView from '@/components/recruiter/services/my/MyServicesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dịch vụ của tôi | InterVue Recruiter',
  description: 'Dịch vụ doanh nghiệp đã mua, còn lại bao nhiêu và đang chạy trên tin nào',
};

export default function MyServicesPage() {
  return (
    <>
      <PageHeader title="Dịch vụ của tôi" description="Dịch vụ đã mua của doanh nghiệp và tình trạng sử dụng" />
      <MyServicesView />
    </>
  );
}

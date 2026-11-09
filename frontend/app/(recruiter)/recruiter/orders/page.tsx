import PageHeader from '@/components/recruiter/PageHeader';
import RecruiterOrdersView from '@/components/recruiter/orders/RecruiterOrdersView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn hàng | InterVue Recruiter',
  description: 'Theo dõi đơn hàng dịch vụ tuyển dụng của doanh nghiệp',
};

export default function RecruiterOrdersPage() {
  return (
    <>
      <PageHeader title="Đơn hàng" description="Toàn bộ đơn hàng dịch vụ của doanh nghiệp bạn" />
      <RecruiterOrdersView />
    </>
  );
}

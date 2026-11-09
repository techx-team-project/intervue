import RecruiterOrderDetailView from '@/components/recruiter/orders/RecruiterOrderDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết đơn hàng | InterVue Recruiter',
  description: 'Thông tin chi tiết và trạng thái thanh toán của đơn hàng',
};

type RecruiterOrderDetailPageProps = { params: Promise<{ code: string }> };

export default async function RecruiterOrderDetailPage({ params }: RecruiterOrderDetailPageProps) {
  const { code } = await params;

  return <RecruiterOrderDetailView code={code} />;
}

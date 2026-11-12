import RecruiterOrderDetailView from '@/components/recruiter/orders/RecruiterOrderDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order details | InterVue Recruiter',
  description: 'Order details and payment status',
};

type RecruiterOrderDetailPageProps = { params: Promise<{ code: string }> };

export default async function RecruiterOrderDetailPage({ params }: RecruiterOrderDetailPageProps) {
  const { code } = await params;

  return <RecruiterOrderDetailView code={code} />;
}

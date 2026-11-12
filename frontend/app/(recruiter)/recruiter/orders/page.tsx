import PageHeader from '@/components/recruiter/PageHeader';
import RecruiterOrdersView from '@/components/recruiter/orders/RecruiterOrdersView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders | InterVue Recruiter',
  description: "Track your company's recruitment service orders",
};

export default function RecruiterOrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="All service orders for your company" />
      <RecruiterOrdersView />
    </>
  );
}

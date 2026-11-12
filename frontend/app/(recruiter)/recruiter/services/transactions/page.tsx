import PageHeader from '@/components/recruiter/PageHeader';
import RecruiterTransactionsView from '@/components/recruiter/services/transactions/RecruiterTransactionsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction History | InterVue Recruiter',
  description: 'All bank transfers and refund requests of your company',
};

export default function RecruiterTransactionsPage() {
  return (
    <>
      <PageHeader title="Transaction History" description="Track payments and refunds in one place" />
      <RecruiterTransactionsView />
    </>
  );
}

import PageHeader from '@/components/recruiter/PageHeader';
import RecruiterTransactionsView from '@/components/recruiter/services/transactions/RecruiterTransactionsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử giao dịch | InterVue Recruiter',
  description: 'Toàn bộ giao dịch chuyển khoản và yêu cầu hoàn tiền của doanh nghiệp bạn',
};

export default function RecruiterTransactionsPage() {
  return (
    <>
      <PageHeader title="Lịch sử giao dịch" description="Theo dõi thanh toán và hoàn tiền ở một nơi" />
      <RecruiterTransactionsView />
    </>
  );
}

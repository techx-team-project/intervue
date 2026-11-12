import RecruiterVouchersView from '@/components/recruiter/vouchers/RecruiterVouchersView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Mã ưu đãi | InterVue Recruiter',
  description: 'Kho mã ưu đãi dịch vụ tuyển dụng dành cho doanh nghiệp.',
};

export default function RecruiterVouchersPage() {
  return (
    <Suspense fallback={null}>
      <RecruiterVouchersView />
    </Suspense>
  );
}

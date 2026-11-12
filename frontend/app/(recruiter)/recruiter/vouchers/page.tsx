import RecruiterVouchersView from '@/components/recruiter/vouchers/RecruiterVouchersView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Vouchers | InterVue Recruiter',
  description: 'Recruitment service vouchers available to your company.',
};

export default function RecruiterVouchersPage() {
  return (
    <Suspense fallback={null}>
      <RecruiterVouchersView />
    </Suspense>
  );
}

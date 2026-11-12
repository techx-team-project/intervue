import AdminVoucherFormPageClient from '@/components/admin/services/vouchers/AdminVoucherFormPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'New Voucher | InterVue Admin',
  description: 'Create a promotional voucher code with eligibility conditions and package scope.',
};

export default function AdminVoucherCreatePage() {
  return (
    <Suspense fallback={null}>
      <AdminVoucherFormPageClient />
    </Suspense>
  );
}

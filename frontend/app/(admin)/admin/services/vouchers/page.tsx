import AdminVouchersPageClient from '@/components/admin/services/AdminVouchersPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Vouchers | InterVue Admin',
  description: 'Discount codes recruiters can apply at checkout.',
};

export default function AdminVouchersPage() {
  return (
    <Suspense fallback={null}>
      <AdminVouchersPageClient />
    </Suspense>
  );
}

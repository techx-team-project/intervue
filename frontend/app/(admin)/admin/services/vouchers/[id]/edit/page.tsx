import AdminVoucherFormPageClient from '@/components/admin/services/vouchers/AdminVoucherFormPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Edit Voucher | InterVue Admin',
  description: 'Edit voucher discount rules, eligibility conditions, and package scope.',
};

type AdminVoucherEditPageProps = { params: Promise<{ id: string }> };

export default async function AdminVoucherEditPage({ params }: AdminVoucherEditPageProps) {
  const { id } = await params;
  const numericId = /^\d+$/.test(id) ? Number(id) : -1;

  return (
    <Suspense fallback={null}>
      <AdminVoucherFormPageClient voucherId={numericId} />
    </Suspense>
  );
}

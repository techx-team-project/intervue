import AdminVouchersPageClient from '@/components/admin/services/AdminVouchersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vouchers | InterVue Admin',
  description: 'Discount codes recruiters can apply at checkout.',
};

export default function AdminVouchersPage() {
  return <AdminVouchersPageClient />;
}

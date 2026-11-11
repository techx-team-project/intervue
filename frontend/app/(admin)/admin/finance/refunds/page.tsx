import AdminRefundsPageClient from '@/components/admin/finance/AdminRefundsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refunds | InterVue Admin',
  description: 'Refund requests waiting on a decision, and what each one gives back.',
};

export default function AdminRefundsPage() {
  return <AdminRefundsPageClient />;
}

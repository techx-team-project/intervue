import AdminOrdersPageClient from '@/components/admin/finance/AdminOrdersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders | InterVue Admin',
  description: 'Every service order, what it contains and how much of it was paid.',
};

export default function AdminOrdersPage() {
  return <AdminOrdersPageClient />;
}

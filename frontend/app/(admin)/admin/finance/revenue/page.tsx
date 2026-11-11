import AdminRevenuePageClient from '@/components/admin/finance/AdminRevenuePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revenue | InterVue Admin',
  description: 'Money collected, refunded and still outstanding, counted from the orders table.',
};

export default function AdminRevenuePage() {
  return <AdminRevenuePageClient />;
}

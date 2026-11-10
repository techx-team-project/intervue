import AdminCreditPricesPageClient from '@/components/admin/services/AdminCreditPricesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credit Prices | InterVue Admin',
  description: 'How many credits each service costs when a recruiter exchanges them.',
};

export default function AdminCreditPricesPage() {
  return <AdminCreditPricesPageClient />;
}

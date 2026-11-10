import AdminInvoicesPageClient from '@/components/admin/finance/AdminInvoicesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices | InterVue Admin',
  description: 'Documents issued for every paid order.',
};

export default function AdminInvoicesPage() {
  return <AdminInvoicesPageClient />;
}

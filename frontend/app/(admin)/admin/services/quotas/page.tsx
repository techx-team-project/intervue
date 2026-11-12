import AdminFreeQuotasView from '@/components/admin/services/AdminFreeQuotasView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Quotas | InterVue Admin',
  description: 'Runtime free-tier limits applied automatically to every company and candidate.',
};

export default function AdminFreeQuotasPage() {
  return <AdminFreeQuotasView />;
}

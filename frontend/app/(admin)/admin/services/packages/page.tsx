import AdminServicePackagesPageClient from '@/components/admin/services/AdminServicePackagesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Packages | InterVue Admin',
  description: 'Manage the recruitment service packages offered to recruiters.',
};

export default function AdminServicePackagesPage() {
  return <AdminServicePackagesPageClient />;
}

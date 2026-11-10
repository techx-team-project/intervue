import AdminServicePackageFormPageClient from '@/components/admin/services/AdminServicePackageFormPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Service Package | InterVue Admin',
  description: 'Create a recruitment service package.',
};

export default function AdminServicePackageCreatePage() {
  return <AdminServicePackageFormPageClient />;
}

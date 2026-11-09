import AdminServiceCategoriesPageClient from '@/components/admin/services/AdminServiceCategoriesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Categories | InterVue Admin',
  description: 'Manage the sections of the recruiter buy-services page.',
};

export default function AdminServiceCategoriesPage() {
  return <AdminServiceCategoriesPageClient />;
}

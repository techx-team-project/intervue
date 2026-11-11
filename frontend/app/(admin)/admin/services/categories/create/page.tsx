import AdminServiceCategoryFormPageClient from '@/components/admin/services/categories/AdminServiceCategoryFormPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Service Category | InterVue Admin',
  description: 'Create a recruitment service category.',
};

export default function AdminServiceCategoryCreatePage() {
  return <AdminServiceCategoryFormPageClient />;
}

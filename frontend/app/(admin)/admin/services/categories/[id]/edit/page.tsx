import AdminServiceCategoryFormPageClient from '@/components/admin/services/categories/AdminServiceCategoryFormPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Service Category | InterVue Admin',
  description: 'Edit a recruitment service category.',
};

type AdminServiceCategoryEditPageProps = { params: Promise<{ id: string }> };

export default async function AdminServiceCategoryEditPage({ params }: AdminServiceCategoryEditPageProps) {
  const { id } = await params;
  const numericId = /^\d+$/.test(id) ? Number(id) : -1;

  return <AdminServiceCategoryFormPageClient categoryId={numericId} />;
}

import AdminServicePackageFormPageClient from '@/components/admin/services/AdminServicePackageFormPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Edit Service Package | InterVue Admin',
  description: 'Edit a recruitment service package.',
};

type AdminServicePackageEditPageProps = { params: Promise<{ id: string }> };

export default async function AdminServicePackageEditPage({ params }: AdminServicePackageEditPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <AdminServicePackageFormPageClient packageId={Number(id)} />
    </Suspense>
  );
}

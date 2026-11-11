import AdminServicePackagesPageClient from '@/components/admin/services/AdminServicePackagesPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Service Packages | InterVue Admin',
  description: 'Manage the recruitment service packages offered to recruiters.',
};

export default function AdminServicePackagesPage() {
  return (
    <Suspense fallback={null}>
      <AdminServicePackagesPageClient />
    </Suspense>
  );
}

import AdminAdCreativesPageClient from '@/components/admin/ads/AdminAdCreativesPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Banner artwork | InterVue Admin',
  description: 'Artwork waiting on a decision before it goes live.',
};

export default function AdminAdCreativesPage() {
  return (
    <Suspense fallback={null}>
      <AdminAdCreativesPageClient />
    </Suspense>
  );
}

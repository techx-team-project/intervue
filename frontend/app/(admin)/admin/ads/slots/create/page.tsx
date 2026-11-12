import AdminAdSlotFormPageClient from '@/components/admin/ads/slots/AdminAdSlotFormPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'New Ad Slot | InterVue Admin',
  description: 'Configure a new storefront banner placement, dimensions, pricing, and house ad fallback.',
};

export default function AdminAdSlotCreatePage() {
  return (
    <Suspense fallback={null}>
      <AdminAdSlotFormPageClient />
    </Suspense>
  );
}

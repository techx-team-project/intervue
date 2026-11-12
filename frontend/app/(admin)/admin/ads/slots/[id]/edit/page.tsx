import AdminAdSlotFormPageClient from '@/components/admin/ads/slots/AdminAdSlotFormPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Edit Ad Slot | InterVue Admin',
  description: 'Update banner placement pricing, availability, display order, and house ad fallback.',
};

type AdminAdSlotEditPageProps = { params: Promise<{ id: string }> };

export default async function AdminAdSlotEditPage({ params }: AdminAdSlotEditPageProps) {
  const { id } = await params;
  const numericId = /^\d+$/.test(id) ? Number(id) : -1;

  return (
    <Suspense fallback={null}>
      <AdminAdSlotFormPageClient slotId={numericId} />
    </Suspense>
  );
}

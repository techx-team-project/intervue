'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminAdSlotsView from '@/components/admin/ads/AdminAdSlotsView';
import { adminAdApi } from '@/apiRequest/ads';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminAdSlotsPageClient() {
  const load = useCallback(() => adminAdApi.slots(), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminAdSlotsView initialSlots={data} />}
    </AdminDataGate>
  );
}

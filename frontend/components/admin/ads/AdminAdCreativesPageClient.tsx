'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminAdCreativesView from '@/components/admin/ads/AdminAdCreativesView';
import { adminAdApi } from '@/apiRequest/ads';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

const PAGE_SIZE = 50;

export default function AdminAdCreativesPageClient() {
  const load = useCallback(() => adminAdApi.creatives('', 0, PAGE_SIZE), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminAdCreativesView initialCreatives={data.items} />}
    </AdminDataGate>
  );
}

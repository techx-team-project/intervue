'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';
import { AdminBusinessVerificationListView } from './AdminBusinessVerificationListView';

export default function AdminBusinessVerificationPageClient() {
  const load = useCallback(
    () =>
      Promise.all([
        adminBusinessVerificationApi.getSummary(),
        adminBusinessVerificationApi.search({ page: 0, size: 15, sort: 'submittedAt,desc' }),
      ]),
    [],
  );

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminBusinessVerificationListView initialSummary={data[0]} initialPage={data[1]} />}
    </AdminDataGate>
  );
}

'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';
import { AdminBusinessVerificationListView } from './AdminBusinessVerificationListView';

export default function AdminBusinessVerificationPageClient() {
  const load = useCallback(async () => {
    const [summary, page] = await Promise.all([
      adminBusinessVerificationApi.getSummary(),
      adminBusinessVerificationApi.search({ page: 0, size: 50, sort: 'submittedAt,asc' }),
    ]);
    return { summary, page };
  }, []);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminBusinessVerificationListView initialSummary={data?.summary} initialPage={data?.page} onRefresh={reload} />
    </AdminDataGate>
  );
}

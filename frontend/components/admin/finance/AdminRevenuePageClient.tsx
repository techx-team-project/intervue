'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminRevenueView from '@/components/admin/finance/AdminRevenueView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminRevenuePageClient() {
  const load = useCallback(() => adminPaymentApi.revenue(), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminRevenueView report={data} />}
    </AdminDataGate>
  );
}

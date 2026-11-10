'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminOrdersView from '@/components/admin/finance/AdminOrdersView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

const PAGE_SIZE = 50;

export default function AdminOrdersPageClient() {
  const load = useCallback(() => adminPaymentApi.searchOrders({ page: 0, size: PAGE_SIZE }), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminOrdersView initialOrders={data.items} />}
    </AdminDataGate>
  );
}

'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminRefundsView from '@/components/admin/finance/AdminRefundsView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

const PAGE_SIZE = 50;

export default function AdminRefundsPageClient() {
  const load = useCallback(() => adminPaymentApi.searchRefunds(0, PAGE_SIZE), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminRefundsView initialRefunds={data.items} />}
    </AdminDataGate>
  );
}

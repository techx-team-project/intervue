'use client';

import AdminCreditPricesView from '@/components/admin/services/AdminCreditPricesView';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { adminCreditPriceApi } from '@/apiRequest/credit';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminCreditPricesPageClient() {
  const load = useCallback(() => adminCreditPriceApi.list(), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminCreditPricesView initialPrices={data} />}
    </AdminDataGate>
  );
}

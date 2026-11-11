'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminPaymentTransactionsView from '@/components/admin/finance/AdminPaymentTransactionsView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminPaymentTransactionsPageClient() {
  const load = useCallback(() => adminPaymentApi.searchTransactions('', 0), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminPaymentTransactionsView initialPage={data} />}
    </AdminDataGate>
  );
}

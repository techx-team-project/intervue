'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminRefundsView from '@/components/admin/finance/AdminRefundsView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

const PAGE_SIZE = 20;

export default function AdminRefundsPageClient() {
  const load = useCallback(async () => {
    const [refunds, summary] = await Promise.all([
      adminPaymentApi.searchRefunds({ status: 'PENDING', page: 0, size: PAGE_SIZE }),
      adminPaymentApi.refundsSummary(),
    ]);
    return { refunds, summary };
  }, []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminRefundsView initialRefunds={data.refunds} initialSummary={data.summary} initialStatus="PENDING" />}
    </AdminDataGate>
  );
}

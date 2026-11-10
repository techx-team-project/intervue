'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminInvoicesView from '@/components/admin/finance/AdminInvoicesView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

const PAGE_SIZE = 50;

export default function AdminInvoicesPageClient() {
  const load = useCallback(() => adminPaymentApi.searchInvoices(0, PAGE_SIZE), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminInvoicesView invoices={data.items} />}
    </AdminDataGate>
  );
}

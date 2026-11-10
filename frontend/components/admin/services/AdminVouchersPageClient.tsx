'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminVouchersView from '@/components/admin/services/AdminVouchersView';
import { adminVoucherApi } from '@/apiRequest/voucher';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

const PAGE_SIZE = 50;

export default function AdminVouchersPageClient() {
  const load = useCallback(() => adminVoucherApi.search('', 0, PAGE_SIZE), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminVouchersView initialVouchers={data.items} />}
    </AdminDataGate>
  );
}

'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminPaymentSettingsView from '@/components/admin/finance/AdminPaymentSettingsView';
import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminPaymentSettingsPageClient() {
  const load = useCallback(
    async () => ({
      settings: await adminPaymentApi.getSettings(),
      banks: await adminPaymentApi.getBanks(),
    }),
    [],
  );
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminPaymentSettingsView initial={data.settings} banks={data.banks} />}
    </AdminDataGate>
  );
}

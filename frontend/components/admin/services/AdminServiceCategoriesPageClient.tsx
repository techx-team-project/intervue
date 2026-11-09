'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminServiceCategoriesView from '@/components/admin/services/AdminServiceCategoriesView';
import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminServiceCategoriesPageClient() {
  const load = useCallback(() => adminServicePackageApi.listCategories(), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminServiceCategoriesView initialCategories={data ?? []} />
    </AdminDataGate>
  );
}

'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminServicePackagesListView from '@/components/admin/services/AdminServicePackagesListView';
import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

export default function AdminServicePackagesPageClient() {
  const load = useCallback(async () => {
    const [page, categories] = await Promise.all([
      adminServicePackageApi.searchPackages({ page: 0, size: 20 }),
      adminServicePackageApi.listCategories(),
    ]);
    return { page, categories };
  }, []);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminServicePackagesListView initialPage={data?.page} categories={data?.categories ?? []} />
    </AdminDataGate>
  );
}

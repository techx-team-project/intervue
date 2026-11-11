'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminServicePackagesListView from '@/components/admin/services/AdminServicePackagesListView';
import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function AdminServicePackagesPageClient() {
  const searchParams = useSearchParams();
  const rawCategoryId = searchParams.get('categoryId');
  const initialCategoryId = rawCategoryId && /^\d+$/.test(rawCategoryId) ? Number(rawCategoryId) : undefined;

  const load = useCallback(async () => {
    const [page, categories] = await Promise.all([
      adminServicePackageApi.searchPackages({ page: 0, size: 20, categoryId: initialCategoryId }),
      adminServicePackageApi.listCategories(),
    ]);
    return { page, categories };
  }, [initialCategoryId]);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminServicePackagesListView
        key={initialCategoryId ?? 'all'}
        initialPage={data?.page}
        categories={data?.categories ?? []}
        initialCategoryId={initialCategoryId ? String(initialCategoryId) : ''}
      />
    </AdminDataGate>
  );
}

'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminServicePackageForm from '@/components/admin/services/AdminServicePackageForm';
import { useAdminResource } from '@/hooks/useAdminResource';
import { parsePositiveIntParam } from '@/lib/admin-service-packages';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface AdminServicePackageFormPageClientProps {
  packageId?: number;
}

export default function AdminServicePackageFormPageClient({ packageId }: AdminServicePackageFormPageClientProps) {
  const searchParams = useSearchParams();
  const initialCategoryId = parsePositiveIntParam(searchParams.get('categoryId'));

  const load = useCallback(async () => {
    const [categories, item, existingPage] = await Promise.all([
      adminServicePackageApi.listCategories(),
      packageId ? adminServicePackageApi.getPackage(packageId) : Promise.resolve(undefined),
      packageId ? Promise.resolve(undefined) : adminServicePackageApi.searchPackages({ page: 0, size: 100 }),
    ]);
    return {
      categories,
      item,
      existingPackages: existingPage?.items,
    };
  }, [packageId]);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && (
        <AdminServicePackageForm
          key={packageId ?? 'new'}
          categories={data.categories}
          existingPackages={data.existingPackages}
          initial={data.item}
          initialCategoryId={initialCategoryId}
        />
      )}
    </AdminDataGate>
  );
}

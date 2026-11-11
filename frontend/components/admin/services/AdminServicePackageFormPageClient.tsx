'use client';

import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminServicePackageForm from '@/components/admin/services/AdminServicePackageForm';
import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';

interface AdminServicePackageFormPageClientProps {
  packageId?: number;
}

export default function AdminServicePackageFormPageClient({ packageId }: AdminServicePackageFormPageClientProps) {
  const load = useCallback(async () => {
    const [categories, item] = await Promise.all([
      adminServicePackageApi.listCategories(),
      packageId ? adminServicePackageApi.getPackage(packageId) : Promise.resolve(undefined),
    ]);
    return { categories, item };
  }, [packageId]);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminServicePackageForm categories={data.categories} initial={data.item} />}
    </AdminDataGate>
  );
}

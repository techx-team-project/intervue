'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { buttonClassName } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAdminResource } from '@/hooks/useAdminResource';
import { getNextDisplayOrder } from '@/lib/admin-service-categories';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';
import AdminServiceCategoryForm from './AdminServiceCategoryForm';

interface AdminServiceCategoryFormPageClientProps {
  categoryId?: number;
}

export default function AdminServiceCategoryFormPageClient({ categoryId }: AdminServiceCategoryFormPageClientProps) {
  const load = useCallback(() => adminServicePackageApi.listCategories(), []);
  const { data, status, error, reload } = useAdminResource(load);

  const categories = data ?? [];
  const isEditing = categoryId !== undefined;
  const editingCategory = isEditing ? categories.find((item) => item.id === categoryId) : undefined;
  const suggestedDisplayOrder = getNextDisplayOrder(categories);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {isEditing && data && !editingCategory ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white px-6 py-16 text-center shadow-xs">
          <AlertCircle className="text-outline h-10 w-10" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">Service category not found</p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            This category may have been removed or the URL is invalid.
          </p>
          <Link href={ROUTES.ADMIN_SERVICE_CATEGORIES} className={buttonClassName({ size: 'md' })}>
            Back to categories
          </Link>
        </div>
      ) : (
        data && (
          <AdminServiceCategoryForm
            categories={categories}
            editingCategory={editingCategory}
            suggestedDisplayOrder={suggestedDisplayOrder}
          />
        )
      )}
    </AdminDataGate>
  );
}

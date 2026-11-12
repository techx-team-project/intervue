'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminServicePackageTable from '@/components/admin/services/AdminServicePackageTable';
import { DeactivatePackageDialog } from '@/components/admin/services/packages/AdminServicePackageDialogs';
import AdminServicePackagesFilterBar from '@/components/admin/services/packages/AdminServicePackagesFilterBar';
import AdminServicePackagesMobileList from '@/components/admin/services/packages/AdminServicePackagesMobileList';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { buttonClassName } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { serviceCatalogKeys } from '@/hooks/useServiceCatalog';
import { adminServicePackageKeys, DEFAULT_PACKAGE_SORT, PACKAGE_PAGE_SIZE_OPTIONS } from '@/lib/admin-service-packages';
import type { AdminServiceCategory, AdminServicePackage, ServicePackageStatus } from '@/types/admin-service-package';
import type { Page } from '@/types/api';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { FolderCog, Info, Package, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AdminServicePackagesListViewProps {
  result: Page<AdminServicePackage>;
  categories: AdminServiceCategory[];
  query: string;
  categoryId: string;
  status: ServicePackageStatus | '';
  sort: string;
  pageSize: number;
  isFetching: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ServicePackageStatus | '') => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
}

export default function AdminServicePackagesListView({
  result,
  categories,
  query,
  categoryId,
  status,
  sort,
  pageSize,
  isFetching,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
}: AdminServicePackagesListViewProps) {
  const queryClient = useQueryClient();
  const [deactivateTarget, setDeactivateTarget] = useState<AdminServicePackage | null>(null);
  const [busyPackageId, setBusyPackageId] = useState<number | null>(null);

  const categoriesById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const packages = result.items;
  const hasFilters = Boolean(query.trim() || categoryId || status || sort !== DEFAULT_PACKAGE_SORT);

  const selectedCategory = categoryId ? categoriesById.get(Number(categoryId)) : undefined;
  const activeInHiddenCategories = useMemo(
    () =>
      packages.filter((pkg) => {
        const category = categoriesById.get(pkg.categoryId);
        return pkg.status === 'ACTIVE' && category && !category.isActive;
      }),
    [packages, categoriesById],
  );

  const showHiddenCategoryNotice =
    Boolean(selectedCategory && !selectedCategory.isActive) || activeInHiddenCategories.length > 0;
  const createPackageHref = categoryId
    ? `${ROUTES.ADMIN_SERVICE_PACKAGES_CREATE}?categoryId=${categoryId}`
    : ROUTES.ADMIN_SERVICE_PACKAGES_CREATE;

  const invalidatePackageCaches = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminServicePackageKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminServicePackageKeys.categories }),
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog }),
    ]);
  };

  const applyActiveState = async (item: AdminServicePackage, nextActive: boolean) => {
    setBusyPackageId(item.id);
    try {
      await adminServicePackageApi.setStatus(item.id, nextActive);
      await invalidatePackageCaches();

      if (nextActive) {
        const category = categoriesById.get(item.categoryId);
        if (category && !category.isActive) {
          toast.warning(`"${item.name}" activated, but its category "${category.name}" is still hidden.`);
        } else {
          toast.success(`"${item.name}" is now active on the recruiter catalog.`);
        }
      } else {
        toast.success(`"${item.name}" deactivated and removed from the recruiter catalog.`);
      }
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setBusyPackageId(null);
    }
  };

  const handleToggleActive = (item: AdminServicePackage) => {
    if (item.status === 'ACTIVE') {
      setDeactivateTarget(item);
      return;
    }
    void applyActiveState(item, true);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget) return;
    const target = deactivateTarget;
    setDeactivateTarget(null);
    await applyActiveState(target, false);
  };

  return (
    <div className="space-y-4 pb-12">
      <AdminPageHeader
        className="mb-0"
        description="Manage service packages, benefits, pricing, and recruiter catalog visibility."
        count={result.totalItems}
        countLabel={hasFilters ? 'matching packages' : 'packages'}
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_SERVICE_CATEGORIES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <FolderCog className="h-4 w-4" />
              <span>Service categories</span>
            </Link>
            <Link href={createPackageHref} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New package</span>
            </Link>
          </>
        }
      />

      <AdminServicePackagesFilterBar
        query={query}
        categoryId={categoryId}
        status={status}
        sort={sort}
        categories={categories}
        onQueryChange={onQueryChange}
        onCategoryChange={onCategoryChange}
        onStatusChange={onStatusChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {showHiddenCategoryNotice && (
        <div className="rounded-lg border border-l-4 border-amber-200/75 border-l-amber-500 bg-amber-50 px-4 py-3 dark:border-amber-800/60 dark:border-l-amber-400 dark:bg-amber-950/35">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Hidden category notice</p>
                <p className="text-on-surface-variant mt-0.5 text-sm leading-relaxed dark:text-amber-100/80">
                  {selectedCategory && !selectedCategory.isActive
                    ? `Category "${selectedCategory.name}" is currently hidden, so all packages inside it stay invisible to recruiters even if marked Active.`
                    : `${activeInHiddenCategories.length} active ${activeInHiddenCategories.length === 1 ? 'package belongs' : 'packages belong'} to a hidden category and will not appear to recruiters until the category is made visible.`}{' '}
                  <Link
                    href={ROUTES.ADMIN_SERVICE_CATEGORIES}
                    className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-200 dark:hover:text-amber-100"
                  >
                    Manage categories →
                  </Link>
                </p>
              </div>
            </div>
            {isFetching && (
              <span className="inline-flex shrink-0 items-center gap-1.5 self-center rounded-md bg-amber-100/90 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
                <Spinner className="h-3.5 w-3.5" />
                <span>Refreshing...</span>
              </span>
            )}
          </div>
        </div>
      )}

      {!showHiddenCategoryNotice && isFetching && (
        <div className="text-on-surface-variant dark:text-forest-300 flex items-center justify-end gap-1.5 text-xs font-medium">
          <Spinner className="h-3.5 w-3.5" />
          <span>Updating list...</span>
        </div>
      )}

      {packages.length === 0 ? (
        hasFilters ? (
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
            <SearchX className="text-outline h-10 w-10" />
            <p className="text-navy dark:text-forest-50 text-body-md font-bold">No packages match these filters</p>
            <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
              Try a different keyword or reset the category, status, and sort filters.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
            <Package className="text-outline h-10 w-10" />
            <p className="text-navy dark:text-forest-50 text-body-md font-bold">No service packages yet</p>
            <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
              Create your first package with pricing, benefits, and marketing sections for recruiters.
            </p>
            <Link href={ROUTES.ADMIN_SERVICE_PACKAGES_CREATE} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New package</span>
            </Link>
          </div>
        )
      ) : (
        <>
          <AdminServicePackageTable
            packages={packages}
            categoriesById={categoriesById}
            busyPackageId={busyPackageId}
            onToggleActive={handleToggleActive}
          />

          <AdminServicePackagesMobileList
            packages={packages}
            categoriesById={categoriesById}
            busyPackageId={busyPackageId}
            onToggleActive={handleToggleActive}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Pagination
              page={result.page + 1}
              pageCount={Math.max(1, result.totalPages)}
              totalItems={result.totalItems}
              pageSize={result.size}
              onPageChange={onPageChange}
              className="flex-1"
            />
            <div className="w-32 shrink-0 self-end sm:self-auto">
              <Select
                aria-label="Rows per page"
                value={String(pageSize)}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                options={[...PACKAGE_PAGE_SIZE_OPTIONS]}
                className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-100 py-1.5 text-xs"
              />
            </div>
          </div>
        </>
      )}

      <DeactivatePackageDialog
        pkg={deactivateTarget}
        isUpdating={deactivateTarget !== null && busyPackageId === deactivateTarget.id}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => void handleConfirmDeactivate()}
      />
    </div>
  );
}

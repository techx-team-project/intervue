'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminServiceCategoriesFilterBar from '@/components/admin/services/categories/AdminServiceCategoriesFilterBar';
import AdminServiceCategoriesMobileList from '@/components/admin/services/categories/AdminServiceCategoriesMobileList';
import AdminServiceCategoriesTable from '@/components/admin/services/categories/AdminServiceCategoriesTable';
import {
  DeleteCategoryDialog,
  HideCategoryDialog,
} from '@/components/admin/services/categories/AdminServiceCategoryDialogs';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { buttonClassName } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { serviceCatalogKeys } from '@/hooks/useServiceCatalog';
import {
  EMPTY_CATEGORY_FILTERS,
  filterAndSortCategories,
  getSharedActiveNeedMap,
  hasActiveCategoryFilters,
  reorderCategoriesByIds,
  type AdminCategoryFilters,
} from '@/lib/admin-service-categories';
import type { AdminServiceCategory } from '@/types/admin-service-package';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Info, Layers, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AdminServiceCategoriesViewProps {
  initialCategories: AdminServiceCategory[];
}

const PAGE_SIZE_OPTIONS = [
  { value: '5', label: '5 / page' },
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
];

export default function AdminServiceCategoriesView({ initialCategories }: AdminServiceCategoriesViewProps) {
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState(initialCategories);
  const [filters, setFilters] = useState<AdminCategoryFilters>(EMPTY_CATEGORY_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteTarget, setDeleteTarget] = useState<AdminServiceCategory | null>(null);
  const [hideTarget, setHideTarget] = useState<AdminServiceCategory | null>(null);
  const [busyCategoryId, setBusyCategoryId] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refresh = async () => {
    const next = await adminServicePackageApi.listCategories();
    setCategories(next);
    await queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog });
  };

  const sharedNeedMap = useMemo(() => getSharedActiveNeedMap(categories), [categories]);
  const filteredCategories = useMemo(() => filterAndSortCategories(categories, filters), [categories, filters]);
  const pendingPackageCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.packageCount === 0 || (category.isActive && category.activePackageCount === 0),
      ),
    [categories],
  );

  const canReorder = !hasActiveCategoryFilters(filters);

  const pageCount = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedCategories = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, safePage, pageSize]);

  const patchFilters = (patch: Partial<AdminCategoryFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(EMPTY_CATEGORY_FILTERS);
    setPage(1);
  };

  const applyVisibility = async (category: AdminServiceCategory, nextActive: boolean) => {
    setBusyCategoryId(category.id);
    try {
      await adminServicePackageApi.setCategoryActive(category.id, nextActive);
      await refresh();
      toast.success(
        nextActive
          ? `"${category.name}" is now visible in the recruiter catalog.`
          : `"${category.name}" is now hidden from recruiters.`,
      );
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setBusyCategoryId(null);
    }
  };

  const handleToggleVisibility = (category: AdminServiceCategory) => {
    if (category.isActive && category.activePackageCount > 0) {
      setHideTarget(category);
      return;
    }
    void applyVisibility(category, !category.isActive);
  };

  const handleConfirmHide = async () => {
    if (!hideTarget) return;
    const target = hideTarget;
    await applyVisibility(target, false);
    setHideTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminServicePackageApi.deleteCategory(deleteTarget.id);
      toast.success(`Category "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await refresh();
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (activeId: number, overId: number) => {
    if (!canReorder || isReordering) return;
    const result = reorderCategoriesByIds(categories, activeId, overId);
    if (!result || result.changed.length === 0) return;

    const previous = categories;
    setCategories(result.reordered);
    setIsReordering(true);

    try {
      const updated = await adminServicePackageApi.reorderCategories({
        items: result.changed.map((item) => ({ id: item.id, displayOrder: item.displayOrder })),
      });
      setCategories(updated);
      await queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog });
      toast.success('Display order updated.');
    } catch (cause) {
      setCategories(previous);
      toast.error(getErrorMessage(cause));
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <AdminPageHeader
        className="mb-0"
        description="Organize sections and display order on the recruiter buy-services page."
        count={categories.length}
        countLabel="categories"
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_SERVICE_PACKAGES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <FolderKanban className="h-4 w-4" />
              <span>Service packages</span>
            </Link>
            <Link href={ROUTES.ADMIN_SERVICE_CATEGORIES_CREATE} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New category</span>
            </Link>
          </>
        }
      />

      <AdminServiceCategoriesFilterBar filters={filters} onPatchFilters={patchFilters} onResetFilters={resetFilters} />

      {categories.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          <Layers className="text-outline h-10 w-10" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">No service categories yet</p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            Create your first category so service packages can be grouped clearly for recruiters.
          </p>
          <Link href={ROUTES.ADMIN_SERVICE_CATEGORIES_CREATE} className={buttonClassName({ size: 'md' })}>
            <Plus className="h-4 w-4" />
            <span>New category</span>
          </Link>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          <SearchX className="text-outline h-10 w-10" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">No categories match these filters</p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            Try a different keyword or reset the status and suggestion goal filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-l-4 border-amber-200/75 border-l-amber-500 bg-amber-50 px-4 py-3.5 dark:border-amber-800/60 dark:border-l-amber-400 dark:bg-amber-950/35">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    {canReorder ? 'Display order note' : 'Reordering paused'}
                  </p>
                  <p className="text-on-surface-variant mt-1 text-sm leading-relaxed dark:text-amber-100/80">
                    {canReorder
                      ? 'Drag and drop any row using the handle at the beginning of each row to quickly customize display order.'
                      : 'Drag-and-drop reordering is paused while search or filters are active. Reset filters to reorder categories.'}
                  </p>
                </div>
              </div>
              {isReordering && (
                <span className="inline-flex shrink-0 items-center gap-1.5 self-center rounded-md bg-amber-100/90 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
                  <Spinner className="h-3.5 w-3.5" />
                  <span>Saving order...</span>
                </span>
              )}
            </div>

            {pendingPackageCategories.length > 0 && (
              <div className="mt-2.5 border-t border-amber-200/80 pt-2.5 pl-7.5 dark:border-amber-800/50">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Waiting for active packages ({pendingPackageCategories.length})
                </p>
                <p className="text-on-surface-variant mt-0.5 text-sm leading-relaxed dark:text-amber-100/80">
                  {pendingPackageCategories.map((item) => item.name).join(', ')}{' '}
                  {pendingPackageCategories.length === 1 ? 'has' : 'have'} no active packages yet, so{' '}
                  {pendingPackageCategories.length === 1 ? 'it stays' : 'they stay'} hidden from recruiters on the
                  buy-services page.{' '}
                  <Link
                    href={`${ROUTES.ADMIN_SERVICE_PACKAGES}?categoryId=${pendingPackageCategories[0].id}`}
                    className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-200 dark:hover:text-amber-100"
                  >
                    Manage packages →
                  </Link>
                </p>
              </div>
            )}
          </div>

          <AdminServiceCategoriesTable
            categories={pagedCategories}
            sharedNeedMap={sharedNeedMap}
            canReorder={canReorder}
            isReordering={isReordering}
            busyCategoryId={busyCategoryId}
            onRequestDelete={setDeleteTarget}
            onToggleVisibility={handleToggleVisibility}
            onReorder={(activeId, overId) => void handleReorder(activeId, overId)}
          />

          <AdminServiceCategoriesMobileList
            categories={pagedCategories}
            sharedNeedMap={sharedNeedMap}
            canReorder={canReorder}
            isReordering={isReordering}
            busyCategoryId={busyCategoryId}
            onRequestDelete={setDeleteTarget}
            onToggleVisibility={handleToggleVisibility}
            onReorder={(activeId, overId) => void handleReorder(activeId, overId)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Pagination
              page={safePage}
              pageCount={pageCount}
              totalItems={filteredCategories.length}
              pageSize={pageSize}
              onPageChange={setPage}
              className="flex-1"
            />
            <div className="w-32 shrink-0 self-end sm:self-auto">
              <Select
                aria-label="Rows per page"
                value={String(pageSize)}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                options={PAGE_SIZE_OPTIONS}
                className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-100 py-1.5 text-xs"
              />
            </div>
          </div>
        </>
      )}

      <HideCategoryDialog
        category={hideTarget}
        isUpdating={hideTarget !== null && busyCategoryId === hideTarget.id}
        onClose={() => setHideTarget(null)}
        onConfirm={() => void handleConfirmHide()}
      />

      <DeleteCategoryDialog
        category={deleteTarget}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}

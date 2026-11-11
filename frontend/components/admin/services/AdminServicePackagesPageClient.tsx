'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminServicePackagesListView from '@/components/admin/services/AdminServicePackagesListView';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { isApiError } from '@/lib/api-error';
import {
  adminServicePackageKeys,
  DEFAULT_PACKAGE_PAGE_SIZE,
  DEFAULT_PACKAGE_SORT,
  parsePackageStatusParam,
  parsePositiveIntParam,
} from '@/lib/admin-service-packages';
import type { ServicePackageStatus } from '@/types/admin-service-package';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function AdminServicePackagesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlCategoryId = searchParams.get('categoryId') ?? '';
  const parsedCategoryId = parsePositiveIntParam(urlCategoryId);
  const urlStatus = parsePackageStatusParam(searchParams.get('status'));
  const urlSort = searchParams.get('sort') || DEFAULT_PACKAGE_SORT;
  const urlPage = Math.max(1, parsePositiveIntParam(searchParams.get('page')) ?? 1);
  const urlSize = parsePositiveIntParam(searchParams.get('size')) ?? DEFAULT_PACKAGE_PAGE_SIZE;

  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const replaceParams = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === urlQuery.trim()) return;
    replaceParams({ q: trimmed || undefined, page: undefined });
  }, [debouncedSearch, replaceParams, urlQuery]);

  const apiParams = useMemo(
    () => ({
      query: urlQuery.trim() || undefined,
      categoryId: parsedCategoryId,
      status: (urlStatus || undefined) as ServicePackageStatus | undefined,
      page: urlPage - 1,
      size: urlSize,
      sort: urlSort,
    }),
    [parsedCategoryId, urlPage, urlQuery, urlSize, urlSort, urlStatus],
  );

  const categoriesQuery = useQuery({
    queryKey: adminServicePackageKeys.categories,
    queryFn: adminServicePackageApi.listCategories,
  });

  const packagesQuery = useQuery({
    queryKey: adminServicePackageKeys.list(apiParams),
    queryFn: () => adminServicePackageApi.searchPackages(apiParams),
    placeholderData: keepPreviousData,
  });

  const isBootLoading = categoriesQuery.isPending || (packagesQuery.isPending && !packagesQuery.data);
  const firstError = categoriesQuery.error ?? (packagesQuery.data ? null : packagesQuery.error);
  const gateStatus = isBootLoading ? 'loading' : firstError ? 'error' : 'ready';
  const gateError = firstError && isApiError(firstError) ? firstError : null;

  const retryAll = () => {
    void categoriesQuery.refetch();
    void packagesQuery.refetch();
  };

  return (
    <AdminDataGate status={gateStatus} error={gateError} onRetry={retryAll}>
      {packagesQuery.data && categoriesQuery.data && (
        <AdminServicePackagesListView
          result={packagesQuery.data}
          categories={categoriesQuery.data}
          query={searchInput}
          categoryId={parsedCategoryId ? String(parsedCategoryId) : ''}
          status={urlStatus}
          sort={urlSort}
          pageSize={urlSize}
          isFetching={packagesQuery.isFetching || categoriesQuery.isFetching}
          onQueryChange={setSearchInput}
          onCategoryChange={(value) => replaceParams({ categoryId: value || undefined, page: undefined })}
          onStatusChange={(value) => replaceParams({ status: value || undefined, page: undefined })}
          onSortChange={(value) =>
            replaceParams({ sort: value === DEFAULT_PACKAGE_SORT ? undefined : value, page: undefined })
          }
          onPageChange={(nextPage) => replaceParams({ page: nextPage <= 1 ? undefined : String(nextPage) })}
          onPageSizeChange={(nextSize) =>
            replaceParams({
              size: nextSize === DEFAULT_PACKAGE_PAGE_SIZE ? undefined : String(nextSize),
              page: undefined,
            })
          }
          onResetFilters={() => {
            setSearchInput('');
            router.replace(pathname, { scroll: false });
          }}
        />
      )}
    </AdminDataGate>
  );
}

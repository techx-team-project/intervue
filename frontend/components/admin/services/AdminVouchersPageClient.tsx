'use client';

import { adminVoucherApi } from '@/apiRequest/voucher';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminVouchersView from '@/components/admin/services/AdminVouchersView';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { parsePositiveIntParam } from '@/lib/admin-service-packages';
import {
  adminVoucherKeys,
  DEFAULT_VOUCHER_PAGE_SIZE,
  DEFAULT_VOUCHER_SORT,
  parseVoucherDiscountTypeParam,
  parseVoucherStatusParam,
} from '@/lib/admin-vouchers';
import { isApiError } from '@/lib/api-error';
import type { VoucherDiscountType, VoucherStatus } from '@/types/voucher';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function AdminVouchersPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlStatus = parseVoucherStatusParam(searchParams.get('status'));
  const urlDiscountType = parseVoucherDiscountTypeParam(searchParams.get('discountType'));
  const urlSort = searchParams.get('sort') || DEFAULT_VOUCHER_SORT;
  const urlPage = Math.max(1, parsePositiveIntParam(searchParams.get('page')) ?? 1);
  const urlSize = parsePositiveIntParam(searchParams.get('size')) ?? DEFAULT_VOUCHER_PAGE_SIZE;

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
      keyword: urlQuery.trim() || undefined,
      status: (urlStatus || undefined) as VoucherStatus | undefined,
      discountType: (urlDiscountType || undefined) as VoucherDiscountType | undefined,
      page: urlPage - 1,
      size: urlSize,
      sort: urlSort,
    }),
    [urlDiscountType, urlPage, urlQuery, urlSize, urlSort, urlStatus],
  );

  const vouchersQuery = useQuery({
    queryKey: adminVoucherKeys.list(apiParams),
    queryFn: () => adminVoucherApi.search(apiParams),
    placeholderData: keepPreviousData,
  });

  const isBootLoading = vouchersQuery.isPending && !vouchersQuery.data;
  const firstError = vouchersQuery.data ? null : vouchersQuery.error;
  const gateStatus = isBootLoading ? 'loading' : firstError ? 'error' : 'ready';
  const gateError = firstError && isApiError(firstError) ? firstError : null;

  return (
    <AdminDataGate status={gateStatus} error={gateError} onRetry={() => void vouchersQuery.refetch()}>
      {vouchersQuery.data && (
        <AdminVouchersView
          result={vouchersQuery.data}
          query={searchInput}
          status={urlStatus}
          discountType={urlDiscountType}
          sort={urlSort}
          pageSize={urlSize}
          isFetching={vouchersQuery.isFetching}
          onQueryChange={setSearchInput}
          onStatusChange={(value) => replaceParams({ status: value || undefined, page: undefined })}
          onDiscountTypeChange={(value) => replaceParams({ discountType: value || undefined, page: undefined })}
          onSortChange={(value) =>
            replaceParams({ sort: value === DEFAULT_VOUCHER_SORT ? undefined : value, page: undefined })
          }
          onPageChange={(nextPage) => replaceParams({ page: nextPage <= 1 ? undefined : String(nextPage) })}
          onPageSizeChange={(nextSize) =>
            replaceParams({
              size: nextSize === DEFAULT_VOUCHER_PAGE_SIZE ? undefined : String(nextSize),
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

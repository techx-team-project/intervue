'use client';

import { adminAdApi } from '@/apiRequest/ads';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminAdSlotsView from '@/components/admin/ads/AdminAdSlotsView';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  adminAdKeys,
  DEFAULT_AD_SLOT_PAGE_SIZE,
  DEFAULT_AD_SLOT_SORT,
  parseAdPlacementParam,
  parseAdSlotSaleParam,
  parseAdSlotSortParam,
} from '@/lib/admin-ads';
import { parsePositiveIntParam } from '@/lib/admin-service-packages';
import { isApiError } from '@/lib/api-error';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function AdminAdSlotsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlPlacement = parseAdPlacementParam(searchParams.get('placement'));
  const urlStatus = parseAdSlotSaleParam(searchParams.get('status'));
  const urlSort = parseAdSlotSortParam(searchParams.get('sort'));
  const urlPage = Math.max(1, parsePositiveIntParam(searchParams.get('page')) ?? 1);
  const urlSize = parsePositiveIntParam(searchParams.get('size')) ?? DEFAULT_AD_SLOT_PAGE_SIZE;

  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebouncedValue(searchInput, 250);

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

  const slotsQuery = useQuery({
    queryKey: adminAdKeys.slots(),
    queryFn: () => adminAdApi.slots(),
  });

  const isBootLoading = slotsQuery.isPending && !slotsQuery.data;
  const firstError = slotsQuery.data ? null : slotsQuery.error;
  const gateStatus = isBootLoading ? 'loading' : firstError ? 'error' : 'ready';
  const gateError = firstError && isApiError(firstError) ? firstError : null;

  return (
    <AdminDataGate status={gateStatus} error={gateError} onRetry={() => void slotsQuery.refetch()}>
      {slotsQuery.data && (
        <AdminAdSlotsView
          slots={slotsQuery.data}
          query={searchInput}
          placement={urlPlacement}
          status={urlStatus}
          sort={urlSort}
          page={urlPage}
          pageSize={urlSize}
          isFetching={slotsQuery.isFetching}
          onQueryChange={setSearchInput}
          onPlacementChange={(value) => replaceParams({ placement: value || undefined, page: undefined })}
          onStatusChange={(value) => replaceParams({ status: value || undefined, page: undefined })}
          onSortChange={(value) =>
            replaceParams({ sort: value === DEFAULT_AD_SLOT_SORT ? undefined : value, page: undefined })
          }
          onPageChange={(nextPage) => replaceParams({ page: nextPage <= 1 ? undefined : String(nextPage) })}
          onPageSizeChange={(nextSize) =>
            replaceParams({
              size: nextSize === DEFAULT_AD_SLOT_PAGE_SIZE ? undefined : String(nextSize),
              page: undefined,
            })
          }
          onResetFilters={() => {
            setSearchInput('');
            replaceParams({
              q: undefined,
              placement: undefined,
              status: undefined,
              sort: undefined,
              page: undefined,
            });
          }}
        />
      )}
    </AdminDataGate>
  );
}

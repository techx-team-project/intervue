'use client';

import { adminAdApi } from '@/apiRequest/ads';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminAdCreativesView from '@/components/admin/ads/AdminAdCreativesView';
import { adminAdKeys, DEFAULT_AD_CREATIVE_PAGE_SIZE, parseAdCreativeStatusParam } from '@/lib/admin-ads';
import { parsePositiveIntParam } from '@/lib/admin-service-packages';
import { isApiError } from '@/lib/api-error';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function AdminAdCreativesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlStatus = parseAdCreativeStatusParam(searchParams.get('status'));
  const urlPage = Math.max(1, parsePositiveIntParam(searchParams.get('page')) ?? 1);
  const urlSize = parsePositiveIntParam(searchParams.get('size')) ?? DEFAULT_AD_CREATIVE_PAGE_SIZE;

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

  const apiParams = useMemo(
    () => ({
      status: urlStatus,
      page: urlPage - 1,
      size: urlSize,
    }),
    [urlPage, urlSize, urlStatus],
  );

  const creativesQuery = useQuery({
    queryKey: adminAdKeys.creatives(apiParams),
    queryFn: () => adminAdApi.creatives(apiParams.status, apiParams.page, apiParams.size),
    placeholderData: keepPreviousData,
  });

  const pendingBadgeQuery = useQuery({
    queryKey: adminAdKeys.creatives({ status: 'PENDING', page: 0, size: 1 }),
    queryFn: () => adminAdApi.creatives('PENDING', 0, 1),
  });

  const isBootLoading = creativesQuery.isPending && !creativesQuery.data;
  const firstError = creativesQuery.data ? null : creativesQuery.error;
  const gateStatus = isBootLoading ? 'loading' : firstError ? 'error' : 'ready';
  const gateError = firstError && isApiError(firstError) ? firstError : null;

  return (
    <AdminDataGate status={gateStatus} error={gateError} onRetry={() => void creativesQuery.refetch()}>
      {creativesQuery.data && (
        <AdminAdCreativesView
          result={creativesQuery.data}
          status={urlStatus}
          pendingCount={pendingBadgeQuery.data?.totalItems}
          pageSize={urlSize}
          isFetching={creativesQuery.isFetching}
          onStatusChange={(nextStatus) => replaceParams({ status: nextStatus || undefined, page: undefined })}
          onPageChange={(nextPage) => replaceParams({ page: nextPage <= 1 ? undefined : String(nextPage) })}
          onPageSizeChange={(nextSize) =>
            replaceParams({
              size: nextSize === DEFAULT_AD_CREATIVE_PAGE_SIZE ? undefined : String(nextSize),
              page: undefined,
            })
          }
        />
      )}
    </AdminDataGate>
  );
}

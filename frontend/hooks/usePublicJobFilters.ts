'use client';

import type { PublicJobFilters } from '@/types/job-filters';
import { EMPTY_FILTERS, readFilters, writeFilters } from '@/utils/job-filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function usePublicJobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = readFilters(searchParams);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const navigate = useCallback(
    (next: PublicJobFilters, nextPage: number) => {
      const query = writeFilters(next, nextPage);
      router.replace(query ? `/jobs?${query}` : '/jobs', { scroll: false });
    },
    [router],
  );

  return {
    filters,
    page,
    update: (patch: Partial<PublicJobFilters>) => navigate({ ...filters, ...patch }, 1),
    goToPage: (nextPage: number) => navigate(filters, nextPage),
    clearAll: () => navigate(EMPTY_FILTERS, 1),
  };
}

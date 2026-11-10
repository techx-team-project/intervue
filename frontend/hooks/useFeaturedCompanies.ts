'use client';

import { featuredCompanyApi } from '@/apiRequest/featured-company';
import { useQuery } from '@tanstack/react-query';

const STALE_MS = 5 * 60 * 1000;

export function useFeaturedCompanies(limit = 8) {
  return useQuery({
    queryKey: ['companies', 'featured', limit],
    queryFn: () => featuredCompanyApi.list(limit),
    staleTime: STALE_MS,
  });
}

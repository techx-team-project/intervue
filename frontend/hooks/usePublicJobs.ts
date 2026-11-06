'use client';

import { publicJobApi, type PublicJobSearchParams } from '@/apiRequest/public-job';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function usePublicJobs(params: PublicJobSearchParams) {
  return useQuery({
    queryKey: ['public', 'jobs', params],
    queryFn: () => publicJobApi.search(params),
    placeholderData: keepPreviousData,
  });
}

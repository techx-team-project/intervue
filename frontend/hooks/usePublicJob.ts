'use client';

import { publicJobApi } from '@/apiRequest/public-job';
import { useQuery } from '@tanstack/react-query';

const JOB_STALE_MS = 60_000;

export function usePublicJob(id: number | null) {
  return useQuery({
    queryKey: ['public', 'job', id],
    queryFn: () => publicJobApi.get(id as number),
    enabled: id !== null,
    staleTime: JOB_STALE_MS,
  });
}

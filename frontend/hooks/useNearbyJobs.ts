'use client';

import { publicJobApi } from '@/apiRequest/public-job';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface NearbyParams {
  lat: number;
  lng: number;
  radiusKm: number;
}

export function useNearbyJobs(params: NearbyParams | null) {
  return useQuery({
    queryKey: ['public', 'jobs', 'nearby', params],
    queryFn: () => publicJobApi.nearby(params as NearbyParams),
    enabled: params !== null,
    placeholderData: keepPreviousData,
  });
}

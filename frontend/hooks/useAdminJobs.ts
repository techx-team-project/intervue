'use client';

import { adminJobApi, type AdminJobSearchParams } from '@/apiRequest/admin-job';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const adminJobKeys = {
  all: ['admin', 'jobs'] as const,
  list: (params: AdminJobSearchParams) => ['admin', 'jobs', 'list', params] as const,
  counts: ['admin', 'jobs', 'counts'] as const,
  detail: (id: number) => ['admin', 'jobs', 'detail', id] as const,
};

export function useAdminJobList(params: AdminJobSearchParams) {
  return useQuery({
    queryKey: adminJobKeys.list(params),
    queryFn: () => adminJobApi.search(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminJobCounts() {
  return useQuery({ queryKey: adminJobKeys.counts, queryFn: adminJobApi.counts });
}

export function useAdminJob(id: number | null) {
  return useQuery({
    queryKey: adminJobKeys.detail(id ?? 0),
    queryFn: () => adminJobApi.get(id as number),
    enabled: id !== null,
  });
}

export function useAdminJobModeration() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: adminJobKeys.all });

  const hide = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => adminJobApi.hide(id, reason),
    onSuccess: refresh,
  });
  const restore = useMutation({ mutationFn: (id: number) => adminJobApi.restore(id), onSuccess: refresh });
  const approve = useMutation({ mutationFn: (id: number) => adminJobApi.approve(id), onSuccess: refresh });
  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => adminJobApi.reject(id, reason),
    onSuccess: refresh,
  });

  return { hide, restore, approve, reject };
}

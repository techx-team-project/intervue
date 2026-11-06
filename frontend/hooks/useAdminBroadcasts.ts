'use client';

import { adminBroadcastApi, type BroadcastSearchParams } from '@/apiRequest/notification';
import type { BroadcastInput } from '@/types/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

const PAGE_SIZE = 20;

export const broadcastKeys = {
  all: ['admin', 'broadcasts'] as const,
  list: (params: BroadcastSearchParams) => ['admin', 'broadcasts', 'list', params] as const,
  detail: (id: number) => ['admin', 'broadcasts', 'detail', id] as const,
  audience: (id: number) => ['admin', 'broadcasts', 'audience', id] as const,
};

export function useAdminBroadcasts() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BroadcastSearchParams>({ page: 0, size: PAGE_SIZE });

  const listQuery = useQuery({
    queryKey: broadcastKeys.list(filters),
    queryFn: () => adminBroadcastApi.search(filters),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: broadcastKeys.all });
  }, [queryClient]);

  const sendMutation = useMutation({ mutationFn: adminBroadcastApi.send, onSuccess: invalidate });
  const cancelMutation = useMutation({ mutationFn: adminBroadcastApi.cancel, onSuccess: invalidate });
  const removeMutation = useMutation({ mutationFn: adminBroadcastApi.remove, onSuccess: invalidate });

  const patchFilters = useCallback((next: Partial<BroadcastSearchParams>) => {
    setFilters((prev) => ({ ...prev, ...next, page: next.page ?? 0 }));
  }, []);

  return {
    broadcasts: listQuery.data?.items ?? [],
    totalItems: listQuery.data?.totalItems ?? 0,
    totalPages: listQuery.data?.totalPages ?? 0,
    pageSize: PAGE_SIZE,
    filters,
    patchFilters,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    send: sendMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isMutating: sendMutation.isPending || cancelMutation.isPending || removeMutation.isPending,
  };
}

export function useAdminBroadcast(id: number | null) {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: broadcastKeys.detail(id ?? 0),
    queryFn: () => adminBroadcastApi.getById(id as number),
    enabled: id !== null,
  });

  const audienceQuery = useQuery({
    queryKey: broadcastKeys.audience(id ?? 0),
    queryFn: () => adminBroadcastApi.previewAudience(id as number),
    enabled: id !== null,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: broadcastKeys.all });

  const createMutation = useMutation({ mutationFn: adminBroadcastApi.create, onSuccess: invalidate });

  const updateMutation = useMutation({
    mutationFn: (data: BroadcastInput) => adminBroadcastApi.update(id as number, data),
    onSuccess: invalidate,
  });

  const sendMutation = useMutation({
    mutationFn: () => adminBroadcastApi.send(id as number),
    onSuccess: invalidate,
  });

  return {
    broadcast: detailQuery.data ?? null,
    audience: audienceQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    send: sendMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isSending: sendMutation.isPending,
  };
}

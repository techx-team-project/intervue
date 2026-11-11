'use client';

import { entitlementApi } from '@/apiRequest/entitlement';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const entitlementKeys = {
  all: ['recruiter', 'entitlements'] as const,
  stock: ['recruiter', 'entitlements', 'stock'] as const,
  active: ['recruiter', 'entitlements', 'active'] as const,
};

export function useEntitlementStock() {
  return useQuery({ queryKey: entitlementKeys.stock, queryFn: entitlementApi.stock });
}

export function useActiveEntitlements() {
  return useQuery({ queryKey: entitlementKeys.active, queryFn: entitlementApi.active });
}

export function useActivateEntitlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, jobId }: { id: number; jobId?: number }) => entitlementApi.activate(id, jobId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: entitlementKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] }),
      ]),
  });
}

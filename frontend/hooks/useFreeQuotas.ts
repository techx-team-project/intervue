'use client';

import { adminFreeQuotaApi } from '@/apiRequest/free-quota';
import type { SaveFreeQuotaSettingsInput } from '@/types/free-quota';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const freeQuotaKeys = {
  admin: ['admin', 'free-quotas'] as const,
};

export function useAdminFreeQuotas(enabled = true) {
  return useQuery({
    queryKey: freeQuotaKeys.admin,
    queryFn: adminFreeQuotaApi.get,
    enabled,
  });
}

export function useUpdateAdminFreeQuotas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveFreeQuotaSettingsInput) => adminFreeQuotaApi.update(input),
    onSuccess: (updated) => {
      qc.setQueryData(freeQuotaKeys.admin, updated);
    },
  });
}

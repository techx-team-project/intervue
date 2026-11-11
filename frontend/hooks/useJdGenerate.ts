'use client';

import { generateJobDescription, getJdGenerateQuota, type JdGeneratePayload } from '@/apiRequest/ai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entitlementKeys } from './useEntitlements';

export const jdGenerateQuotaKey = ['recruiter', 'ai', 'jd-generate', 'quota'] as const;

export function useJdGenerateQuota() {
  return useQuery({ queryKey: jdGenerateQuotaKey, queryFn: getJdGenerateQuota });
}

export function useGenerateJobDescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JdGeneratePayload) => generateJobDescription(payload),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: jdGenerateQuotaKey }),
        queryClient.invalidateQueries({ queryKey: entitlementKeys.all }),
      ]),
  });
}

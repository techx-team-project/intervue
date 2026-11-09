'use client';

import {
  adminIdentityVerificationApi,
  identityVerificationApi,
  type AdminIdentitySearchParams,
} from '@/apiRequest/identity-verification';
import { useAuth } from '@/hooks/useAuth';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const statusKey = ['candidate', 'identity-verification'] as const;
const adminKey = ['admin', 'identity-verifications'] as const;

export function useIdentityVerification() {
  const { isAuthenticated, hasRole } = useAuth();
  return useQuery({
    queryKey: statusKey,
    queryFn: identityVerificationApi.status,
    enabled: isAuthenticated && hasRole('CANDIDATE'),
    staleTime: 30_000,
  });
}

export function useSubmitIdentityVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: identityVerificationApi.submit,
    onSuccess: (data) => queryClient.setQueryData(statusKey, data),
  });
}

export function useRequestManualIdentityReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: identityVerificationApi.requestManualReview,
    onSuccess: (data) => queryClient.setQueryData(statusKey, data),
  });
}

export function useAdminIdentityVerifications(params: AdminIdentitySearchParams) {
  return useQuery({
    queryKey: [...adminKey, params],
    queryFn: () => adminIdentityVerificationApi.search(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminIdentityReview() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: adminKey });
  return {
    approve: useMutation({ mutationFn: adminIdentityVerificationApi.approve, onSuccess: refresh }),
    reject: useMutation({
      mutationFn: (input: { id: number; reason: string }) =>
        adminIdentityVerificationApi.reject(input.id, input.reason),
      onSuccess: refresh,
    }),
    grantAttempts: useMutation({ mutationFn: adminIdentityVerificationApi.grantAttempts, onSuccess: refresh }),
  };
}

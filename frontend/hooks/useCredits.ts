'use client';

import { creditApi } from '@/apiRequest/credit';
import { entitlementKeys } from '@/hooks/useEntitlements';
import type { ConvertCreditsInput } from '@/types/credit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const creditKeys = {
  wallet: ['recruiter', 'credits'] as const,
  ledger: ['recruiter', 'credits', 'ledger'] as const,
};

export function useCreditWallet() {
  return useQuery({ queryKey: creditKeys.wallet, queryFn: creditApi.getWallet });
}

export function useCreditLedger(enabled: boolean) {
  return useQuery({ queryKey: creditKeys.ledger, queryFn: creditApi.getLedger, enabled });
}

export function useConvertCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ConvertCreditsInput) => creditApi.convert(input),
    onSuccess: (wallet) => {
      queryClient.setQueryData(creditKeys.wallet, wallet);
      queryClient.invalidateQueries({ queryKey: entitlementKeys.all });
      queryClient.invalidateQueries({ queryKey: creditKeys.ledger });
    },
  });
}

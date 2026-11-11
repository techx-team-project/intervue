'use client';

import { creditApi } from '@/apiRequest/credit';
import { entitlementKeys } from '@/hooks/useEntitlements';
import type { ConvertCreditsInput } from '@/types/credit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const walletKey = ['recruiter', 'credits'] as const;
const ledgerKey = ['recruiter', 'credits', 'ledger'] as const;

export function useCreditWallet() {
  return useQuery({ queryKey: walletKey, queryFn: creditApi.getWallet });
}

export function useCreditLedger(enabled: boolean) {
  return useQuery({ queryKey: ledgerKey, queryFn: creditApi.getLedger, enabled });
}

export function useConvertCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ConvertCreditsInput) => creditApi.convert(input),
    onSuccess: (wallet) => {
      queryClient.setQueryData(walletKey, wallet);
      queryClient.invalidateQueries({ queryKey: entitlementKeys.all });
      queryClient.invalidateQueries({ queryKey: ledgerKey });
    },
  });
}

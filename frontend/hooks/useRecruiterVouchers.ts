import { voucherApi } from '@/apiRequest/voucher';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const recruiterVoucherKeys = {
  all: ['recruiter', 'vouchers'] as const,
  available: (packageId?: number) => ['recruiter', 'vouchers', 'available', packageId ?? 'all'] as const,
  walletAvailable: (page: number, size: number) =>
    ['recruiter', 'vouchers', 'wallet', 'available', page, size] as const,
  walletUsed: (page: number, size: number) => ['recruiter', 'vouchers', 'wallet', 'used', page, size] as const,
};

export function useAvailableRecruiterVouchers(enabled = true, packageId?: number) {
  return useQuery({
    queryKey: recruiterVoucherKeys.available(packageId),
    queryFn: () => voucherApi.listAvailable(packageId),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useAvailableVoucherWallet(page: number, size: number, enabled = true) {
  return useQuery({
    queryKey: recruiterVoucherKeys.walletAvailable(page, size),
    queryFn: () => voucherApi.listAvailableWallet(page, size),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: false,
  });
}

export function useUsedVoucherWallet(page: number, size: number, enabled = true) {
  return useQuery({
    queryKey: recruiterVoucherKeys.walletUsed(page, size),
    queryFn: () => voucherApi.listUsedWallet(page, size),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: false,
  });
}

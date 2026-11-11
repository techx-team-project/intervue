import { voucherApi } from '@/apiRequest/voucher';
import { useQuery } from '@tanstack/react-query';

export const recruiterVoucherKeys = {
  available: ['recruiter', 'vouchers', 'available'] as const,
};

export function useAvailableRecruiterVouchers(enabled = true) {
  return useQuery({
    queryKey: recruiterVoucherKeys.available,
    queryFn: () => voucherApi.listAvailable(),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

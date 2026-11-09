'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import type { CheckoutPayload } from '@/types/recruiter-order';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const recruiterOrderKeys = {
  all: ['recruiter', 'orders'] as const,
  list: (page: number, size: number) => ['recruiter', 'orders', 'list', page, size] as const,
  detail: (code: string) => ['recruiter', 'orders', 'detail', code] as const,
};

export function useRecruiterOrderList(page: number, size = 10) {
  return useQuery({
    queryKey: recruiterOrderKeys.list(page, size),
    queryFn: () => recruiterOrderApi.search(page, size),
    placeholderData: keepPreviousData,
  });
}

export function useRecruiterOrder(code: string) {
  return useQuery({
    queryKey: recruiterOrderKeys.detail(code),
    queryFn: () => recruiterOrderApi.get(code),
  });
}

export function useRecruiterOrderMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: recruiterOrderKeys.all });

  const checkout = useMutation({
    mutationFn: (payload: CheckoutPayload) => recruiterOrderApi.checkout(payload),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'cart'] });
    },
  });

  const cancel = useMutation({
    mutationFn: (code: string) => recruiterOrderApi.cancel(code),
    onSuccess: invalidate,
  });

  return { checkout, cancel };
}

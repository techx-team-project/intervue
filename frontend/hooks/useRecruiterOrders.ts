'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import type { CheckoutPayload } from '@/types/recruiter-order';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const recruiterOrderKeys = {
  all: ['recruiter', 'orders'] as const,
  list: (page: number, size: number) => ['recruiter', 'orders', 'list', page, size] as const,
  detail: (code: string) => ['recruiter', 'orders', 'detail', code] as const,
  payment: (code: string) => ['recruiter', 'orders', 'payment', code] as const,
};

const PAYMENT_POLL_MS = 5000;

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

// While an order is still awaiting money the panel polls; a settled order stops polling
export function useOrderPayment(code: string, live: boolean) {
  return useQuery({
    queryKey: recruiterOrderKeys.payment(code),
    queryFn: () => recruiterOrderApi.payment(code),
    refetchInterval: live ? PAYMENT_POLL_MS : false,
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

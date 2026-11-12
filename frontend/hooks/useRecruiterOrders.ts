'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import { adKeys } from '@/hooks/useAds';
import { entitlementKeys } from '@/hooks/useEntitlements';
import { notificationKeys } from '@/hooks/useNotifications';
import type { CheckoutPayload, RecruiterOrderStatus } from '@/types/recruiter-order';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const recruiterOrderKeys = {
  all: ['recruiter', 'orders'] as const,
  counts: ['recruiter', 'orders', 'counts'] as const,
  list: (page: number, size: number) => ['recruiter', 'orders', 'list', page, size] as const,
  detail: (code: string) => ['recruiter', 'orders', 'detail', code] as const,
  payment: (code: string) => ['recruiter', 'orders', 'payment', code] as const,
  payments: (page: number, size: number) => ['recruiter', 'orders', 'payments', page, size] as const,
  paymentsSummary: ['recruiter', 'orders', 'payments', 'summary'] as const,
  refunds: (page: number, size: number) => ['recruiter', 'orders', 'refunds', page, size] as const,
  refundsSummary: ['recruiter', 'orders', 'refunds', 'summary'] as const,
};

const PAYMENT_POLL_MS = 4000;
const PENDING_ORDER_STATUSES: RecruiterOrderStatus[] = ['PENDING_PAYMENT', 'UNDERPAID'];
const PAID_ORDER_STATUSES: RecruiterOrderStatus[] = ['PAID', 'FULFILLED'];
const SETTLED: RecruiterOrderStatus[] = ['PAID', 'FULFILLED', 'EXPIRED', 'CANCELLED'];

function invalidateAfterOrderPaid(queryClient: ReturnType<typeof useQueryClient>, code?: string) {
  queryClient.invalidateQueries({ queryKey: recruiterOrderKeys.all });
  if (code) {
    queryClient.invalidateQueries({ queryKey: recruiterOrderKeys.detail(code) });
  }
  queryClient.invalidateQueries({ queryKey: entitlementKeys.all });
  queryClient.invalidateQueries({ queryKey: adKeys.bookings });
  queryClient.invalidateQueries({ queryKey: notificationKeys.all('recruiter') });
}

export function useRecruiterOrderList(page: number, size = 10) {
  const queryClient = useQueryClient();
  const pendingCodesRef = useRef<Set<string>>(new Set());

  return useQuery({
    queryKey: recruiterOrderKeys.list(page, size),
    queryFn: async () => {
      const result = await recruiterOrderApi.search(page, size);
      const newlyPaid = result.items.filter(
        (item) => pendingCodesRef.current.has(item.code) && PAID_ORDER_STATUSES.includes(item.status),
      );
      if (newlyPaid.length > 0) {
        for (const item of newlyPaid) {
          toast.success(`Payment confirmed for order ${item.code}!`);
        }
        invalidateAfterOrderPaid(queryClient);
      }
      pendingCodesRef.current = new Set(
        result.items.filter((item) => PENDING_ORDER_STATUSES.includes(item.status)).map((item) => item.code),
      );
      return result;
    },
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      return items.some((item) => PENDING_ORDER_STATUSES.includes(item.status)) ? PAYMENT_POLL_MS : false;
    },
  });
}

export function useRecruiterOrderCounts() {
  return useQuery({ queryKey: recruiterOrderKeys.counts, queryFn: recruiterOrderApi.counts });
}

export function useRecruiterOrder(code: string) {
  return useQuery({
    queryKey: recruiterOrderKeys.detail(code),
    queryFn: () => recruiterOrderApi.get(code),
  });
}

export function useRecruiterPayments(page: number, size = 10) {
  return useQuery({
    queryKey: recruiterOrderKeys.payments(page, size),
    queryFn: () => recruiterOrderApi.searchPayments(page, size),
    placeholderData: keepPreviousData,
  });
}

export function useRecruiterPaymentsSummary() {
  return useQuery({
    queryKey: recruiterOrderKeys.paymentsSummary,
    queryFn: recruiterOrderApi.paymentsSummary,
  });
}

export function useRecruiterRefunds(page: number, size = 10) {
  return useQuery({
    queryKey: recruiterOrderKeys.refunds(page, size),
    queryFn: () => recruiterOrderApi.searchRefunds(page, size),
    placeholderData: keepPreviousData,
  });
}

export function useRecruiterRefundsSummary() {
  return useQuery({
    queryKey: recruiterOrderKeys.refundsSummary,
    queryFn: recruiterOrderApi.refundsSummary,
  });
}

// While an order is still awaiting money the panel polls; the moment the bank reports the payment
// the order, list, entitlements, and notifications are refreshed automatically
export function useOrderPayment(code: string, live: boolean) {
  const queryClient = useQueryClient();
  const sawPendingRef = useRef(false);
  const notifiedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    sawPendingRef.current = false;
  }, [code]);

  return useQuery({
    queryKey: recruiterOrderKeys.payment(code),
    queryFn: async () => {
      const payment = await recruiterOrderApi.payment(code);
      if (PENDING_ORDER_STATUSES.includes(payment.status)) {
        sawPendingRef.current = true;
      } else if (SETTLED.includes(payment.status)) {
        if (sawPendingRef.current && PAID_ORDER_STATUSES.includes(payment.status) && notifiedCodeRef.current !== code) {
          notifiedCodeRef.current = code;
          toast.success(`Payment confirmed for order ${code}! Your service package is now active.`);
        }
        invalidateAfterOrderPaid(queryClient, code);
      }
      return payment;
    },
    refetchInterval: (query) =>
      live && !SETTLED.includes(query.state.data?.status ?? 'PENDING_PAYMENT') ? PAYMENT_POLL_MS : false,
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

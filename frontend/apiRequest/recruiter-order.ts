import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  CheckoutPayload,
  OrderInvoice,
  OrderPayment,
  OrderRefundRequest,
  OrderStatusCounts,
  PaymentTransactionSummary,
  RecruiterPaymentTransaction,
  RefundBank,
  RefundQuote,
  RecruiterOrder,
  RecruiterOrderSummary,
  RefundStatusCounts,
} from '@/types/recruiter-order';

export const recruiterOrderApi = {
  search: (page: number, size: number) =>
    request<Page<RecruiterOrderSummary>>(`/recruiter/orders?page=${page}&size=${size}`),

  counts: () => request<OrderStatusCounts>('/recruiter/orders/summary'),

  searchPayments: (page: number, size: number) =>
    request<Page<RecruiterPaymentTransaction>>(`/recruiter/orders/payments?page=${page}&size=${size}`),

  paymentsSummary: () => request<PaymentTransactionSummary>('/recruiter/orders/payments/summary'),

  searchRefunds: (page: number, size: number) =>
    request<Page<OrderRefundRequest>>(`/recruiter/orders/refunds?page=${page}&size=${size}`),

  refundsSummary: () => request<RefundStatusCounts>('/recruiter/orders/refunds/summary'),

  get: (code: string) => request<RecruiterOrder>(`/recruiter/orders/${code}`),

  payment: (code: string) => request<OrderPayment>(`/recruiter/orders/${code}/payment`),

  checkout: (payload: CheckoutPayload) =>
    request<RecruiterOrder>('/recruiter/orders', { method: 'POST', body: payload }),

  invoice: (code: string) => request<OrderInvoice>(`/recruiter/orders/${code}/invoice`),

  invoicePdf: (code: string) => request<Blob>(`/recruiter/orders/${code}/invoice/pdf`, { responseType: 'blob' }),

  refundQuote: (code: string) => request<RefundQuote>(`/recruiter/orders/${code}/refund`),

  refundBanks: () => request<RefundBank[]>('/recruiter/orders/refund-banks'),

  requestRefund: (
    code: string,
    payload: { reason: string; bankCode: string; bankAccountNumber: string; bankAccountName: string },
  ) => request<OrderRefundRequest>(`/recruiter/orders/${code}/refund`, { method: 'POST', body: payload }),

  cancel: (code: string) => request<RecruiterOrder>(`/recruiter/orders/${code}/cancel`, { method: 'POST' }),
};

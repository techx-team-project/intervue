import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  CheckoutPayload,
  OrderInvoice,
  OrderPayment,
  OrderRefundRequest,
  RefundQuote,
  RecruiterOrder,
  RecruiterOrderSummary,
} from '@/types/recruiter-order';

export const recruiterOrderApi = {
  search: (page: number, size: number) =>
    request<Page<RecruiterOrderSummary>>(`/recruiter/orders?page=${page}&size=${size}`),

  get: (code: string) => request<RecruiterOrder>(`/recruiter/orders/${code}`),

  payment: (code: string) => request<OrderPayment>(`/recruiter/orders/${code}/payment`),

  checkout: (payload: CheckoutPayload) =>
    request<RecruiterOrder>('/recruiter/orders', { method: 'POST', body: payload }),

  invoice: (code: string) => request<OrderInvoice>(`/recruiter/orders/${code}/invoice`),

  invoicePdf: (code: string) => request<Blob>(`/recruiter/orders/${code}/invoice/pdf`, { responseType: 'blob' }),

  refundQuote: (code: string) => request<RefundQuote>(`/recruiter/orders/${code}/refund`),

  requestRefund: (code: string, reason: string) =>
    request<OrderRefundRequest>(`/recruiter/orders/${code}/refund`, { method: 'POST', body: { reason } }),

  cancel: (code: string) => request<RecruiterOrder>(`/recruiter/orders/${code}/cancel`, { method: 'POST' }),
};

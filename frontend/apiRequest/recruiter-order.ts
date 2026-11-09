import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { CheckoutPayload, RecruiterOrder, RecruiterOrderSummary } from '@/types/recruiter-order';

export const recruiterOrderApi = {
  search: (page: number, size: number) =>
    request<Page<RecruiterOrderSummary>>(`/recruiter/orders?page=${page}&size=${size}`),

  get: (code: string) => request<RecruiterOrder>(`/recruiter/orders/${code}`),

  checkout: (payload: CheckoutPayload) =>
    request<RecruiterOrder>('/recruiter/orders', { method: 'POST', body: payload }),

  cancel: (code: string) => request<RecruiterOrder>(`/recruiter/orders/${code}/cancel`, { method: 'POST' }),
};

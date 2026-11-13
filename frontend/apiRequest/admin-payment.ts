import { request } from '@/apiRequest/http';
import type {
  BillingSettings,
  PaymentSyncResult,
  PaymentTransaction,
  PaymentTransactionStatus,
  AdminInvoice,
  AdminOrder,
  AdminOrderStatus,
  AdminRefundRequest,
  AdminRefundStatus,
  AdminRefundStatusCounts,
  RevenueReport,
  SaveBillingSettingsInput,
  SupportedBank,
} from '@/types/admin-payment';
import type { Page } from '@/types/api';

export const adminPaymentApi = {
  getSettings: () => request<BillingSettings>('/admin/payments/settings'),

  getBanks: () => request<SupportedBank[]>('/admin/payments/banks'),

  updateSettings: (data: SaveBillingSettingsInput) =>
    request<BillingSettings>('/admin/payments/settings', { method: 'PUT', body: data }),

  searchTransactions: (status: PaymentTransactionStatus | '', page: number, size = 20) =>
    request<Page<PaymentTransaction>>(
      `/admin/payments/transactions?${new URLSearchParams({
        ...(status ? { status } : {}),
        page: String(page),
        size: String(size),
      })}`,
    ),

  match: (id: number, orderCode: string, note?: string) =>
    request<PaymentTransaction>(`/admin/payments/transactions/${id}/match`, {
      method: 'POST',
      body: { orderCode, note },
    }),

  sync: () => request<PaymentSyncResult>('/admin/payments/sync', { method: 'POST' }),

  searchInvoices: (page: number, size: number) =>
    request<Page<AdminInvoice>>(`/admin/invoices?page=${page}&size=${size}`),

  invoicePdf: (id: number) => request<Blob>(`/admin/invoices/${id}/pdf`, { responseType: 'blob' }),

  searchRefunds: (params: { status?: AdminRefundStatus | ''; orderCode?: string; page: number; size: number }) =>
    request<Page<AdminRefundRequest>>(
      `/admin/refunds?${new URLSearchParams({
        ...(params.status ? { status: params.status } : {}),
        ...(params.orderCode ? { orderCode: params.orderCode } : {}),
        page: String(params.page),
        size: String(params.size),
      })}`,
    ),

  refundsSummary: () => request<AdminRefundStatusCounts>('/admin/refunds/summary'),

  approveRefund: (id: number, approvedAmount: number | null, adminNote: string) =>
    request<AdminRefundRequest>(`/admin/refunds/${id}/approve`, {
      method: 'POST',
      body: { approvedAmount, adminNote },
    }),

  searchOrders: (params: {
    code?: string;
    status?: AdminOrderStatus | '';
    needsManualRefund?: boolean;
    page: number;
    size: number;
  }) =>
    request<Page<AdminOrder>>(
      `/admin/orders?${new URLSearchParams({
        ...(params.code ? { code: params.code } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.needsManualRefund ? { needsManualRefund: 'true' } : {}),
        page: String(params.page),
        size: String(params.size),
      })}`,
    ),

  getOrder: (code: string) => request<AdminOrder>(`/admin/orders/${code}`),

  resolveManualRefund: (code: string) =>
    request<AdminOrder>(`/admin/orders/${code}/resolve-manual-refund`, { method: 'POST' }),

  revenue: () => request<RevenueReport>('/admin/orders/revenue'),

  rejectRefund: (id: number, adminNote: string) =>
    request<AdminRefundRequest>(`/admin/refunds/${id}/reject`, { method: 'POST', body: { adminNote } }),
};

import { request } from '@/apiRequest/http';
import type {
  BillingSettings,
  PaymentSyncResult,
  PaymentTransaction,
  PaymentTransactionStatus,
  AdminInvoice,
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
};

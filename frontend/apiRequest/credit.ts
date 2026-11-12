import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdjustCompanyCreditsInput,
  AdminCompanyCreditDetail,
  AdminCompanyCreditSummary,
  ConvertCreditsInput,
  CreateCreditPriceInput,
  CreditLedgerEntry,
  CreditPrice,
  CreditWallet,
  FreeQuotaSettings,
  SaveCreditPriceInput,
  SaveFreeQuotaSettingsInput,
} from '@/types/credit';

export const creditApi = {
  getWallet: () => request<CreditWallet>('/recruiter/credits'),

  getLedger: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    query.set('page', String(params?.page ?? 0));
    query.set('size', String(params?.size ?? 20));
    return request<Page<CreditLedgerEntry>>(`/recruiter/credits/ledger?${query.toString()}`);
  },

  convert: (data: ConvertCreditsInput) =>
    request<CreditWallet>('/recruiter/credits/convert', { method: 'POST', body: data }),
};

export const adminCreditPriceApi = {
  list: () => request<CreditPrice[]>('/admin/credit-prices'),

  create: (data: CreateCreditPriceInput) =>
    request<CreditPrice>('/admin/credit-prices', { method: 'POST', body: data }),

  update: (id: number, data: SaveCreditPriceInput) =>
    request<CreditPrice>(`/admin/credit-prices/${id}`, { method: 'PUT', body: data }),
};

export const adminFreeQuotaApi = {
  get: () => request<FreeQuotaSettings>('/admin/free-quotas'),

  update: (data: SaveFreeQuotaSettingsInput) =>
    request<FreeQuotaSettings>('/admin/free-quotas', { method: 'PUT', body: data }),
};

export const adminCompanyCreditApi = {
  list: (params?: { q?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.q?.trim()) query.set('q', params.q.trim());
    query.set('page', String(params?.page ?? 0));
    query.set('size', String(params?.size ?? 10));
    return request<Page<AdminCompanyCreditSummary>>(`/admin/credits/companies?${query.toString()}`);
  },

  detail: (companyId: number) => request<AdminCompanyCreditDetail>(`/admin/credits/companies/${companyId}`),

  ledger: (companyId: number, params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams();
    query.set('page', String(params?.page ?? 0));
    query.set('size', String(params?.size ?? 10));
    return request<Page<CreditLedgerEntry>>(`/admin/credits/companies/${companyId}/ledger?${query.toString()}`);
  },

  adjust: (companyId: number, data: AdjustCompanyCreditsInput) =>
    request<AdminCompanyCreditDetail>(`/admin/credits/companies/${companyId}/adjust`, {
      method: 'POST',
      body: data,
    }),
};

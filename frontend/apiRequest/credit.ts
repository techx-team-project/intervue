import { request } from '@/apiRequest/http';
import type {
  ConvertCreditsInput,
  CreateCreditPriceInput,
  CreditLedgerEntry,
  CreditPrice,
  CreditWallet,
  SaveCreditPriceInput,
} from '@/types/credit';

export const creditApi = {
  getWallet: () => request<CreditWallet>('/recruiter/credits'),

  getLedger: () => request<CreditLedgerEntry[]>('/recruiter/credits/ledger'),

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

import { request } from '@/apiRequest/http';
import type { ConvertCreditsInput, CreditPrice, CreditWallet, SaveCreditPriceInput } from '@/types/credit';

export const creditApi = {
  getWallet: () => request<CreditWallet>('/recruiter/credits'),

  convert: (data: ConvertCreditsInput) =>
    request<CreditWallet>('/recruiter/credits/convert', { method: 'POST', body: data }),
};

export const adminCreditPriceApi = {
  list: () => request<CreditPrice[]>('/admin/credit-prices'),

  update: (id: number, data: SaveCreditPriceInput) =>
    request<CreditPrice>(`/admin/credit-prices/${id}`, { method: 'PUT', body: data }),
};

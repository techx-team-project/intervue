import { request } from '@/apiRequest/http';
import type {
  AdminVoucher,
  AvailableVoucher,
  SaveVoucherInput,
  ValidateVoucherInput,
  VoucherPreview,
} from '@/types/voucher';
import type { Page } from '@/types/api';

export const voucherApi = {
  listAvailable: () => request<AvailableVoucher[]>('/recruiter/vouchers'),

  validate: (data: ValidateVoucherInput) =>
    request<VoucherPreview>('/recruiter/vouchers/validate', { method: 'POST', body: data }),
};

export const adminVoucherApi = {
  search: (keyword: string, page: number, size: number) =>
    request<Page<AdminVoucher>>(
      `/admin/vouchers?${new URLSearchParams({ keyword, page: String(page), size: String(size) })}`,
    ),

  create: (data: SaveVoucherInput) => request<AdminVoucher>('/admin/vouchers', { method: 'POST', body: data }),

  update: (id: number, data: SaveVoucherInput) =>
    request<AdminVoucher>(`/admin/vouchers/${id}`, { method: 'PUT', body: data }),
};

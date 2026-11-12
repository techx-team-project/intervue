import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminVoucher,
  AvailableVoucher,
  SaveVoucherInput,
  UsedVoucher,
  ValidateVoucherInput,
  VoucherDiscountType,
  VoucherPreview,
  VoucherStatus,
} from '@/types/voucher';

export interface AdminVoucherSearchParams {
  keyword?: string;
  status?: VoucherStatus | '';
  discountType?: VoucherDiscountType | '';
  page?: number;
  size?: number;
  sort?: string;
}

export const voucherApi = {
  listAvailable: (packageId?: number) =>
    request<AvailableVoucher[]>(packageId ? `/recruiter/vouchers?packageId=${packageId}` : '/recruiter/vouchers'),

  listAvailableWallet: (page: number, size: number) =>
    request<Page<AvailableVoucher>>(
      `/recruiter/vouchers/available?${new URLSearchParams({ page: String(page), size: String(size) })}`,
    ),

  listUsedWallet: (page: number, size: number) =>
    request<Page<UsedVoucher>>(
      `/recruiter/vouchers/used?${new URLSearchParams({ page: String(page), size: String(size) })}`,
    ),

  validate: (data: ValidateVoucherInput) =>
    request<VoucherPreview>('/recruiter/vouchers/validate', { method: 'POST', body: data }),
};

export const adminVoucherApi = {
  search: (params: AdminVoucherSearchParams) => {
    const query = new URLSearchParams();
    if (params.keyword?.trim()) query.set('keyword', params.keyword.trim());
    if (params.status) query.set('status', params.status);
    if (params.discountType) query.set('discountType', params.discountType);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    if (params.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return request<Page<AdminVoucher>>(qs ? `/admin/vouchers?${qs}` : '/admin/vouchers');
  },

  getById: (id: number) => request<AdminVoucher>(`/admin/vouchers/${id}`),

  create: (data: SaveVoucherInput) => request<AdminVoucher>('/admin/vouchers', { method: 'POST', body: data }),

  update: (id: number, data: SaveVoucherInput) =>
    request<AdminVoucher>(`/admin/vouchers/${id}`, { method: 'PUT', body: data }),

  setStatus: (id: number, active: boolean) =>
    request<AdminVoucher>(`/admin/vouchers/${id}/${active ? 'activate' : 'deactivate'}`, { method: 'POST' }),
};

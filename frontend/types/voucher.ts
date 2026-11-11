export type VoucherDiscountType = 'PERCENTAGE' | 'FIXED';

export interface VoucherPreview {
  code: string;
  label: string;
  description: string | null;
  discountType: VoucherDiscountType;
  discountValue: number;
  discountAmount: number;
  subtotal: number;
  subtotalAfterDiscount: number;
}

export interface ValidateVoucherInput {
  code: string;
  packageId?: number;
  quantity?: number;
  cartItemIds?: number[];
}

export type VoucherStatus = 'ACTIVE' | 'INACTIVE';

export interface AvailableVoucher {
  code: string;
  label: string;
  description: string | null;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number;
  startsAt: string | null;
  endsAt: string | null;
  remainingUses: number | null;
  perCompanyLimit: number | null;
  usedByCompanyCount: number;
}

export interface AdminVoucher {
  id: number;
  code: string;
  label: string;
  description: string | null;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number;
  startsAt: string | null;
  endsAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  perCompanyLimit: number | null;
  status: VoucherStatus;
  createdAt: string;
}

export interface SaveVoucherInput {
  code: string;
  label: string;
  description?: string | null;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderValue: number;
  startsAt?: string | null;
  endsAt?: string | null;
  usageLimit?: number | null;
  perCompanyLimit?: number | null;
  status: VoucherStatus;
}

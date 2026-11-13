import type { AdminVoucherSearchParams } from '@/apiRequest/voucher';
import type {
  AdminVoucher,
  VoucherAccentColor,
  VoucherDiscountType,
  VoucherPackageSummary,
  VoucherStatus,
} from '@/types/voucher';

export const DEFAULT_VOUCHER_PAGE_SIZE = 10;
export const DEFAULT_VOUCHER_SORT = 'createdAt,desc';

export const VOUCHER_PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
] as const;

export const VOUCHER_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
] as const;

export const VOUCHER_DISCOUNT_TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All discount types' },
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED', label: 'Fixed amount (VND)' },
] as const;

export const VOUCHER_SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest first' },
  { value: 'endsAt,asc', label: 'Expiring soonest' },
  { value: 'usedCount,desc', label: 'Most redeemed' },
  { value: 'code,asc', label: 'Code: A to Z' },
] as const;

export interface VoucherThemeTokens {
  key: VoucherAccentColor;
  label: string;
  swatchHex: string;
  ribbonBgClass: string;
  headlineTextClass: string;
  codePillBgClass: string;
  codePillTextClass: string;
  buttonBgClass: string;
  hoverBorderStyle: string;
  notchStrokeHex: string;
}

export const VOUCHER_ACCENT_THEMES: Record<VoucherAccentColor, VoucherThemeTokens> = {
  EMERALD: {
    key: 'EMERALD',
    label: 'Emerald green',
    swatchHex: '#00b14f',
    ribbonBgClass: 'bg-[#00b14f]',
    headlineTextClass: 'text-[#00b14f]',
    codePillBgClass: 'bg-[#ecfdf3]',
    codePillTextClass: 'text-[#009944]',
    buttonBgClass: 'bg-[#00b14f] hover:bg-[#009b45]',
    hoverBorderStyle: '#00b14f',
    notchStrokeHex: '#00b14f',
  },
  AMBER: {
    key: 'AMBER',
    label: 'Amber orange',
    swatchHex: '#f59e0b',
    ribbonBgClass: 'bg-[#f59e0b]',
    headlineTextClass: 'text-[#f59e0b]',
    codePillBgClass: 'bg-[#fff7ed]',
    codePillTextClass: 'text-[#d97706]',
    buttonBgClass: 'bg-[#f59e0b] hover:bg-[#d97706]',
    hoverBorderStyle: '#f59e0b',
    notchStrokeHex: '#f59e0b',
  },
  ROSE: {
    key: 'ROSE',
    label: 'Coral red',
    swatchHex: '#dc4a38',
    ribbonBgClass: 'bg-[#dc4a38]',
    headlineTextClass: 'text-[#dc4a38]',
    codePillBgClass: 'bg-[#fef2f2]',
    codePillTextClass: 'text-[#dc4a38]',
    buttonBgClass: 'bg-[#dc4a38] hover:bg-[#c53b2a]',
    hoverBorderStyle: '#dc4a38',
    notchStrokeHex: '#dc4a38',
  },
  BLUE: {
    key: 'BLUE',
    label: 'Ocean blue',
    swatchHex: '#1d6feb',
    ribbonBgClass: 'bg-[#1d6feb]',
    headlineTextClass: 'text-[#1d6feb]',
    codePillBgClass: 'bg-[#eff6ff]',
    codePillTextClass: 'text-[#1d6feb]',
    buttonBgClass: 'bg-[#1d6feb] hover:bg-[#175cd3]',
    hoverBorderStyle: '#1d6feb',
    notchStrokeHex: '#1d6feb',
  },
};

export const VOUCHER_ACCENT_OPTIONS = Object.values(VOUCHER_ACCENT_THEMES);

export const adminVoucherKeys = {
  all: ['admin', 'vouchers'] as const,
  list: (params: AdminVoucherSearchParams) => ['admin', 'vouchers', 'list', params] as const,
  detail: (id: number) => ['admin', 'vouchers', 'detail', id] as const,
};

export function getVoucherTheme(accentColor?: VoucherAccentColor | null): VoucherThemeTokens {
  if (accentColor && accentColor in VOUCHER_ACCENT_THEMES) {
    return VOUCHER_ACCENT_THEMES[accentColor];
  }
  return VOUCHER_ACCENT_THEMES.EMERALD;
}

export function getVoucherRibbonText(
  ribbonLabel?: string | null,
  applicablePackages?: VoucherPackageSummary[] | null,
): string {
  const custom = ribbonLabel?.trim();
  if (custom) return custom.toUpperCase();
  if (applicablePackages && applicablePackages.length === 1) {
    return applicablePackages[0].name.toUpperCase();
  }
  if (applicablePackages && applicablePackages.length > 1) {
    return `${applicablePackages.length} PACKAGES`;
  }
  return 'INTERVUE';
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export function formatVoucherDiscount(voucher: {
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscount?: number | null;
}): string {
  if (voucher.discountType === 'PERCENTAGE') {
    return voucher.maxDiscount
      ? `${voucher.discountValue}% off (cap ${formatVnd(voucher.maxDiscount)})`
      : `${voucher.discountValue}% off`;
  }
  return `${formatVnd(voucher.discountValue)} off`;
}

export function formatVoucherWindowDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}

export function formatVietnamDateInput(iso: string | null): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(iso));
}

export function getVoucherScheduleState(
  voucher: Pick<AdminVoucher, 'status' | 'startsAt' | 'endsAt' | 'usedCount' | 'usageLimit'>,
  nowMs: number,
): {
  key: 'active' | 'scheduled' | 'expired' | 'exhausted' | 'inactive';
  label: string;
  pillClass: string;
} {
  if (voucher.status === 'INACTIVE') {
    return {
      key: 'inactive',
      label: 'Inactive',
      pillClass: 'bg-neutral-100 text-neutral-600 dark:bg-forest-850 dark:text-forest-300',
    };
  }
  if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
    return {
      key: 'exhausted',
      label: 'Exhausted',
      pillClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    };
  }
  if (nowMs > 0) {
    if (voucher.endsAt && Date.parse(voucher.endsAt) <= nowMs) {
      return {
        key: 'expired',
        label: 'Expired',
        pillClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      };
    }
    if (voucher.startsAt && Date.parse(voucher.startsAt) > nowMs) {
      return {
        key: 'scheduled',
        label: 'Scheduled',
        pillClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
      };
    }
  }
  return {
    key: 'active',
    label: 'Active',
    pillClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  };
}

// Shared by CartVoucherModal and VoucherConditionsModal so switching between the two never resizes the dialog.
export const VOUCHER_MODAL_SIZE_CLASS = 'min-h-[620px]';

export function subscribeVoucherTick(onStoreChange: () => void): () => void {
  const timer = window.setInterval(onStoreChange, 30_000);
  return () => window.clearInterval(timer);
}

export function getVoucherTickSnapshot(): number {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

export function getVoucherTickServerSnapshot(): number {
  return 0;
}

export function formatVoucherCountdownVi(endsAtIso: string | null, nowMs: number): string | null {
  if (!endsAtIso || nowMs === 0) return null;
  const diffMs = Date.parse(endsAtIso) - nowMs;
  if (!Number.isFinite(diffMs) || diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${days} ngày : ${pad(hours)} giờ : ${pad(minutes)} phút`;
}

export function resolveVoucherDisplayConditions(voucher: {
  conditions?: string[] | null;
  description?: string | null;
  minOrderValue?: number;
  maxDiscount?: number | null;
  perCompanyLimit?: number | null;
  applicablePackages?: VoucherPackageSummary[] | null;
}): string[] {
  const explicit = (voucher.conditions ?? []).map((item) => item.trim()).filter(Boolean);
  if (explicit.length > 0) return explicit;

  const fallback: string[] = [];
  if (voucher.applicablePackages && voucher.applicablePackages.length > 0) {
    fallback.push(`Áp dụng cho: ${voucher.applicablePackages.map((pkg) => pkg.name).join(', ')} (chưa bao gồm VAT)`);
  } else {
    fallback.push('Áp dụng trên giá niêm yết của tất cả gói dịch vụ (chưa bao gồm VAT)');
  }
  if ((voucher.minOrderValue ?? 0) > 0) {
    fallback.push(
      `Áp dụng trên đơn hàng có giá trị tối thiểu ${(voucher.minOrderValue ?? 0).toLocaleString('vi-VN')}đ`,
    );
  }
  if (voucher.maxDiscount) {
    fallback.push(`Mức giảm tối đa ${voucher.maxDiscount.toLocaleString('vi-VN')}đ cho mỗi đơn hàng`);
  }
  if (voucher.perCompanyLimit) {
    fallback.push(`Mỗi doanh nghiệp được áp dụng tối đa ${voucher.perCompanyLimit} lần`);
  }
  if (voucher.description?.trim()) {
    fallback.push(voucher.description.trim());
  }
  return fallback;
}

export function parseVoucherStatusParam(raw: string | null): VoucherStatus | '' {
  if (raw === 'ACTIVE' || raw === 'INACTIVE') return raw;
  return '';
}

export function parseVoucherDiscountTypeParam(raw: string | null): VoucherDiscountType | '' {
  if (raw === 'PERCENTAGE' || raw === 'FIXED') return raw;
  return '';
}

import { formatVietnamDateInput } from '@/lib/admin-vouchers';
import type { AdminVoucher, SaveVoucherInput } from '@/types/voucher';
import { z } from 'zod';

export const VOUCHER_FIELD_LIMITS = {
  code: 40,
  label: 150,
  description: 500,
  ribbonLabel: 40,
  conditionText: 250,
  maxConditions: 10,
} as const;

const conditionItemSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Condition text cannot be blank.')
    .max(
      VOUCHER_FIELD_LIMITS.conditionText,
      `Each condition must be at most ${VOUCHER_FIELD_LIMITS.conditionText} characters.`,
    ),
});

export const saveVoucherSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, 'Voucher code is required.')
      .max(VOUCHER_FIELD_LIMITS.code, `Code must be at most ${VOUCHER_FIELD_LIMITS.code} characters.`)
      .regex(/^[A-Za-z0-9_-]+$/, 'Use letters, digits, hyphens and underscores only.'),
    label: z
      .string()
      .trim()
      .min(1, 'Headline label is required.')
      .max(VOUCHER_FIELD_LIMITS.label, `Label must be at most ${VOUCHER_FIELD_LIMITS.label} characters.`),
    description: z
      .string()
      .trim()
      .max(
        VOUCHER_FIELD_LIMITS.description,
        `Description must be at most ${VOUCHER_FIELD_LIMITS.description} characters.`,
      ),
    ribbonLabel: z
      .string()
      .trim()
      .max(
        VOUCHER_FIELD_LIMITS.ribbonLabel,
        `Ribbon label must be at most ${VOUCHER_FIELD_LIMITS.ribbonLabel} characters.`,
      ),
    accentColor: z.enum(['EMERALD', 'AMBER', 'ROSE', 'BLUE']),
    conditions: z
      .array(conditionItemSchema)
      .max(VOUCHER_FIELD_LIMITS.maxConditions, `At most ${VOUCHER_FIELD_LIMITS.maxConditions} conditions allowed.`),
    applicablePackageIds: z.array(z.number().int().positive()),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z
      .string()
      .trim()
      .min(1, 'Discount value is required.')
      .refine((value) => /^\d+$/.test(value) && Number(value) > 0, 'Must be a positive whole number.'),
    maxDiscount: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || (/^\d+$/.test(value) && Number(value) > 0),
        'Must be a positive whole number.',
      ),
    minOrderValue: z
      .string()
      .trim()
      .min(1, 'Minimum order is required.')
      .refine((value) => /^\d+$/.test(value), 'Must be 0 or greater.'),
    startsAt: z.string().trim(),
    endsAt: z.string().trim(),
    usageLimit: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || (/^\d+$/.test(value) && Number(value) > 0),
        'Must be a positive whole number.',
      ),
    perCompanyLimit: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || (/^\d+$/.test(value) && Number(value) > 0),
        'Must be a positive whole number.',
      ),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  })
  .superRefine((values, ctx) => {
    if (values.discountType === 'PERCENTAGE' && Number(values.discountValue) > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['discountValue'],
        message: 'Percentage discount cannot exceed 100%.',
      });
    }
    if (values.startsAt && values.endsAt && values.endsAt < values.startsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endsAt'],
        message: 'End date must be on or after start date.',
      });
    }
  });

export type SaveVoucherFormData = z.infer<typeof saveVoucherSchema>;

// Date-only input maps to full calendar days in Vietnam timezone (+07:00).
function toVietnamInstant(dateValue: string, endOfDay: boolean): string | null {
  if (!dateValue) return null;
  return new Date(`${dateValue}T${endOfDay ? '23:59:59' : '00:00:00'}+07:00`).toISOString();
}

export function toVoucherFormDefaults(initial?: AdminVoucher): SaveVoucherFormData {
  if (!initial) {
    return {
      code: '',
      label: '',
      description: '',
      ribbonLabel: 'ALL PACKAGES',
      accentColor: 'EMERALD',
      conditions: [
        { text: 'Áp dụng trên giá niêm yết của gói dịch vụ (chưa bao gồm VAT)' },
        { text: 'Mã ưu đãi chỉ được áp dụng 1 lần cho 1 đơn hàng' },
      ],
      applicablePackageIds: [],
      discountType: 'PERCENTAGE',
      discountValue: '15',
      maxDiscount: '',
      minOrderValue: '0',
      startsAt: '',
      endsAt: '',
      usageLimit: '',
      perCompanyLimit: '1',
      status: 'ACTIVE',
    };
  }
  return {
    code: initial.code,
    label: initial.label,
    description: initial.description ?? '',
    ribbonLabel: initial.ribbonLabel ?? '',
    accentColor: initial.accentColor ?? 'EMERALD',
    conditions: initial.conditions.map((text) => ({ text })),
    applicablePackageIds: initial.applicablePackages.map((pkg) => pkg.id),
    discountType: initial.discountType,
    discountValue: String(initial.discountValue),
    maxDiscount: initial.maxDiscount === null ? '' : String(initial.maxDiscount),
    minOrderValue: String(initial.minOrderValue),
    startsAt: formatVietnamDateInput(initial.startsAt),
    endsAt: formatVietnamDateInput(initial.endsAt),
    usageLimit: initial.usageLimit === null ? '' : String(initial.usageLimit),
    perCompanyLimit: initial.perCompanyLimit === null ? '' : String(initial.perCompanyLimit),
    status: initial.status,
  };
}

export function toSaveVoucherPayload(values: SaveVoucherFormData): SaveVoucherInput {
  const seen = new Set<string>();
  const normalizedConditions: string[] = [];
  for (const item of values.conditions) {
    const trimmed = item.text.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      normalizedConditions.push(trimmed);
    }
  }

  return {
    code: values.code.trim().toUpperCase(),
    label: values.label.trim(),
    description: values.description.trim() || null,
    ribbonLabel: values.ribbonLabel.trim().toUpperCase() || null,
    accentColor: values.accentColor,
    conditions: normalizedConditions,
    applicablePackageIds: values.applicablePackageIds,
    discountType: values.discountType,
    discountValue: Number(values.discountValue),
    maxDiscount: values.discountType === 'FIXED' || !values.maxDiscount.trim() ? null : Number(values.maxDiscount),
    minOrderValue: Number(values.minOrderValue),
    startsAt: toVietnamInstant(values.startsAt, false),
    endsAt: toVietnamInstant(values.endsAt, true),
    usageLimit: values.usageLimit.trim() ? Number(values.usageLimit) : null,
    perCompanyLimit: values.perCompanyLimit.trim() ? Number(values.perCompanyLimit) : null,
    status: values.status,
  };
}

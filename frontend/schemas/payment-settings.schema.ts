import type { BillingSettings, SaveBillingSettingsInput } from '@/types/admin-payment';
import { z } from 'zod';

export const BILLING_RULE_LIMITS = {
  vatMin: 0,
  vatMax: 100,
  expireHoursMin: 1,
  expireHoursMax: 720,
  prefixMin: 2,
  prefixMax: 10,
  maxPendingMin: 1,
  maxPendingMax: 20,
  accountNumberMin: 4,
  accountNumberMax: 30,
  accountNameMax: 150,
} as const;

export const VIETINBANK_CODE = 'VietinBank';
export const VIETINBANK_TRANSFER_KEYWORD = 'SEVQR';

const SAMPLE_ORDER_SUFFIX = '8K4M2P9Q';
const SEPAY_QR_BASE_URL = 'https://qr.sepay.vn/img';

function parseBoundedInt(value: string, min: number, max: number): boolean {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return false;
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed >= min && parsed <= max;
}

function parseVatPercent(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < BILLING_RULE_LIMITS.vatMin || parsed > BILLING_RULE_LIMITS.vatMax) {
    return null;
  }
  return parsed;
}

export const paymentSettingsSchema = z
  .object({
    vatPercent: z
      .string()
      .trim()
      .min(1, 'VAT (%) is required')
      .refine((value) => parseVatPercent(value) !== null, 'Enter a percentage from 0 to 100 (up to 2 decimals)'),
    orderExpireHours: z
      .string()
      .trim()
      .min(1, 'Payment window is required')
      .refine(
        (value) => parseBoundedInt(value, BILLING_RULE_LIMITS.expireHoursMin, BILLING_RULE_LIMITS.expireHoursMax),
        `Enter a whole number between ${BILLING_RULE_LIMITS.expireHoursMin} and ${BILLING_RULE_LIMITS.expireHoursMax} hours`,
      ),
    orderCodePrefix: z
      .string()
      .trim()
      .transform((value) => value.toUpperCase())
      .refine(
        (value) => new RegExp(`^[A-Z]{${BILLING_RULE_LIMITS.prefixMin},${BILLING_RULE_LIMITS.prefixMax}}$`).test(value),
        `Use ${BILLING_RULE_LIMITS.prefixMin}–${BILLING_RULE_LIMITS.prefixMax} uppercase letters only (e.g. IVO)`,
      ),
    maxPendingOrders: z
      .string()
      .trim()
      .min(1, 'Max unpaid orders is required')
      .refine(
        (value) => parseBoundedInt(value, BILLING_RULE_LIMITS.maxPendingMin, BILLING_RULE_LIMITS.maxPendingMax),
        `Enter a whole number between ${BILLING_RULE_LIMITS.maxPendingMin} and ${BILLING_RULE_LIMITS.maxPendingMax}`,
      ),
    bankCode: z.string().trim(),
    bankAccountNumber: z
      .string()
      .transform((value) => value.replace(/\s+/g, ''))
      .refine(
        (value) =>
          value === '' ||
          new RegExp(
            `^[A-Za-z0-9]{${BILLING_RULE_LIMITS.accountNumberMin},${BILLING_RULE_LIMITS.accountNumberMax}}$`,
          ).test(value),
        `Use ${BILLING_RULE_LIMITS.accountNumberMin}–${BILLING_RULE_LIMITS.accountNumberMax} letters/digits with no spaces`,
      ),
    bankAccountName: z
      .string()
      .trim()
      .max(
        BILLING_RULE_LIMITS.accountNameMax,
        `Account holder cannot exceed ${BILLING_RULE_LIMITS.accountNameMax} characters`,
      ),
    paymentSyncEnabled: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const hasBank = values.bankCode !== '';
    const hasAccount = values.bankAccountNumber !== '';

    if (hasAccount && !hasBank) {
      ctx.addIssue({
        code: 'custom',
        path: ['bankCode'],
        message: 'Select the bank for this account number',
      });
    }
    if (hasBank && !hasAccount) {
      ctx.addIssue({
        code: 'custom',
        path: ['bankAccountNumber'],
        message: 'Enter the receiving bank account number',
      });
    }
    if (values.paymentSyncEnabled && (!hasBank || !hasAccount)) {
      ctx.addIssue({
        code: 'custom',
        path: ['paymentSyncEnabled'],
        message: 'Configure both Bank and Account number before enabling automatic reconciliation',
      });
    }
  });

export type PaymentSettingsFormData = z.infer<typeof paymentSettingsSchema>;

export function toPaymentSettingsFormDefaults(settings: BillingSettings): PaymentSettingsFormData {
  const vatPercent = Math.round(settings.vatRate * 10000) / 100;
  return {
    vatPercent: String(vatPercent),
    orderExpireHours: String(settings.orderExpireHours),
    orderCodePrefix: settings.orderCodePrefix,
    maxPendingOrders: String(settings.maxPendingOrders),
    bankCode: settings.bankCode ?? '',
    bankAccountNumber: settings.bankAccountNumber ?? '',
    bankAccountName: settings.bankAccountName ?? '',
    paymentSyncEnabled: settings.paymentSyncEnabled,
  };
}

export function toSaveBillingSettingsPayload(data: PaymentSettingsFormData): SaveBillingSettingsInput {
  const vatPercent = Number(data.vatPercent.trim());
  const vatRate = Math.round((vatPercent / 100) * 10000) / 10000;
  const cleanBankCode = data.bankCode.trim() || null;
  const cleanAccountNumber = data.bankAccountNumber.replace(/\s+/g, '') || null;
  const cleanAccountName = data.bankAccountName.trim() || null;

  return {
    vatRate,
    orderExpireHours: Number(data.orderExpireHours.trim()),
    orderCodePrefix: data.orderCodePrefix.trim().toUpperCase(),
    maxPendingOrders: Number(data.maxPendingOrders.trim()),
    bankCode: cleanBankCode,
    bankAccountNumber: cleanAccountNumber,
    bankAccountName: cleanAccountName,
    paymentSyncEnabled: data.paymentSyncEnabled,
  };
}

export function formatSampleOrderCode(prefix: string): string {
  const cleanPrefix =
    prefix
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '') || 'IVO';
  return `${cleanPrefix}${SAMPLE_ORDER_SUFFIX}`;
}

export function resolveTransferKeyword(bankCode: string, contentKeyword?: string | null): string {
  const trimmed = contentKeyword?.trim();
  if (trimmed) return trimmed;
  return bankCode.trim() === VIETINBANK_CODE ? VIETINBANK_TRANSFER_KEYWORD : '';
}

export function formatSampleTransferContent(bankCode: string, prefix: string, contentKeyword?: string | null): string {
  const sampleOrder = formatSampleOrderCode(prefix);
  const keyword = resolveTransferKeyword(bankCode, contentKeyword);
  return keyword ? `${keyword} ${sampleOrder}` : sampleOrder;
}

export function buildSepayPreviewQrUrl(params: {
  bankCode: string;
  bankAccountNumber: string;
  amount: number;
  transferContent: string;
}): string | null {
  const cleanBank = params.bankCode.trim();
  const cleanAccount = params.bankAccountNumber.replace(/\s+/g, '');
  if (!cleanBank || !cleanAccount) return null;

  const query = new URLSearchParams({
    acc: cleanAccount,
    bank: cleanBank,
    amount: String(Math.max(0, Math.round(params.amount))),
    des: params.transferContent,
  });
  return `${SEPAY_QR_BASE_URL}?${query.toString()}`;
}

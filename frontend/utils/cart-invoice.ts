import type { BusinessInvoiceInfo } from '@/types/recruiter-cart';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAX_ID_PATTERN = /^[0-9-]{8,20}$/;

export function isValidInvoiceEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidTaxId(value: string): boolean {
  return TAX_ID_PATTERN.test(value.trim());
}

export function isBusinessInvoiceComplete(info: BusinessInvoiceInfo): boolean {
  return (
    isValidTaxId(info.taxId) &&
    info.companyName.trim().length > 0 &&
    info.companyAddress.trim().length > 0 &&
    isValidInvoiceEmail(info.recipientEmail)
  );
}

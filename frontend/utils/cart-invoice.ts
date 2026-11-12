import type { BusinessInvoiceInfo, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAX_ID_PATTERN = /^[0-9-]{8,20}$/;
const CCCD_PATTERN = /^\d{12}$/;
const PASSPORT_PATTERN = /^[A-Za-z0-9]{6,20}$/;

export function isValidInvoiceEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidTaxId(value: string): boolean {
  return TAX_ID_PATTERN.test(value.trim());
}

export function isValidPersonalDocumentNumber(docType: 'cccd' | 'passport', value: string): boolean {
  const trimmed = value.trim();
  return docType === 'passport' ? PASSPORT_PATTERN.test(trimmed) : CCCD_PATTERN.test(trimmed);
}

export function isBusinessInvoiceComplete(info: BusinessInvoiceInfo): boolean {
  return (
    isValidTaxId(info.taxId) &&
    info.companyName.trim().length > 0 &&
    info.companyAddress.trim().length > 0 &&
    isValidInvoiceEmail(info.recipientEmail)
  );
}

export function isPersonalInvoiceComplete(info: PersonalInvoiceInfo): boolean {
  const docType = info.personalDocumentType ?? 'cccd';
  return (
    isValidPersonalDocumentNumber(docType, info.taxOrIdentityNumber) &&
    info.fullName.trim().length > 0 &&
    info.personalAddress.trim().length > 0 &&
    isValidInvoiceEmail(info.recipientEmail)
  );
}

export function isInvoiceInfoComplete(
  invoiceType: InvoiceType | null,
  businessInvoice: BusinessInvoiceInfo,
  personalInvoice: PersonalInvoiceInfo,
): boolean {
  if (invoiceType === 'business') {
    return isBusinessInvoiceComplete(businessInvoice);
  }
  if (invoiceType === 'personal') {
    return isPersonalInvoiceComplete(personalInvoice);
  }
  return false;
}

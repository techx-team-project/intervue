export interface RecruiterCartItem {
  id: number;
  packageId: number;
  code: string;
  slug: string;
  name: string;
  description: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  lineTotal: number;
  validityDays: number | null;
  oneTimePerCompany: boolean;
  selected?: boolean;
}

export interface RecruiterCart {
  items: RecruiterCartItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
}

export type InvoiceType = 'business' | 'personal';

export interface BusinessInvoiceInfo {
  taxId: string;
  companyName: string;
  companyAddress: string;
  recipientEmail: string;
}

export interface PersonalInvoiceInfo {
  fullName: string;
  taxOrIdentityNumber: string;
  personalAddress: string;
  recipientEmail: string;
}

export interface DiscountVoucher {
  code: string;
  label: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  description: string;
}

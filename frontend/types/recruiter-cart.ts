export interface RecruiterCartItem {
  id: string;
  code: string;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  selected?: boolean;
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

export interface CartCreatedOrder {
  orderId: string;
  orderCode: string;
  createdAt: string;
  expiresAt: string;
  items: RecruiterCartItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  subtotalAfterDiscount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  invoiceType: InvoiceType;
  invoiceData: BusinessInvoiceInfo | PersonalInvoiceInfo;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    transferSyntax: string;
  };
}

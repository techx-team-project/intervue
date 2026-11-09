import type { ServicePackageBenefit } from '@/types/service-package';

export type RecruiterOrderStatus =
  'PENDING_PAYMENT' | 'UNDERPAID' | 'PAID' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED' | 'REFUND_REQUESTED' | 'REFUNDED';

export interface RecruiterOrderItem {
  id: number;
  packageId: number | null;
  packageCode: string;
  packageName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  validityDays: number | null;
  bonusCredits: number;
  benefits: ServicePackageBenefit[];
}

export interface RecruiterOrderInvoice {
  invoiceType: 'BUSINESS' | 'PERSONAL';
  taxId: string | null;
  companyName: string | null;
  companyAddress: string | null;
  fullName: string | null;
  identityNumber: string | null;
  personalAddress: string | null;
  recipientEmail: string;
}

export interface RecruiterOrder {
  id: number;
  code: string;
  status: RecruiterOrderStatus;
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  expiresAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  items: RecruiterOrderItem[];
  invoice: RecruiterOrderInvoice | null;
}

export interface RecruiterOrderSummary {
  id: number;
  code: string;
  status: RecruiterOrderStatus;
  totalAmount: number;
  currency: string;
  itemCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface CheckoutPayload {
  packageId?: number;
  quantity?: number;
  cartItemIds?: number[];
  invoiceType: 'BUSINESS' | 'PERSONAL';
  taxId?: string;
  companyName?: string;
  companyAddress?: string;
  fullName?: string;
  identityNumber?: string;
  personalAddress?: string;
  recipientEmail: string;
  termsAccepted: boolean;
}

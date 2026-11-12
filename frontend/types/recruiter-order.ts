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
  bookedWeeks: string[];
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

export interface OrderStatusCounts {
  total: number;
  byStatus: Record<RecruiterOrderStatus, number>;
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
  voucherCode?: string;
  termsAccepted: boolean;
}

export interface OrderPayment {
  orderCode: string;
  status: RecruiterOrderStatus;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  expiresAt: string;
  configured: boolean;
  bankCode: string | null;
  accountNumber: string | null;
  accountName: string | null;
  transferContent: string;
  qrUrl: string | null;
}

export interface OrderInvoice {
  id: number;
  number: string;
  orderCode: string;
  issuedAt: string;
  invoiceType: 'BUSINESS' | 'PERSONAL';
  buyerName: string;
  buyerTaxId: string | null;
  recipientEmail: string;
  subtotal: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
}

export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RefundQuote {
  orderCode: string;
  orderTotal: number;
  refundableAmount: number;
  requestable: boolean;
  existingStatus: RefundStatus | null;
}

export type PaymentTransactionStatus = 'MATCHED' | 'UNMATCHED';

export interface RecruiterPaymentTransaction {
  id: number;
  sepayId: string;
  gateway: string | null;
  accountNumber: string | null;
  content: string | null;
  amountIn: number;
  referenceCode: string | null;
  transactionAt: string;
  status: PaymentTransactionStatus;
  matchedOrderCode: string | null;
  note: string | null;
}

export interface OrderRefundRequest {
  id: number;
  orderCode: string;
  companyId: number;
  reason: string;
  status: RefundStatus;
  orderTotal: number;
  refundableAmount: number;
  approvedAmount: number | null;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

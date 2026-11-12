export type PaymentTransactionStatus = 'MATCHED' | 'UNMATCHED';

export interface BillingSettings {
  vatRate: number;
  orderExpireHours: number;
  orderCodePrefix: string;
  maxPendingOrders: number;
  bankCode: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  paymentSyncEnabled: boolean;
  paymentSyncSince: string | null;
  apiTokenConfigured: boolean;
}

export interface SupportedBank {
  code: string;
  name: string;
  contentKeyword?: string | null;
}

export interface SaveBillingSettingsInput {
  vatRate: number;
  orderExpireHours: number;
  orderCodePrefix: string;
  maxPendingOrders: number;
  bankCode?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  paymentSyncEnabled: boolean;
}

export interface PaymentTransaction {
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

export interface PaymentSyncResult {
  at: string;
  ok: boolean;
  message: string;
  fetched: number;
  created: number;
  matched: number;
}

export interface AdminInvoice {
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

export type AdminRefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminRefundRequest {
  id: number;
  orderCode: string;
  companyId: number;
  reason: string;
  status: AdminRefundStatus;
  orderTotal: number;
  refundableAmount: number;
  approvedAmount: number | null;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export type AdminOrderStatus =
  'PENDING_PAYMENT' | 'UNDERPAID' | 'PAID' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED' | 'REFUND_REQUESTED' | 'REFUNDED';

export interface AdminOrderItem {
  id: number;
  packageName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  bookedWeeks: string[];
}

export interface AdminOrder {
  id: number;
  code: string;
  status: AdminOrderStatus;
  companyId: number;
  companyName: string | null;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  invoiceNumber: string | null;
  expiresAt: string;
  paidAt: string | null;
  createdAt: string;
  manualRefundResolvedAt: string | null;
  items: AdminOrderItem[];
}

export interface RevenueReport {
  collectedTotal: number;
  refundedTotal: number;
  netTotal: number;
  pendingTotal: number;
  paidOrderCount: number;
  ordersByStatus: Partial<Record<AdminOrderStatus, number>>;
  byMonth: Array<{ month: string; collected: number; orderCount: number }>;
  byPackage: Array<{ packageName: string; quantity: number; collected: number }>;
}

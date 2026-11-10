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

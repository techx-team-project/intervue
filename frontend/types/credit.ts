import type { EntitlementType } from '@/types/service-package';

export interface CreditPrice {
  id: number;
  entitlementType: EntitlementType;
  tier: number;
  creditCost: number;
  durationDays: number | null;
  label: string;
  active: boolean;
  displayOrder: number;
}

export interface CreditWallet {
  balance: number;
  nearestExpiryAt: string | null;
  prices: CreditPrice[];
}

export interface CreditLedgerEntry {
  credit: boolean;
  quantity: number;
  label: string;
  at: string;
}

export interface ConvertCreditsInput {
  entitlementType: EntitlementType;
  tier: number;
  quantity: number;
}

export interface SaveCreditPriceInput {
  creditCost: number;
  durationDays: number | null;
  label: string;
  active: boolean;
  displayOrder: number;
}

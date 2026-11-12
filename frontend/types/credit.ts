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

export interface CreateCreditPriceInput extends SaveCreditPriceInput {
  entitlementType: EntitlementType;
  tier: number;
}

export interface FreeQuotaSettings {
  aiResumeMatchFreePerMonth: number;
  aiJdGenerateFreePerMonth: number;
  cvReviewFreePerDay: number;
  candidateStarterCredits: number;
  connectDailyInviteLimit: number;
  companyFreePhotoLimit: number;
  requireJobSlot: boolean;
  jobFreeActiveLimit: number;
  jobFreeMaxDays: number;
  jobReviewFirstCount: number;
  updatedAt: string | null;
}

export type SaveFreeQuotaSettingsInput = Omit<FreeQuotaSettings, 'updatedAt'>;

export type EntitlementStatus = 'AVAILABLE' | 'CONSUMED' | 'EXPIRED' | 'REVOKED';

export interface AdminCompanyCreditSummary {
  companyId: number;
  companyName: string;
  taxCode: string | null;
  address: string | null;
  availableBalance: number;
  lifetimeGranted: number;
  lifetimeSpent: number;
  expiredBalance: number;
  nearestExpiryAt: string | null;
}

export interface AdminCompanyCreditLot {
  id: number;
  sourceOrderItemId: number | null;
  label: string;
  totalQuantity: number;
  remainingQuantity: number;
  bonus: boolean;
  status: EntitlementStatus;
  activationDeadline: string | null;
  createdAt: string;
}

export interface AdminCompanyCreditDetail extends AdminCompanyCreditSummary {
  lots: AdminCompanyCreditLot[];
}

export interface AdjustCompanyCreditsInput {
  amount: number;
  reason: string;
  validityDays?: number | null;
}

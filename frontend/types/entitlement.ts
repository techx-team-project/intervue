import type { EntitlementType } from '@/types/service-package';

export type EntitlementStatus = 'AVAILABLE' | 'CONSUMED' | 'EXPIRED';
export type EntitlementUsageStatus = 'ACTIVE' | 'ENDED';

export interface Entitlement {
  id: number;
  entitlementType: EntitlementType;
  label: string;
  totalQuantity: number;
  remainingQuantity: number;
  durationDays: number | null;
  status: EntitlementStatus;
  activationDeadline: string;
  purchasedByRecruiterId: number | null;
  activatable: boolean;
  purchasedAt: string;
}

export interface EntitlementUsage {
  id: number;
  entitlementType: EntitlementType;
  label: string;
  jobId: number | null;
  quantity: number;
  startedAt: string;
  endsAt: string | null;
  status: EntitlementUsageStatus;
}

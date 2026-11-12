import { ENTITLEMENT_TYPE_OPTIONS } from '@/constants/service-package';
import { DURATION_REQUIRED_ENTITLEMENT_TYPES } from '@/schemas/service-package.schema';
import type { CreditPrice, SaveCreditPriceInput } from '@/types/credit';
import type { EntitlementType } from '@/types/service-package';

export const MAX_CREDIT_DURATION_DAYS = 3650;
export const MAX_CREDIT_COST = 1_000_000;

export const CREDIT_PRICE_PAGE_SIZE_OPTIONS = [
  { value: '5', label: '5 / page' },
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
];

export const CONVERTIBLE_CREDIT_TYPE_OPTIONS = ENTITLEMENT_TYPE_OPTIONS.filter(
  (option) => option.value !== 'CREDIT' && option.value !== 'AD_SLOT_WEEK',
);

const ENTITLEMENT_LABEL_MAP = new Map<EntitlementType, string>(
  ENTITLEMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

const ALL_CONVERTIBLE_PAIRS: { entitlementType: EntitlementType; tier: number }[] =
  CONVERTIBLE_CREDIT_TYPE_OPTIONS.flatMap((option) =>
    option.value === 'JOB_BOOST'
      ? [1, 2, 3].map((tier) => ({ entitlementType: option.value, tier }))
      : [{ entitlementType: option.value, tier: 1 }],
  );

export type CreditPriceStatusFilter = 'all' | 'active' | 'inactive';
export type CreditPriceDurationFilter = 'all' | 'time_boxed' | 'per_use';

export interface CreditPriceFilters {
  search: string;
  status: CreditPriceStatusFilter;
  durationMode: CreditPriceDurationFilter;
}

export const EMPTY_CREDIT_PRICE_FILTERS: CreditPriceFilters = {
  search: '',
  status: 'all',
  durationMode: 'all',
};

export interface CreditPriceDraft {
  creditCost: string;
  durationDays: string;
  label: string;
  active: boolean;
  displayOrder: string;
}

export interface CreateCreditPriceDraft extends CreditPriceDraft {
  entitlementType: EntitlementType;
  tier: string;
}

export type CreditPriceFieldErrors = Partial<Record<keyof CreditPriceDraft, string>>;

export function hasActiveCreditPriceFilters(filters: CreditPriceFilters): boolean {
  return Boolean(filters.search.trim() || filters.status !== 'all' || filters.durationMode !== 'all');
}

export function isTimeBoxedEntitlement(type: EntitlementType): boolean {
  return DURATION_REQUIRED_ENTITLEMENT_TYPES.has(type);
}

export function getEntitlementTypeLabel(type: EntitlementType): string {
  return ENTITLEMENT_LABEL_MAP.get(type) ?? type;
}

export function getCreditTierMeta(
  type: EntitlementType,
  tier: number,
): { isBoost: boolean; label: string; pillClass: string } {
  if (type === 'JOB_BOOST') {
    const levelLabel = tier === 3 ? 'Highest' : tier === 2 ? 'High' : 'Priority';
    return {
      isBoost: true,
      label: `Tier ${tier} · ${levelLabel}`,
      pillClass:
        tier === 3
          ? 'border border-amber-200/90 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300'
          : tier === 2
            ? 'border border-sky-200/90 bg-sky-50 text-sky-800 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300'
            : 'border border-teal-200/90 bg-teal-50 text-teal-800 dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300',
    };
  }
  return {
    isBoost: false,
    label: '—',
    pillClass: '',
  };
}

export function creditPairKey(entitlementType: EntitlementType, tier: number): string {
  return `${entitlementType}:${tier}`;
}

export function getAvailableCreditPairs(prices: CreditPrice[]): {
  configuredKeys: Set<string>;
  nextAvailable: { entitlementType: EntitlementType; tier: number } | null;
} {
  const configuredKeys = new Set(prices.map((item) => creditPairKey(item.entitlementType, item.tier)));
  const nextAvailable =
    ALL_CONVERTIBLE_PAIRS.find((pair) => !configuredKeys.has(creditPairKey(pair.entitlementType, pair.tier))) ?? null;
  return { configuredKeys, nextAvailable };
}

export function toCreditPriceDraft(price: CreditPrice): CreditPriceDraft {
  return {
    creditCost: String(price.creditCost),
    durationDays: price.durationDays === null ? '' : String(price.durationDays),
    label: price.label,
    active: price.active,
    displayOrder: String(price.displayOrder),
  };
}

export function createEmptyCreditPriceDraft(
  displayOrder: number,
  seed?: { entitlementType: EntitlementType; tier: number } | null,
): CreateCreditPriceDraft {
  const entitlementType = seed?.entitlementType ?? 'JOB_POST_SLOT';
  const tier = String(seed?.tier ?? 1);
  return {
    entitlementType,
    tier,
    creditCost: '100',
    durationDays: isTimeBoxedEntitlement(entitlementType) ? '30' : '',
    label: '',
    active: true,
    displayOrder: String(displayOrder),
  };
}

export function isCreditPriceDraftDirty(price: CreditPrice, draft: CreditPriceDraft | undefined): boolean {
  if (!draft) return false;
  const baseline = toCreditPriceDraft(price);
  return (
    draft.creditCost.trim() !== baseline.creditCost ||
    draft.durationDays.trim() !== baseline.durationDays ||
    draft.label.trim() !== baseline.label.trim() ||
    draft.active !== baseline.active ||
    draft.displayOrder.trim() !== baseline.displayOrder
  );
}

export function sortCreditPrices(prices: CreditPrice[]): CreditPrice[] {
  return [...prices].sort((left, right) => left.displayOrder - right.displayOrder || left.id - right.id);
}

export function filterAndSortCreditPrices(prices: CreditPrice[], filters: CreditPriceFilters): CreditPrice[] {
  const keyword = filters.search.trim().toLowerCase();

  return sortCreditPrices(prices).filter((item) => {
    if (filters.status === 'active' && !item.active) return false;
    if (filters.status === 'inactive' && item.active) return false;

    const timeBoxed = isTimeBoxedEntitlement(item.entitlementType);
    if (filters.durationMode === 'time_boxed' && !timeBoxed) return false;
    if (filters.durationMode === 'per_use' && timeBoxed) return false;

    if (!keyword) return true;
    const readableName = getEntitlementTypeLabel(item.entitlementType).toLowerCase();
    return (
      item.entitlementType.toLowerCase().includes(keyword) ||
      readableName.includes(keyword) ||
      item.label.toLowerCase().includes(keyword)
    );
  });
}

export function formatRecruiterCreditPreview(label: string, creditCost: string): string {
  const cleanLabel = label.trim() || 'No label yet';
  const parsedCost = Number(creditCost);
  const formattedCost = Number.isInteger(parsedCost) && parsedCost > 0 ? parsedCost.toLocaleString('vi-VN') : '—';
  return `${cleanLabel} — ${formattedCost} credits`;
}

export function validateCreditPriceDraft(
  entitlementType: EntitlementType,
  draft: CreditPriceDraft,
):
  | { payload: SaveCreditPriceInput; fieldErrors: CreditPriceFieldErrors }
  | { payload: null; fieldErrors: CreditPriceFieldErrors } {
  const fieldErrors: CreditPriceFieldErrors = {};

  const parsedCost = Number(draft.creditCost.trim());
  if (!draft.creditCost.trim() || !Number.isInteger(parsedCost) || parsedCost < 1) {
    fieldErrors.creditCost = 'Must be ≥ 1';
  } else if (parsedCost > MAX_CREDIT_COST) {
    fieldErrors.creditCost = `Max ${MAX_CREDIT_COST.toLocaleString('en-US')}`;
  }

  const trimmedDuration = draft.durationDays.trim();
  const timeBoxed = isTimeBoxedEntitlement(entitlementType);
  let durationDays: number | null = null;
  if (timeBoxed && !trimmedDuration) {
    fieldErrors.durationDays = 'Required';
  } else if (timeBoxed && trimmedDuration) {
    const parsedDuration = Number(trimmedDuration);
    if (!Number.isInteger(parsedDuration) || parsedDuration < 1 || parsedDuration > MAX_CREDIT_DURATION_DAYS) {
      fieldErrors.durationDays = `1–${MAX_CREDIT_DURATION_DAYS}`;
    } else {
      durationDays = parsedDuration;
    }
  }

  const cleanLabel = draft.label.trim();
  if (!cleanLabel) {
    fieldErrors.label = 'Recruiter-facing label is required.';
  } else if (cleanLabel.length > 255) {
    fieldErrors.label = 'Maximum 255 characters.';
  }

  const parsedOrder = Number(draft.displayOrder.trim());
  if (draft.displayOrder.trim() === '' || !Number.isInteger(parsedOrder) || parsedOrder < 0) {
    fieldErrors.displayOrder = '≥ 0';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { payload: null, fieldErrors };
  }

  return {
    payload: {
      creditCost: parsedCost,
      durationDays,
      label: cleanLabel,
      active: draft.active,
      displayOrder: parsedOrder,
    },
    fieldErrors: {},
  };
}

import type { AdCreativeStatus, AdSlot } from '@/types/ads';

export type AdSlotPlacement = 'HOME' | 'JOBS';
export type AdSlotSaleFilter = '' | 'ACTIVE' | 'PAUSED';
export type AdSlotSort = 'displayOrder,asc' | 'pricePerWeek,asc' | 'pricePerWeek,desc' | 'code,asc';

export const DEFAULT_AD_SLOT_PAGE_SIZE = 10;
export const DEFAULT_AD_SLOT_SORT: AdSlotSort = 'displayOrder,asc';
export const DEFAULT_AD_CREATIVE_PAGE_SIZE = 10;

export const adminAdKeys = {
  all: ['admin', 'ads'] as const,
  slots: () => [...adminAdKeys.all, 'slots'] as const,
  creatives: (params: { status: AdCreativeStatus | ''; page: number; size: number }) =>
    [...adminAdKeys.all, 'creatives', params] as const,
};

export const AD_SLOT_PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
] as const;

export const AD_CREATIVE_PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
] as const;

export const AD_PLACEMENT_FILTER_OPTIONS = [
  { value: '', label: 'All placements' },
  { value: 'HOME', label: 'Homepage (HOME)' },
  { value: 'JOBS', label: 'Jobs directory (JOBS)' },
] as const;

export const AD_PLACEMENT_FORM_OPTIONS = [
  { value: 'HOME', label: 'HOME — Homepage' },
  { value: 'JOBS', label: 'JOBS — Jobs directory' },
] as const;

export const AD_SLOT_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'On sale' },
  { value: 'PAUSED', label: 'Paused' },
] as const;

export const AD_SLOT_SORT_OPTIONS: { value: AdSlotSort; label: string }[] = [
  { value: 'displayOrder,asc', label: 'Display order' },
  { value: 'pricePerWeek,asc', label: 'Price: low to high' },
  { value: 'pricePerWeek,desc', label: 'Price: high to low' },
  { value: 'code,asc', label: 'Code: A to Z' },
];

export const AD_PLACEMENT_META: Record<
  AdSlotPlacement,
  {
    code: AdSlotPlacement;
    label: string;
    shortLabel: string;
    pillClass: string;
  }
> = {
  HOME: {
    code: 'HOME',
    label: 'Homepage banner',
    shortLabel: 'Homepage',
    pillClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
  },
  JOBS: {
    code: 'JOBS',
    label: 'Jobs directory banner',
    shortLabel: 'Jobs',
    pillClass: 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200',
  },
};

export const AD_CREATIVE_STATUS_META: Record<
  AdCreativeStatus,
  {
    label: string;
    pillClass: string;
    tabLabel: string;
  }
> = {
  PENDING: {
    label: 'Pending review',
    tabLabel: 'Pending review',
    pillClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
  },
  APPROVED: {
    label: 'Approved',
    tabLabel: 'Approved',
    pillClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
  },
  REJECTED: {
    label: 'Rejected',
    tabLabel: 'Rejected',
    pillClass: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200',
  },
};

export const AD_CREATIVE_STATUS_TABS: { value: AdCreativeStatus | ''; label: string }[] = [
  { value: '', label: 'All artwork' },
  { value: 'PENDING', label: 'Pending review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const AD_CREATIVE_REJECTION_PRESETS = [
  'Image resolution or aspect ratio does not look crisp at this placement size',
  'Text or call-to-action on the banner is blurry or difficult to read',
  'Destination link does not open or points to an unrelated page',
  'Artwork contains misleading claims or policy-restricted content',
] as const;

export function parseAdPlacementParam(value: string | null): AdSlotPlacement | '' {
  if (value === 'HOME' || value === 'JOBS') return value;
  return '';
}

export function parseAdSlotSaleParam(value: string | null): AdSlotSaleFilter {
  if (value === 'ACTIVE' || value === 'PAUSED') return value;
  return '';
}

export function parseAdSlotSortParam(value: string | null): AdSlotSort {
  if (
    value === 'displayOrder,asc' ||
    value === 'pricePerWeek,asc' ||
    value === 'pricePerWeek,desc' ||
    value === 'code,asc'
  ) {
    return value;
  }
  return DEFAULT_AD_SLOT_SORT;
}

export function parseAdCreativeStatusParam(value: string | null): AdCreativeStatus | '' {
  if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
    return value;
  }
  return '';
}

export function getAdPlacementMeta(placement: string) {
  return placement === 'JOBS' ? AD_PLACEMENT_META.JOBS : AD_PLACEMENT_META.HOME;
}

export function formatAdDimensions(width?: number | null, height?: number | null): string {
  if (!width || !height) return '—';
  return `${width} × ${height} px`;
}

export function formatIsoWeekRange(weekStart?: string | null, weekEnd?: string | null): string {
  if (!weekStart && !weekEnd) return '—';
  const formatPart = (raw?: string | null) => {
    if (!raw) return '—';
    const parsed = new Date(`${raw}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return raw;
    return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  return `${formatPart(weekStart)} → ${formatPart(weekEnd)}`;
}

export function formatAdDateTime(iso: string | null): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function filterAndSortAdSlots(
  slots: AdSlot[],
  filters: {
    query: string;
    placement: AdSlotPlacement | '';
    status: AdSlotSaleFilter;
    sort: AdSlotSort;
  },
): AdSlot[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  const filtered = slots.filter((slot) => {
    if (filters.placement && slot.placement !== filters.placement) return false;
    if (filters.status === 'ACTIVE' && !slot.active) return false;
    if (filters.status === 'PAUSED' && slot.active) return false;
    if (!normalizedQuery) return true;

    const haystack = [slot.code, slot.name, slot.description ?? '', slot.packageSlug ?? '', slot.placement]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case 'pricePerWeek,asc':
        return left.pricePerWeek - right.pricePerWeek || left.displayOrder - right.displayOrder;
      case 'pricePerWeek,desc':
        return right.pricePerWeek - left.pricePerWeek || left.displayOrder - right.displayOrder;
      case 'code,asc':
        return left.code.localeCompare(right.code);
      case 'displayOrder,asc':
      default:
        return left.displayOrder - right.displayOrder || left.id - right.id;
    }
  });
}

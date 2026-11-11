import type { AdminServicePackageSearchParams } from '@/apiRequest/admin-service-package';
import type { AdminServiceCategory, AdminServicePackage, ServicePackageStatus } from '@/types/admin-service-package';

export const DEFAULT_PACKAGE_PAGE_SIZE = 20;
export const DEFAULT_PACKAGE_SORT = 'displayOrder,asc';

export const adminServicePackageKeys = {
  all: ['admin', 'service-packages'] as const,
  list: (params: AdminServicePackageSearchParams) => ['admin', 'service-packages', 'list', params] as const,
  detail: (id: number) => ['admin', 'service-packages', 'detail', id] as const,
  categories: ['admin', 'service-categories'] as const,
};

export const PACKAGE_SORT_OPTIONS = [
  { value: 'displayOrder,asc', label: 'Display order: low to high' },
  { value: 'price,desc', label: 'Price: high to low' },
  { value: 'price,asc', label: 'Price: low to high' },
  { value: 'name,asc', label: 'Name: A to Z' },
] as const;

export const PACKAGE_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'INACTIVE', label: 'Inactive' },
] as const;

export const PACKAGE_PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
] as const;

export type PackageVisibilityState = 'visible' | 'category_hidden' | 'draft' | 'inactive';

export const PACKAGE_VISIBILITY_META: Record<
  PackageVisibilityState,
  {
    label: string;
    pillClass: string;
    textClass: string;
    tooltip: string;
  }
> = {
  visible: {
    label: 'Active',
    pillClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    tooltip: 'Visible on the recruiter buy-services catalog.',
  },
  category_hidden: {
    label: 'Category hidden',
    pillClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    textClass: 'text-amber-700 dark:text-amber-400',
    tooltip: 'Package is Active, but its parent category is hidden from recruiters.',
  },
  draft: {
    label: 'Draft',
    pillClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    textClass: 'text-amber-700 dark:text-amber-300',
    tooltip: 'Not yet published to recruiters.',
  },
  inactive: {
    label: 'Inactive',
    pillClass: 'bg-neutral-100 text-neutral-600 dark:bg-forest-850 dark:text-forest-300',
    textClass: 'text-on-surface-variant dark:text-forest-400',
    tooltip: 'Paused and hidden from the recruiter catalog.',
  },
};

export function getPackageVisibilityState(
  pkg: Pick<AdminServicePackage, 'status'>,
  category?: Pick<AdminServiceCategory, 'isActive'>,
): PackageVisibilityState {
  if (pkg.status === 'DRAFT') return 'draft';
  if (pkg.status === 'INACTIVE') return 'inactive';
  if (category && !category.isActive) return 'category_hidden';
  return 'visible';
}

export function isPackageVisibleToRecruiters(
  pkg: Pick<AdminServicePackage, 'status'>,
  category?: Pick<AdminServiceCategory, 'isActive'>,
): boolean {
  return pkg.status === 'ACTIVE' && (category ? category.isActive : true);
}

export function formatPackagePrice(price: number, currency: string): string {
  return `${new Intl.NumberFormat('en-US').format(price)} ${currency}`;
}

export function parsePackageStatusParam(raw: string | null): ServicePackageStatus | '' {
  if (raw === 'ACTIVE' || raw === 'DRAFT' || raw === 'INACTIVE') return raw;
  return '';
}

export function parsePositiveIntParam(raw: string | null): number | undefined {
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const parsed = Number(raw);
  return parsed > 0 ? parsed : undefined;
}

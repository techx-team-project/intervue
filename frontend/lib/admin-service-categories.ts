import { SERVICE_NEED_ADMIN_META, SERVICE_NEED_ADMIN_SELECT_OPTIONS } from '@/constants/service-package';
import type { AdminServiceCategory, SaveServiceCategoryInput } from '@/types/admin-service-package';
import type { ServiceNeedKey } from '@/types/service-package';

export type CategoryStatusFilter = 'all' | 'active' | 'hidden';
export type CategoryNeedFilter = 'all' | 'unassigned' | ServiceNeedKey;

export interface AdminCategoryFilters {
  search: string;
  status: CategoryStatusFilter;
  needKey: CategoryNeedFilter;
}

export const EMPTY_CATEGORY_FILTERS: AdminCategoryFilters = {
  search: '',
  status: 'all',
  needKey: 'all',
};

export function hasActiveCategoryFilters(filters: AdminCategoryFilters): boolean {
  return filters.search.trim().length > 0 || filters.status !== 'all' || filters.needKey !== 'all';
}

export function isKnownServiceNeedKey(value: string | null | undefined): value is ServiceNeedKey {
  return Boolean(value && value in SERVICE_NEED_ADMIN_META);
}

export function getNeedKeySelectOptions(currentValue?: string | null): { value: string; label: string }[] {
  const normalized = currentValue?.trim().toUpperCase();
  if (!normalized || isKnownServiceNeedKey(normalized)) {
    return SERVICE_NEED_ADMIN_SELECT_OPTIONS;
  }
  return [...SERVICE_NEED_ADMIN_SELECT_OPTIONS, { value: normalized, label: `${normalized} (Custom)` }];
}

export function toCategoryPayload(
  category: AdminServiceCategory,
  overrides: Partial<SaveServiceCategoryInput> = {},
): SaveServiceCategoryInput {
  return {
    code: overrides.code ?? category.code,
    name: overrides.name ?? category.name,
    headline: overrides.headline ?? category.headline,
    description: overrides.description !== undefined ? overrides.description : category.description,
    needKey: overrides.needKey !== undefined ? overrides.needKey : category.needKey,
    displayOrder: overrides.displayOrder ?? category.displayOrder,
    isActive: overrides.isActive ?? category.isActive,
  };
}

export function getNextDisplayOrder(categories: AdminServiceCategory[]): number {
  if (categories.length === 0) return 1;
  return Math.max(...categories.map((category) => category.displayOrder)) + 1;
}

export function getSharedActiveNeedMap(categories: AdminServiceCategory[]): Map<string, AdminServiceCategory[]> {
  const byNeed = new Map<string, AdminServiceCategory[]>();
  const orderedActive = categories
    .filter((category) => category.isActive && Boolean(category.needKey))
    .sort((left, right) => left.displayOrder - right.displayOrder || left.id - right.id);

  for (const category of orderedActive) {
    if (!category.needKey) continue;
    const list = byNeed.get(category.needKey) ?? [];
    list.push(category);
    byNeed.set(category.needKey, list);
  }
  return byNeed;
}

export function filterAndSortCategories(
  categories: AdminServiceCategory[],
  filters: AdminCategoryFilters,
): AdminServiceCategory[] {
  const query = filters.search.trim().toLowerCase();

  return categories
    .filter((category) => {
      if (query) {
        const haystack =
          `${category.code} ${category.name} ${category.headline} ${category.description ?? ''}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (filters.status === 'active' && !category.isActive) return false;
      if (filters.status === 'hidden' && category.isActive) return false;

      if (filters.needKey === 'unassigned' && category.needKey !== null) return false;
      if (filters.needKey !== 'all' && filters.needKey !== 'unassigned' && category.needKey !== filters.needKey) {
        return false;
      }

      return true;
    })
    .sort((left, right) => left.displayOrder - right.displayOrder || left.id - right.id);
}

export function reorderCategoriesByIds(
  categories: AdminServiceCategory[],
  activeId: number,
  overId: number,
): { reordered: AdminServiceCategory[]; changed: AdminServiceCategory[] } | null {
  const ordered = [...categories].sort((left, right) => left.displayOrder - right.displayOrder || left.id - right.id);
  const oldIndex = ordered.findIndex((item) => item.id === activeId);
  const newIndex = ordered.findIndex((item) => item.id === overId);
  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return null;
  }

  const next = [...ordered];
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);

  const reordered = next.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
  const changed = reordered.filter((item, idx) => next[idx].displayOrder !== item.displayOrder);
  return { reordered, changed };
}

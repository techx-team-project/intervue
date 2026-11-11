'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { SERVICE_NEED_ADMIN_META } from '@/constants/service-package';
import {
  hasActiveCategoryFilters,
  type AdminCategoryFilters,
  type CategoryNeedFilter,
  type CategoryStatusFilter,
} from '@/lib/admin-service-categories';
import type { ServiceNeedKey } from '@/types/service-package';
import { RotateCcw, Search, X } from 'lucide-react';

interface AdminServiceCategoriesFilterBarProps {
  filters: AdminCategoryFilters;
  onPatchFilters: (patch: Partial<AdminCategoryFilters>) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS: { value: CategoryStatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
];

const NEED_OPTIONS: { value: CategoryNeedFilter; label: string }[] = [
  { value: 'all', label: 'All suggestion goals' },
  ...(Object.keys(SERVICE_NEED_ADMIN_META) as ServiceNeedKey[]).map((key) => ({
    value: key,
    label: `${key} — ${SERVICE_NEED_ADMIN_META[key].shortLabel}`,
  })),
  { value: 'unassigned', label: 'No suggestion goal' },
];

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminServiceCategoriesFilterBar({
  filters,
  onPatchFilters,
  onResetFilters,
}: AdminServiceCategoriesFilterBarProps) {
  const isDirty = hasActiveCategoryFilters(filters);

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <Input
            value={filters.search}
            onChange={(event) => onPatchFilters({ search: event.target.value })}
            placeholder="Search by name, headline or description..."
            aria-label="Search service categories"
            leftIcon={<Search className="h-4 w-4" />}
            className={CONTROL_DARK_CLASS}
            rightElement={
              filters.search.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onPatchFilters({ search: '' })}
                  aria-label="Clear search"
                  className="hover:bg-surface-container-high hover:text-on-surface dark:hover:bg-forest-800 dark:hover:text-forest-100 cursor-pointer rounded-md p-0.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="w-full sm:w-40">
            <Select
              aria-label="Filter by visibility status"
              value={filters.status}
              onChange={(event) => onPatchFilters({ status: event.target.value as CategoryStatusFilter })}
              options={STATUS_OPTIONS}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full sm:w-60">
            <Select
              aria-label="Filter by suggestion goal"
              value={filters.needKey}
              onChange={(event) => onPatchFilters({ needKey: event.target.value as CategoryNeedFilter })}
              options={NEED_OPTIONS}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          {isDirty && (
            <button
              type="button"
              onClick={onResetFilters}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-850 inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

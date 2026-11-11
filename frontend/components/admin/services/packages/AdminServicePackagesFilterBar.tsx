'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  DEFAULT_PACKAGE_SORT,
  PACKAGE_SORT_OPTIONS,
  PACKAGE_STATUS_FILTER_OPTIONS,
} from '@/lib/admin-service-packages';
import type { AdminServiceCategory, ServicePackageStatus } from '@/types/admin-service-package';
import { RotateCcw, Search, X } from 'lucide-react';

interface AdminServicePackagesFilterBarProps {
  query: string;
  categoryId: string;
  status: ServicePackageStatus | '';
  sort: string;
  categories: AdminServiceCategory[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ServicePackageStatus | '') => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminServicePackagesFilterBar({
  query,
  categoryId,
  status,
  sort,
  categories,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onReset,
}: AdminServicePackagesFilterBarProps) {
  const isDirty = Boolean(query.trim() || categoryId || status || sort !== DEFAULT_PACKAGE_SORT);

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((category) => ({
      value: String(category.id),
      label: `${category.name} (${category.code})${category.isActive ? '' : ' — Hidden'}`,
    })),
  ];

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by package name or code..."
            aria-label="Search service packages"
            leftIcon={<Search className="h-4 w-4" />}
            className={CONTROL_DARK_CLASS}
            rightElement={
              query.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  aria-label="Clear search"
                  className="hover:bg-surface-container-high hover:text-on-surface dark:hover:bg-forest-800 dark:hover:text-forest-100 cursor-pointer rounded-md p-0.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex lg:items-center">
          <div className="w-full lg:w-56">
            <Select
              aria-label="Filter by category"
              value={categoryId}
              onChange={(event) => onCategoryChange(event.target.value)}
              options={categoryOptions}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full lg:w-40">
            <Select
              aria-label="Filter by package status"
              value={status}
              onChange={(event) => onStatusChange(event.target.value as ServicePackageStatus | '')}
              options={[...PACKAGE_STATUS_FILTER_OPTIONS]}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full lg:w-52">
            <Select
              aria-label="Sort service packages"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              options={[...PACKAGE_SORT_OPTIONS]}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          {isDirty && (
            <button
              type="button"
              onClick={onReset}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-850 inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition sm:col-span-3 lg:col-span-1"
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

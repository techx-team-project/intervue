'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  hasActiveCreditPriceFilters,
  type CreditPriceDurationFilter,
  type CreditPriceFilters,
  type CreditPriceStatusFilter,
} from '@/lib/admin-credit-prices';
import { RotateCcw, Search, X } from 'lucide-react';

interface AdminCreditPricesFilterBarProps {
  filters: CreditPriceFilters;
  onPatchFilters: (patch: Partial<CreditPriceFilters>) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS: { value: CreditPriceStatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const DURATION_MODE_OPTIONS: { value: CreditPriceDurationFilter; label: string }[] = [
  { value: 'all', label: 'All billing types' },
  { value: 'time_boxed', label: 'Time-boxed (days)' },
  { value: 'per_use', label: 'Per-use / quota' },
];

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminCreditPricesFilterBar({
  filters,
  onPatchFilters,
  onResetFilters,
}: AdminCreditPricesFilterBarProps) {
  const isDirty = hasActiveCreditPriceFilters(filters);

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <Input
            value={filters.search}
            onChange={(event) => onPatchFilters({ search: event.target.value })}
            placeholder="Search by service name, code or recruiter label..."
            aria-label="Search credit prices"
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
              aria-label="Filter by status"
              value={filters.status}
              onChange={(event) => onPatchFilters({ status: event.target.value as CreditPriceStatusFilter })}
              options={STATUS_OPTIONS}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              aria-label="Filter by duration type"
              value={filters.durationMode}
              onChange={(event) => onPatchFilters({ durationMode: event.target.value as CreditPriceDurationFilter })}
              options={DURATION_MODE_OPTIONS}
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

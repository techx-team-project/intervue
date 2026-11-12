'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  AD_PLACEMENT_FILTER_OPTIONS,
  AD_SLOT_SORT_OPTIONS,
  AD_SLOT_STATUS_FILTER_OPTIONS,
  DEFAULT_AD_SLOT_SORT,
  type AdSlotPlacement,
  type AdSlotSaleFilter,
  type AdSlotSort,
} from '@/lib/admin-ads';
import { RotateCcw, Search, X } from 'lucide-react';

interface AdminAdSlotsFilterBarProps {
  query: string;
  placement: AdSlotPlacement | '';
  status: AdSlotSaleFilter;
  sort: AdSlotSort;
  onQueryChange: (value: string) => void;
  onPlacementChange: (value: AdSlotPlacement | '') => void;
  onStatusChange: (value: AdSlotSaleFilter) => void;
  onSortChange: (value: AdSlotSort) => void;
  onReset: () => void;
}

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminAdSlotsFilterBar({
  query,
  placement,
  status,
  sort,
  onQueryChange,
  onPlacementChange,
  onStatusChange,
  onSortChange,
  onReset,
}: AdminAdSlotsFilterBarProps) {
  const isDirty = Boolean(query.trim() || placement || status || sort !== DEFAULT_AD_SLOT_SORT);

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by slot code, name, description, or linked package..."
            aria-label="Search ad slots"
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
          <div className="w-full lg:w-44">
            <Select
              aria-label="Filter by placement"
              value={placement}
              onChange={(event) => onPlacementChange(event.target.value as AdSlotPlacement | '')}
              options={[...AD_PLACEMENT_FILTER_OPTIONS]}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full lg:w-36">
            <Select
              aria-label="Filter by sale status"
              value={status}
              onChange={(event) => onStatusChange(event.target.value as AdSlotSaleFilter)}
              options={[...AD_SLOT_STATUS_FILTER_OPTIONS]}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full lg:w-44">
            <Select
              aria-label="Sort ad slots"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as AdSlotSort)}
              options={AD_SLOT_SORT_OPTIONS}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          {isDirty && (
            <button
              type="button"
              onClick={onReset}
              className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-850 border-outline-variant text-on-surface-variant hover:bg-surface-container-low inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors"
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

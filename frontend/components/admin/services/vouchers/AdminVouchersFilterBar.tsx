'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  DEFAULT_VOUCHER_SORT,
  VOUCHER_DISCOUNT_TYPE_FILTER_OPTIONS,
  VOUCHER_SORT_OPTIONS,
  VOUCHER_STATUS_FILTER_OPTIONS,
} from '@/lib/admin-vouchers';
import type { VoucherDiscountType, VoucherStatus } from '@/types/voucher';
import { RotateCcw, Search, X } from 'lucide-react';

interface AdminVouchersFilterBarProps {
  query: string;
  status: VoucherStatus | '';
  discountType: VoucherDiscountType | '';
  sort: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: VoucherStatus | '') => void;
  onDiscountTypeChange: (value: VoucherDiscountType | '') => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminVouchersFilterBar({
  query,
  status,
  discountType,
  sort,
  onQueryChange,
  onStatusChange,
  onDiscountTypeChange,
  onSortChange,
  onReset,
}: AdminVouchersFilterBarProps) {
  const isDirty = Boolean(query.trim() || status || discountType || sort !== DEFAULT_VOUCHER_SORT);

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by voucher code, headline, or note..."
            aria-label="Search vouchers"
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
              aria-label="Filter by discount type"
              value={discountType}
              onChange={(event) => onDiscountTypeChange(event.target.value as VoucherDiscountType | '')}
              options={[...VOUCHER_DISCOUNT_TYPE_FILTER_OPTIONS]}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full lg:w-36">
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(event) => onStatusChange(event.target.value as VoucherStatus | '')}
              options={[...VOUCHER_STATUS_FILTER_OPTIONS]}
              className={CONTROL_DARK_CLASS}
            />
          </div>

          <div className="w-full lg:w-44">
            <Select
              aria-label="Sort vouchers"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              options={[...VOUCHER_SORT_OPTIONS]}
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

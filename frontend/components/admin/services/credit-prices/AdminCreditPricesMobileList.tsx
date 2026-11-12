'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import {
  formatRecruiterCreditPreview,
  getCreditTierMeta,
  getEntitlementTypeLabel,
  isCreditPriceDraftDirty,
  isTimeBoxedEntitlement,
  MAX_CREDIT_COST,
  MAX_CREDIT_DURATION_DAYS,
  toCreditPriceDraft,
  validateCreditPriceDraft,
  type CreditPriceDraft,
} from '@/lib/admin-credit-prices';
import { cn } from '@/lib/utils';
import type { CreditPrice } from '@/types/credit';
import { Check, RotateCcw } from 'lucide-react';

interface AdminCreditPricesMobileListProps {
  prices: CreditPrice[];
  drafts: Record<number, CreditPriceDraft>;
  savingIds: ReadonlySet<number>;
  isBatchSaving: boolean;
  onPatch: (id: number, patch: Partial<CreditPriceDraft>) => void;
  onResetRow: (id: number) => void;
  onSaveRow: (price: CreditPrice) => void;
}

const INPUT_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminCreditPricesMobileList({
  prices,
  drafts,
  savingIds,
  isBatchSaving,
  onPatch,
  onResetRow,
  onSaveRow,
}: AdminCreditPricesMobileListProps) {
  return (
    <ul className="dark:[&_label]:text-forest-100 space-y-3 lg:hidden">
      {prices.map((price) => {
        const draft = drafts[price.id] ?? toCreditPriceDraft(price);
        const isDirty = isCreditPriceDraftDirty(price, draft);
        const isBusy = savingIds.has(price.id);
        const timeBoxed = isTimeBoxedEntitlement(price.entitlementType);
        const serviceLabel = getEntitlementTypeLabel(price.entitlementType);
        const tierMeta = getCreditTierMeta(price.entitlementType, price.tier);
        const fieldErrors = isDirty ? validateCreditPriceDraft(price.entitlementType, draft).fieldErrors : {};

        return (
          <li
            key={price.id}
            className={cn(
              'dark:border-forest-800 border-outline-variant space-y-3 rounded-lg border p-4 shadow-2xs',
              isDirty ? 'bg-amber-50/40 dark:bg-amber-950/15' : 'dark:bg-forest-900 bg-white',
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-navy dark:text-forest-50 text-sm font-bold">{serviceLabel}</span>
                  {isDirty && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                      Modified
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <code className="dark:bg-forest-850 dark:text-forest-200 bg-surface-container-low text-on-surface-variant rounded px-1.5 py-0.5 font-mono">
                    {price.entitlementType}
                  </code>
                  {tierMeta.isBoost && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap',
                        tierMeta.pillClass,
                      )}
                    >
                      {tierMeta.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="dark:text-forest-300 text-on-surface-variant text-xs font-medium">Active</span>
                <Switch
                  checked={draft.active}
                  onChange={(value) => onPatch(price.id, { active: value })}
                  disabled={isBusy || isBatchSaving}
                  ariaLabel={`Toggle active status for ${price.entitlementType}`}
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <Input
                label="Order"
                type="number"
                min={0}
                radius="lg"
                value={draft.displayOrder}
                onChange={(event) => onPatch(price.id, { displayOrder: event.target.value })}
                error={fieldErrors.displayOrder}
                className={cn('py-1.5 text-sm tabular-nums', INPUT_DARK_CLASS)}
              />
              <Input
                label="Credits *"
                type="number"
                min={1}
                max={MAX_CREDIT_COST}
                radius="lg"
                value={draft.creditCost}
                onChange={(event) => onPatch(price.id, { creditCost: event.target.value })}
                error={fieldErrors.creditCost}
                className={cn('py-1.5 text-sm font-semibold tabular-nums', INPUT_DARK_CLASS)}
              />
              <Input
                label={timeBoxed ? 'Days *' : 'Days'}
                type="number"
                min={1}
                max={MAX_CREDIT_DURATION_DAYS}
                radius="lg"
                value={draft.durationDays}
                onChange={(event) => onPatch(price.id, { durationDays: event.target.value })}
                placeholder={timeBoxed ? 'Required' : '—'}
                error={fieldErrors.durationDays}
                className={cn('py-1.5 text-sm tabular-nums', INPUT_DARK_CLASS)}
              />
            </div>

            <div>
              <Input
                label="Label shown to recruiters *"
                maxLength={255}
                radius="lg"
                value={draft.label}
                onChange={(event) => onPatch(price.id, { label: event.target.value })}
                error={fieldErrors.label}
                className={cn('py-1.5 text-sm', INPUT_DARK_CLASS)}
              />
              {!fieldErrors.label && (
                <p className="dark:text-forest-400 text-on-surface-variant mt-1 text-[11px]">
                  Preview: {formatRecruiterCreditPreview(draft.label, draft.creditCost)}
                </p>
              )}
            </div>

            <div className="dark:border-forest-800 border-outline-variant flex items-center justify-between gap-2 border-t pt-3">
              <span className="dark:text-forest-400 text-on-surface-variant text-[11px]">
                {timeBoxed ? 'Requires duration in days' : 'Per-use / instant grant'}
              </span>

              {isDirty ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    radius="lg"
                    disabled={isBusy || isBatchSaving}
                    onClick={() => onResetRow(price.id)}
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-850"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    radius="lg"
                    isLoading={isBusy}
                    disabled={isBatchSaving}
                    onClick={() => onSaveRow(price)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <span className="dark:text-forest-400 text-on-surface-variant inline-flex items-center gap-1 text-xs font-medium">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  Synced
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

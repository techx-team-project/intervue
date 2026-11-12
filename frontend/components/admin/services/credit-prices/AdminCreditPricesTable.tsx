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
  MAX_CREDIT_DURATION_DAYS,
  toCreditPriceDraft,
  validateCreditPriceDraft,
  type CreditPriceDraft,
} from '@/lib/admin-credit-prices';
import { cn } from '@/lib/utils';
import type { CreditPrice } from '@/types/credit';
import { Check, RotateCcw } from 'lucide-react';

interface AdminCreditPricesTableProps {
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

export default function AdminCreditPricesTable({
  prices,
  drafts,
  savingIds,
  isBatchSaving,
  onPatch,
  onResetRow,
  onSaveRow,
}: AdminCreditPricesTableProps) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant hidden overflow-hidden rounded-lg border bg-white shadow-xs lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/70 dark:text-forest-300 border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="w-24 py-3.5 pr-3 pl-5">Order</th>
              <th className="w-60 px-4 py-3.5">Service</th>
              <th className="w-40 px-4 py-3.5">Tier</th>
              <th className="w-36 px-4 py-3.5">Credits</th>
              <th className="w-32 px-4 py-3.5">Days</th>
              <th className="px-4 py-3.5">Label shown to recruiters</th>
              <th className="w-24 px-4 py-3.5">Active</th>
              <th className="w-36 py-3.5 pr-5 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-outline-variant divide-y">
            {prices.map((price) => {
              const draft = drafts[price.id] ?? toCreditPriceDraft(price);
              const isDirty = isCreditPriceDraftDirty(price, draft);
              const isBusy = savingIds.has(price.id);
              const timeBoxed = isTimeBoxedEntitlement(price.entitlementType);
              const serviceLabel = getEntitlementTypeLabel(price.entitlementType);
              const tierMeta = getCreditTierMeta(price.entitlementType, price.tier);
              const fieldErrors = isDirty ? validateCreditPriceDraft(price.entitlementType, draft).fieldErrors : {};

              return (
                <tr
                  key={price.id}
                  className={cn(
                    'transition-colors',
                    isDirty
                      ? 'bg-amber-50/45 hover:bg-amber-50/70 dark:bg-amber-950/15 dark:hover:bg-amber-950/25'
                      : 'hover:bg-surface-container-low/70 dark:hover:bg-forest-850/60',
                  )}
                >
                  <td className="py-3.5 pr-3 pl-5 align-top">
                    <Input
                      type="number"
                      min={0}
                      radius="lg"
                      aria-label={`Display order for ${serviceLabel}`}
                      value={draft.displayOrder}
                      onChange={(event) => onPatch(price.id, { displayOrder: event.target.value })}
                      error={fieldErrors.displayOrder}
                      className={cn('w-18 py-1.5 text-center font-mono text-xs tabular-nums', INPUT_DARK_CLASS)}
                    />
                  </td>

                  <td className="px-4 py-3.5 align-top">
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
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                          timeBoxed
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                            : 'bg-surface-container-low text-on-surface-variant dark:bg-forest-850 dark:text-forest-300',
                        )}
                      >
                        {timeBoxed ? 'Time-boxed' : 'Per-use'}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    {tierMeta.isBoost ? (
                      <span
                        className={cn(
                          'mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap',
                          tierMeta.pillClass,
                        )}
                      >
                        {tierMeta.label}
                      </span>
                    ) : (
                      <span
                        className="dark:text-forest-400 text-on-surface-variant mt-2 inline-block text-xs font-medium"
                        title="Single level — only Job ranking boost uses tiers"
                      >
                        —
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    <Input
                      type="number"
                      min={1}
                      radius="lg"
                      aria-label={`Credits cost for ${serviceLabel}`}
                      value={draft.creditCost}
                      onChange={(event) => onPatch(price.id, { creditCost: event.target.value })}
                      error={fieldErrors.creditCost}
                      className={cn('w-28 py-1.5 text-sm font-semibold tabular-nums', INPUT_DARK_CLASS)}
                    />
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    <Input
                      type="number"
                      min={1}
                      max={MAX_CREDIT_DURATION_DAYS}
                      radius="lg"
                      aria-label={`Duration in days for ${serviceLabel}`}
                      value={draft.durationDays}
                      onChange={(event) => onPatch(price.id, { durationDays: event.target.value })}
                      placeholder={timeBoxed ? 'Required *' : '—'}
                      error={fieldErrors.durationDays}
                      className={cn('w-24 py-1.5 text-sm tabular-nums', INPUT_DARK_CLASS)}
                    />
                    {!fieldErrors.durationDays && (
                      <p className="dark:text-forest-400 text-on-surface-variant mt-1 text-[10px]">
                        {timeBoxed ? 'Required' : 'Optional'}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    <Input
                      maxLength={255}
                      radius="lg"
                      aria-label={`Recruiter label for ${serviceLabel}`}
                      value={draft.label}
                      onChange={(event) => onPatch(price.id, { label: event.target.value })}
                      error={fieldErrors.label}
                      className={cn('min-w-[260px] py-1.5 text-sm', INPUT_DARK_CLASS)}
                    />
                    {!fieldErrors.label && (
                      <p className="dark:text-forest-400 text-on-surface-variant mt-1 truncate text-[11px]">
                        Preview: {formatRecruiterCreditPreview(draft.label, draft.creditCost)}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="pt-1">
                      <Switch
                        checked={draft.active}
                        onChange={(value) => onPatch(price.id, { active: value })}
                        disabled={isBusy || isBatchSaving}
                        ariaLabel={`Toggle active status for ${price.entitlementType}`}
                        size="sm"
                      />
                    </div>
                  </td>

                  <td className="py-3.5 pr-5 pl-4 text-right align-top">
                    <div className="inline-flex items-center justify-end gap-1.5 pt-0.5">
                      {isDirty ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onResetRow(price.id)}
                            disabled={isBusy || isBatchSaving}
                            aria-label={`Reset changes for ${serviceLabel}`}
                            title="Discard row changes"
                            className="text-on-surface-variant hover:bg-surface-container-high hover:text-navy dark:text-forest-300 dark:hover:bg-forest-800 dark:hover:text-forest-50 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                          <Button
                            size="sm"
                            radius="lg"
                            isLoading={isBusy}
                            disabled={isBatchSaving}
                            onClick={() => onSaveRow(price)}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <span className="dark:text-forest-400 text-on-surface-variant inline-flex h-8 items-center gap-1 px-2 text-xs font-medium">
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                          Synced
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

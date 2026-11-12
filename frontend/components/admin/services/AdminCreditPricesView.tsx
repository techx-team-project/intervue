'use client';

import { adminCreditPriceApi } from '@/apiRequest/credit';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCreditPricesFilterBar from '@/components/admin/services/credit-prices/AdminCreditPricesFilterBar';
import AdminCreditPricesMobileList from '@/components/admin/services/credit-prices/AdminCreditPricesMobileList';
import AdminCreditPricesTable from '@/components/admin/services/credit-prices/AdminCreditPricesTable';
import CreateCreditPriceModal from '@/components/admin/services/credit-prices/CreateCreditPriceModal';
import Pagination from '@/components/common/Pagination';
import { Button, buttonClassName } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { creditKeys } from '@/hooks/useCredits';
import {
  CREDIT_PRICE_PAGE_SIZE_OPTIONS,
  EMPTY_CREDIT_PRICE_FILTERS,
  filterAndSortCreditPrices,
  getEntitlementTypeLabel,
  isCreditPriceDraftDirty,
  sortCreditPrices,
  toCreditPriceDraft,
  validateCreditPriceDraft,
  type CreditPriceDraft,
  type CreditPriceFilters,
} from '@/lib/admin-credit-prices';
import type { CreateCreditPriceInput, CreditPrice } from '@/types/credit';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { Coins, FolderKanban, Info, Plus, Save, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AdminCreditPricesViewProps {
  initialPrices: CreditPrice[];
}

export default function AdminCreditPricesView({ initialPrices }: AdminCreditPricesViewProps) {
  const queryClient = useQueryClient();

  const [prices, setPrices] = useState<CreditPrice[]>(() => sortCreditPrices(initialPrices));
  const [drafts, setDrafts] = useState<Record<number, CreditPriceDraft>>(() =>
    Object.fromEntries(initialPrices.map((price) => [price.id, toCreditPriceDraft(price)])),
  );
  const [filters, setFilters] = useState<CreditPriceFilters>(EMPTY_CREDIT_PRICE_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [savingIds, setSavingIds] = useState<Set<number>>(() => new Set());
  const [isBatchSaving, setIsBatchSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const invalidateCreditCaches = async () => {
    await queryClient.invalidateQueries({ queryKey: creditKeys.wallet });
  };

  const activeCount = useMemo(() => prices.filter((price) => price.active).length, [prices]);
  const dirtyPrices = useMemo(
    () => prices.filter((price) => isCreditPriceDraftDirty(price, drafts[price.id])),
    [prices, drafts],
  );
  const filteredPrices = useMemo(() => filterAndSortCreditPrices(prices, filters), [prices, filters]);

  const pageCount = Math.max(1, Math.ceil(filteredPrices.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedPrices = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredPrices.slice(start, start + pageSize);
  }, [filteredPrices, safePage, pageSize]);

  const patchFilters = (patch: Partial<CreditPriceFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(EMPTY_CREDIT_PRICE_FILTERS);
    setPage(1);
  };

  const patchDraft = (id: number, change: Partial<CreditPriceDraft>) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? { creditCost: '', durationDays: '', label: '', active: true, displayOrder: '0' }),
        ...change,
      },
    }));
  };

  const resetRow = (id: number) => {
    const original = prices.find((item) => item.id === id);
    if (!original) return;
    setDrafts((current) => ({ ...current, [id]: toCreditPriceDraft(original) }));
  };

  const discardAllChanges = () => {
    setDrafts(Object.fromEntries(prices.map((price) => [price.id, toCreditPriceDraft(price)])));
    toast.success('Discarded unsaved row changes.');
  };

  const handleSaveRow = async (price: CreditPrice) => {
    const draft = drafts[price.id] ?? toCreditPriceDraft(price);
    const serviceLabel = getEntitlementTypeLabel(price.entitlementType);
    const { payload } = validateCreditPriceDraft(price.entitlementType, draft);
    if (!payload) {
      toast.error(`Please fix invalid fields for ${serviceLabel} (${price.entitlementType}).`);
      return;
    }

    setSavingIds((current) => new Set(current).add(price.id));
    try {
      const saved = await adminCreditPriceApi.update(price.id, payload);
      setPrices((current) => sortCreditPrices(current.map((item) => (item.id === price.id ? saved : item))));
      setDrafts((current) => ({ ...current, [price.id]: toCreditPriceDraft(saved) }));
      await invalidateCreditCaches();
      toast.success(`Saved credit price for ${serviceLabel} (Tier ${saved.tier}).`);
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setSavingIds((current) => {
        const next = new Set(current);
        next.delete(price.id);
        return next;
      });
    }
  };

  const handleSaveAll = async () => {
    if (dirtyPrices.length === 0 || isBatchSaving) return;

    const validated = dirtyPrices.map((price) => ({
      price,
      result: validateCreditPriceDraft(price.entitlementType, drafts[price.id] ?? toCreditPriceDraft(price)),
    }));
    const firstInvalid = validated.find((entry) => entry.result.payload === null);
    if (firstInvalid) {
      const serviceLabel = getEntitlementTypeLabel(firstInvalid.price.entitlementType);
      toast.error(`Cannot save: ${serviceLabel} (${firstInvalid.price.entitlementType}) has invalid fields.`);
      return;
    }

    setIsBatchSaving(true);
    try {
      const results = await Promise.allSettled(
        validated.map((entry) => adminCreditPriceApi.update(entry.price.id, entry.result.payload!)),
      );

      const savedById = new Map<number, CreditPrice>();
      let failedCount = 0;
      let firstError: string | null = null;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          savedById.set(result.value.id, result.value);
        } else {
          failedCount += 1;
          firstError ??= getErrorMessage(result.reason);
        }
      });

      if (savedById.size > 0) {
        setPrices((current) => sortCreditPrices(current.map((item) => savedById.get(item.id) ?? item)));
        setDrafts((current) => {
          const next = { ...current };
          savedById.forEach((saved, id) => {
            next[id] = toCreditPriceDraft(saved);
          });
          return next;
        });
        await invalidateCreditCaches();
      }

      if (failedCount === 0) {
        toast.success(`Saved ${savedById.size} updated credit ${savedById.size === 1 ? 'rule' : 'rules'}.`);
      } else {
        toast.error(`Saved ${savedById.size} rules, ${failedCount} failed${firstError ? `: ${firstError}` : '.'}`);
      }
    } finally {
      setIsBatchSaving(false);
    }
  };

  const handleCreate = async (payload: CreateCreditPriceInput): Promise<boolean> => {
    setIsCreating(true);
    try {
      const created = await adminCreditPriceApi.create(payload);
      setPrices((current) => sortCreditPrices([...current, created]));
      setDrafts((current) => ({ ...current, [created.id]: toCreditPriceDraft(created) }));
      await invalidateCreditCaches();
      toast.success(`Created credit price for ${getEntitlementTypeLabel(created.entitlementType)}.`);
      return true;
    } catch (cause) {
      toast.error(getErrorMessage(cause));
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <AdminPageHeader
        className="mb-0"
        description="Set how many credits recruiters spend per unit when exchanging wallet credits."
        count={prices.length}
        countLabel={`rules (${activeCount} active)`}
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_SERVICE_PACKAGES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <FolderKanban className="h-4 w-4" />
              <span>Service packages</span>
            </Link>
            {dirtyPrices.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                isLoading={isBatchSaving}
                disabled={savingIds.size > 0}
                onClick={() => void handleSaveAll()}
                leftIcon={<Save className="h-4 w-4" />}
                className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-300 dark:hover:bg-amber-950/40"
              >
                Save all ({dirtyPrices.length})
              </Button>
            )}
            <Button type="button" size="md" onClick={() => setCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              New credit price
            </Button>
          </>
        }
      />

      <AdminCreditPricesFilterBar filters={filters} onPatchFilters={patchFilters} onResetFilters={resetFilters} />

      {prices.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          <Coins className="text-outline h-10 w-10" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">No credit exchange rules yet</p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            Create conversion rules so recruiters can exchange wallet credits from FLEX or bonus packages into services.
          </p>
          <Button type="button" size="md" onClick={() => setCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New credit price
          </Button>
        </div>
      ) : filteredPrices.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          <SearchX className="text-outline h-10 w-10" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">No rules match these filters</p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            Try a different service keyword or reset the status and billing type filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-l-4 border-amber-200/75 border-l-amber-500 bg-amber-50 px-4 py-3.5 dark:border-amber-800/60 dark:border-l-amber-400 dark:bg-amber-950/35">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    How recruiters see this pricing table
                  </p>
                  <p className="text-on-surface-variant mt-1 text-sm leading-relaxed dark:text-amber-100/80">
                    Only active rows appear when recruiters exchange credits, ordered from lowest Order to highest. Edit
                    any row inline and click Save (or Save all) to publish changes.
                  </p>
                </div>
              </div>
            </div>

            {dirtyPrices.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/80 pt-2.5 pl-7.5 dark:border-amber-800/50">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  {dirtyPrices.length} {dirtyPrices.length === 1 ? 'rule has' : 'rules have'} unsaved changes.
                </p>
                <button
                  type="button"
                  onClick={discardAllChanges}
                  className="cursor-pointer text-xs font-bold text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-200 dark:hover:text-amber-100"
                >
                  Discard all changes
                </button>
              </div>
            )}
          </div>

          <AdminCreditPricesTable
            prices={pagedPrices}
            drafts={drafts}
            savingIds={savingIds}
            isBatchSaving={isBatchSaving}
            onPatch={patchDraft}
            onResetRow={resetRow}
            onSaveRow={(price) => void handleSaveRow(price)}
          />

          <AdminCreditPricesMobileList
            prices={pagedPrices}
            drafts={drafts}
            savingIds={savingIds}
            isBatchSaving={isBatchSaving}
            onPatch={patchDraft}
            onResetRow={resetRow}
            onSaveRow={(price) => void handleSaveRow(price)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Pagination
              page={safePage}
              pageCount={pageCount}
              totalItems={filteredPrices.length}
              pageSize={pageSize}
              onPageChange={setPage}
              className="flex-1"
            />
            <div className="w-32 shrink-0 self-end sm:self-auto">
              <Select
                aria-label="Rows per page"
                value={String(pageSize)}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                options={CREDIT_PRICE_PAGE_SIZE_OPTIONS}
                className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-100 py-1.5 text-xs"
              />
            </div>
          </div>
        </>
      )}

      <CreateCreditPriceModal
        isOpen={createOpen}
        prices={prices}
        isCreating={isCreating}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

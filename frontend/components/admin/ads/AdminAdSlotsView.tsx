'use client';

import { adminAdApi } from '@/apiRequest/ads';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdArtworkLightboxModal, { type LightboxArtworkItem } from '@/components/admin/ads/AdArtworkLightboxModal';
import AdminAdSlotsFilterBar from '@/components/admin/ads/slots/AdminAdSlotsFilterBar';
import AdminAdSlotsMobileList from '@/components/admin/ads/slots/AdminAdSlotsMobileList';
import AdminAdSlotsTable from '@/components/admin/ads/slots/AdminAdSlotsTable';
import Pagination from '@/components/common/Pagination';
import { buttonClassName } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { adKeys } from '@/hooks/useAds';
import { serviceCatalogKeys } from '@/hooks/useServiceCatalog';
import {
  AD_SLOT_PAGE_SIZE_OPTIONS,
  adminAdKeys,
  DEFAULT_AD_SLOT_SORT,
  filterAndSortAdSlots,
  getAdPlacementMeta,
  type AdSlotPlacement,
  type AdSlotSaleFilter,
  type AdSlotSort,
} from '@/lib/admin-ads';
import { adminServicePackageKeys } from '@/lib/admin-service-packages';
import type { AdSlot } from '@/types/ads';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Image as ImageIcon, Megaphone, Plus, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AdminAdSlotsViewProps {
  slots: AdSlot[];
  query: string;
  placement: AdSlotPlacement | '';
  status: AdSlotSaleFilter;
  sort: AdSlotSort;
  page: number;
  pageSize: number;
  isFetching: boolean;
  onQueryChange: (value: string) => void;
  onPlacementChange: (value: AdSlotPlacement | '') => void;
  onStatusChange: (value: AdSlotSaleFilter) => void;
  onSortChange: (value: AdSlotSort) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
}

export default function AdminAdSlotsView({
  slots,
  query,
  placement,
  status,
  sort,
  page,
  pageSize,
  isFetching,
  onQueryChange,
  onPlacementChange,
  onStatusChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
}: AdminAdSlotsViewProps) {
  const queryClient = useQueryClient();
  const [busySlotId, setBusySlotId] = useState<number | null>(null);
  const [lightboxItem, setLightboxItem] = useState<LightboxArtworkItem | null>(null);

  const hasFilters = Boolean(query.trim() || placement || status || sort !== DEFAULT_AD_SLOT_SORT);

  const filteredSlots = useMemo(
    () =>
      filterAndSortAdSlots(slots, {
        query,
        placement,
        status,
        sort,
      }),
    [placement, query, slots, sort, status],
  );

  const pageCount = Math.max(1, Math.ceil(filteredSlots.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const pagedSlots = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredSlots.slice(start, start + pageSize);
  }, [filteredSlots, pageSize, safePage]);

  const handleToggleSale = async (slot: AdSlot) => {
    const nextActive = !slot.active;
    setBusySlotId(slot.id);
    try {
      await adminAdApi.updateSlot(slot.id, {
        name: slot.name,
        description: slot.description,
        pricePerWeek: slot.pricePerWeek,
        houseImageUrl: slot.houseImageUrl,
        houseTargetUrl: slot.houseTargetUrl,
        displayOrder: slot.displayOrder,
        active: nextActive,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminAdKeys.all }),
        queryClient.invalidateQueries({ queryKey: adKeys.slots }),
        queryClient.invalidateQueries({ queryKey: adminServicePackageKeys.all }),
        queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog }),
      ]);
      toast.success(nextActive ? `Slot "${slot.code}" is now on sale.` : `Slot "${slot.code}" paused.`);
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setBusySlotId(null);
    }
  };

  const handleInspectHouseAd = (slot: AdSlot) => {
    if (!slot.houseImageUrl) return;
    setLightboxItem({
      title: `${slot.code} — House ad fallback`,
      subtitle: `${slot.name} · ${getAdPlacementMeta(slot.placement).label}`,
      imageUrl: slot.houseImageUrl,
      targetUrl: slot.houseTargetUrl,
      width: slot.width,
      height: slot.height,
    });
  };

  return (
    <div className="space-y-4 pb-12">
      <AdminPageHeader
        className="mb-0"
        description="Manage storefront banner placements, weekly ISO pricing, and house-ad fallbacks shown when weeks are unsold."
        count={filteredSlots.length}
        countLabel={hasFilters ? 'matching slots' : 'ad slots'}
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_ADS_CREATIVES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Banner artwork</span>
            </Link>
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
            <Link href={ROUTES.ADMIN_ADS_SLOTS_CREATE} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New ad slot</span>
            </Link>
          </>
        }
      />

      <AdminAdSlotsFilterBar
        query={query}
        placement={placement}
        status={status}
        sort={sort}
        onQueryChange={onQueryChange}
        onPlacementChange={onPlacementChange}
        onStatusChange={onStatusChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {filteredSlots.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          {hasFilters ? (
            <SearchX className="text-outline h-10 w-10" />
          ) : (
            <Megaphone className="text-outline h-10 w-10" />
          )}
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">
            {hasFilters ? 'No ad slots match these filters' : 'No ad slots configured yet'}
          </p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            {hasFilters
              ? 'Try another code/name keyword or reset placement and sale status filters.'
              : 'Create your first storefront banner placement so recruiters can reserve weekly ad space.'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
            >
              Clear all filters
            </button>
          ) : (
            <Link href={ROUTES.ADMIN_ADS_SLOTS_CREATE} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New ad slot</span>
            </Link>
          )}
        </div>
      ) : (
        <div className={isFetching ? 'opacity-75 transition-opacity' : 'transition-opacity'}>
          <AdminAdSlotsTable
            slots={pagedSlots}
            busySlotId={busySlotId}
            onToggleSale={handleToggleSale}
            onInspectHouseAd={handleInspectHouseAd}
          />
          <AdminAdSlotsMobileList
            slots={pagedSlots}
            busySlotId={busySlotId}
            onToggleSale={handleToggleSale}
            onInspectHouseAd={handleInspectHouseAd}
          />
        </div>
      )}

      {filteredSlots.length > 0 && (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 shadow-2xs">
          <div className="min-w-0 flex-1">
            <Pagination
              page={safePage}
              pageCount={pageCount}
              totalItems={filteredSlots.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
          <div className="w-32 shrink-0">
            <Select
              aria-label="Rows per page"
              value={String(pageSize)}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              options={[...AD_SLOT_PAGE_SIZE_OPTIONS]}
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50"
            />
          </div>
        </div>
      )}

      <AdArtworkLightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}

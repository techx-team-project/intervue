'use client';

import AdBannerPreviewFrame from '@/components/admin/ads/AdBannerPreviewFrame';
import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import { formatAdDimensions, getAdPlacementMeta } from '@/lib/admin-ads';
import { formatVnd } from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import type { AdSlot } from '@/types/ads';
import { SquarePen } from 'lucide-react';
import Link from 'next/link';

interface AdminAdSlotsMobileListProps {
  slots: AdSlot[];
  busySlotId: number | null;
  onToggleSale: (slot: AdSlot) => void;
  onInspectHouseAd: (slot: AdSlot) => void;
}

export default function AdminAdSlotsMobileList({
  slots,
  busySlotId,
  onToggleSale,
  onInspectHouseAd,
}: AdminAdSlotsMobileListProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {slots.map((slot) => {
        const placementMeta = getAdPlacementMeta(slot.placement);
        const isBusy = busySlotId === slot.id;

        return (
          <article
            key={slot.id}
            className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-4 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`${ROUTES.ADMIN_ADS_SLOTS}/${slot.id}/edit`}
                    className="text-primary font-mono text-sm font-bold tracking-wide hover:underline dark:text-emerald-400"
                  >
                    {slot.code}
                  </Link>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      placementMeta.pillClass,
                    )}
                  >
                    {placementMeta.code}
                  </span>
                  <span className="text-on-surface-variant dark:text-forest-400 font-mono text-[11px]">
                    #{slot.displayOrder}
                  </span>
                </div>
                <p className="text-navy dark:text-forest-50 mt-1 text-xs font-semibold">{slot.name}</p>
              </div>

              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                  slot.active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                    : 'dark:bg-forest-850 dark:text-forest-300 bg-neutral-100 text-neutral-600',
                )}
              >
                {slot.active ? 'On sale' : 'Paused'}
              </span>
            </div>

            {slot.description && (
              <p className="text-on-surface-variant dark:text-forest-300 mt-1.5 line-clamp-2 text-xs">
                {slot.description}
              </p>
            )}

            <div className="dark:text-forest-300 text-on-surface-variant mt-3 flex items-center justify-between text-xs">
              <span className="font-mono">{formatAdDimensions(slot.width, slot.height)}</span>
              <span className="text-navy dark:text-forest-50 font-bold tabular-nums">
                {formatVnd(slot.pricePerWeek)} / week
              </span>
            </div>

            {slot.houseImageUrl && (
              <div className="mt-3">
                <AdBannerPreviewFrame
                  imageUrl={slot.houseImageUrl}
                  alt={`${slot.code} house ad`}
                  width={slot.width}
                  height={slot.height}
                  onInspect={() => onInspectHouseAd(slot)}
                />
              </div>
            )}

            <div className="dark:border-forest-800 border-outline-variant mt-3 flex items-center justify-between border-t pt-3">
              <label className="flex items-center gap-2 text-xs font-medium">
                <Switch
                  size="sm"
                  checked={slot.active}
                  disabled={isBusy}
                  ariaLabel={`Toggle sale status for ${slot.code}`}
                  onChange={() => onToggleSale(slot)}
                />
                <span className="dark:text-forest-200 text-on-surface">On sale</span>
              </label>

              <Link
                href={`${ROUTES.ADMIN_ADS_SLOTS}/${slot.id}/edit`}
                className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 border-outline-variant text-navy hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <SquarePen className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

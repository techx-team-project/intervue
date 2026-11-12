'use client';

import AdBannerPreviewFrame from '@/components/admin/ads/AdBannerPreviewFrame';
import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import { formatAdDimensions, getAdPlacementMeta } from '@/lib/admin-ads';
import { formatVnd } from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import type { AdSlot } from '@/types/ads';
import { ExternalLink, SquarePen } from 'lucide-react';
import Link from 'next/link';

interface AdminAdSlotsTableProps {
  slots: AdSlot[];
  busySlotId: number | null;
  onToggleSale: (slot: AdSlot) => void;
  onInspectHouseAd: (slot: AdSlot) => void;
}

export default function AdminAdSlotsTable({
  slots,
  busySlotId,
  onToggleSale,
  onInspectHouseAd,
}: AdminAdSlotsTableProps) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant hidden overflow-hidden rounded-lg border bg-white shadow-xs lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/70 dark:text-forest-300 border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="w-16 px-4 py-3.5 text-center">Order</th>
              <th className="px-4 py-3.5">Slot &amp; placement</th>
              <th className="w-40 px-4 py-3.5">Dimensions</th>
              <th className="w-40 px-4 py-3.5">Weekly rate</th>
              <th className="w-48 px-4 py-3.5">House ad fallback</th>
              <th className="w-36 px-4 py-3.5">Sale status</th>
              <th className="w-24 py-3.5 pr-5 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-outline-variant divide-y">
            {slots.map((slot) => {
              const placementMeta = getAdPlacementMeta(slot.placement);
              const isBusy = busySlotId === slot.id;

              return (
                <tr
                  key={slot.id}
                  className="hover:bg-surface-container-low/70 dark:hover:bg-forest-850/60 transition-colors"
                >
                  <td className="text-on-surface-variant dark:text-forest-300 px-4 py-4 text-center align-middle font-mono font-semibold tabular-nums">
                    #{slot.displayOrder}
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`${ROUTES.ADMIN_ADS_SLOTS}/${slot.id}/edit`}
                        className="text-primary font-mono text-sm font-bold tracking-wide hover:underline dark:text-emerald-400"
                      >
                        {slot.code}
                      </Link>
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                          placementMeta.pillClass,
                        )}
                      >
                        {placementMeta.code}
                      </span>
                      {slot.packageSlug && (
                        <span className="dark:bg-forest-850 dark:text-forest-200 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
                          {slot.packageSlug}
                        </span>
                      )}
                    </div>
                    <p className="text-navy dark:text-forest-50 mt-1 text-xs font-semibold">{slot.name}</p>
                    {slot.description && (
                      <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 line-clamp-1 max-w-md text-[11px]">
                        {slot.description}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <span className="dark:bg-forest-850 dark:text-forest-100 inline-flex rounded-md bg-neutral-100 px-2 py-1 font-mono text-[11px] font-semibold text-neutral-800">
                      {formatAdDimensions(slot.width, slot.height)}
                    </span>
                    <p className="text-on-surface-variant dark:text-forest-400 mt-1 text-[11px]">
                      {placementMeta.shortLabel}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <p className="text-navy dark:text-forest-50 text-xs font-bold tabular-nums">
                      {formatVnd(slot.pricePerWeek)}
                    </p>
                    <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-[11px]">per ISO week</p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-24 shrink-0">
                        <AdBannerPreviewFrame
                          compact
                          imageUrl={slot.houseImageUrl}
                          alt={`${slot.code} house ad`}
                          width={slot.width}
                          height={slot.height}
                          onInspect={slot.houseImageUrl ? () => onInspectHouseAd(slot) : undefined}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-on-surface dark:text-forest-200 text-[11px] font-medium">
                          {slot.houseImageUrl ? 'Configured' : 'No fallback'}
                        </p>
                        {slot.houseTargetUrl && (
                          <a
                            href={slot.houseTargetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary mt-0.5 inline-flex max-w-[110px] items-center gap-1 truncate text-[11px] hover:underline dark:text-emerald-400"
                            title={slot.houseTargetUrl}
                          >
                            <span className="truncate">{slot.houseTargetUrl}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        checked={slot.active}
                        disabled={isBusy}
                        ariaLabel={`Toggle sale status for ${slot.code}`}
                        onChange={() => onToggleSale(slot)}
                      />
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          slot.active
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                            : 'dark:bg-forest-850 dark:text-forest-300 bg-neutral-100 text-neutral-600',
                        )}
                      >
                        {slot.active ? 'On sale' : 'Paused'}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 pr-5 pl-4 text-right align-middle">
                    <Link
                      href={`${ROUTES.ADMIN_ADS_SLOTS}/${slot.id}/edit`}
                      className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 border-outline-variant text-navy hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>
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

'use client';

import AdBannerPreviewFrame from '@/components/admin/ads/AdBannerPreviewFrame';
import { Button } from '@/components/ui/Button';
import { AD_CREATIVE_STATUS_META, formatAdDimensions, formatIsoWeekRange } from '@/lib/admin-ads';
import { cn } from '@/lib/utils';
import type { AdminAdCreative } from '@/types/ads';
import { formatDateTime } from '@/utils/datetime';
import { Check, ExternalLink, Maximize2, X } from 'lucide-react';

interface AdminAdCreativesTableProps {
  creatives: AdminAdCreative[];
  busyCreativeId: number | null;
  onInspect: (creative: AdminAdCreative) => void;
  onApprove: (creative: AdminAdCreative) => void;
  onOpenReject: (creative: AdminAdCreative) => void;
}

export default function AdminAdCreativesTable({
  creatives,
  busyCreativeId,
  onInspect,
  onApprove,
  onOpenReject,
}: AdminAdCreativesTableProps) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant hidden overflow-hidden rounded-lg border bg-white shadow-xs lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/70 dark:text-forest-300 border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="w-48 px-5 py-3.5">Artwork preview</th>
              <th className="w-56 px-4 py-3.5">Slot &amp; booked week</th>
              <th className="px-4 py-3.5">Advertiser &amp; destination</th>
              <th className="w-52 px-4 py-3.5">Review status</th>
              <th className="w-52 py-3.5 pr-5 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-outline-variant divide-y">
            {creatives.map((creative) => {
              const statusMeta = AD_CREATIVE_STATUS_META[creative.status];
              const isBusy = busyCreativeId === creative.id;

              return (
                <tr
                  key={creative.id}
                  className="hover:bg-surface-container-low/70 dark:hover:bg-forest-850/60 transition-colors"
                >
                  <td className="px-5 py-4 align-middle">
                    <AdBannerPreviewFrame
                      imageUrl={creative.imageUrl}
                      alt={creative.altText || `${creative.slotCode} submission`}
                      width={creative.width}
                      height={creative.height}
                      onInspect={() => onInspect(creative)}
                    />
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-navy dark:text-forest-50 font-mono text-xs font-bold">
                        {creative.slotCode ?? '—'}
                      </span>
                      <span className="dark:bg-forest-850 dark:text-forest-200 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-neutral-700">
                        {formatAdDimensions(creative.width, creative.height)}
                      </span>
                    </div>
                    <p className="text-on-surface dark:text-forest-200 mt-1 text-xs font-medium">
                      {creative.slotName ?? 'Ad slot'}
                    </p>
                    <p className="text-on-surface-variant dark:text-forest-300 mt-1 text-[11px]">
                      {formatIsoWeekRange(creative.weekStart, creative.weekEnd)}
                    </p>
                    <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 font-mono text-[10px]">
                      Booking #{creative.bookingId}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <p className="text-navy dark:text-forest-50 text-xs font-semibold">
                      Company #{creative.companyId ?? '—'}
                    </p>
                    <a
                      href={creative.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary mt-1 inline-flex max-w-xs items-center gap-1 truncate text-xs font-medium hover:underline dark:text-emerald-400"
                      title={creative.targetUrl}
                    >
                      <span className="truncate">{creative.targetUrl}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {creative.altText && (
                      <p className="text-on-surface-variant dark:text-forest-300 mt-1 line-clamp-1 max-w-xs text-[11px]">
                        Alt: {creative.altText}
                      </p>
                    )}
                    <p className="text-on-surface-variant dark:text-forest-400 mt-1 text-[11px]">
                      Submitted {formatDateTime(creative.createdAt)}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                        statusMeta.pillClass,
                      )}
                    >
                      {statusMeta.label}
                    </span>

                    {creative.reviewedAt && (
                      <p className="text-on-surface-variant dark:text-forest-400 mt-1 text-[11px]">
                        Reviewed {formatDateTime(creative.reviewedAt)}
                      </p>
                    )}

                    {creative.status === 'REJECTED' && creative.rejectionReason && (
                      <p
                        title={creative.rejectionReason}
                        className="mt-1 line-clamp-2 max-w-[200px] text-[11px] font-medium text-rose-700 dark:text-rose-300"
                      >
                        {creative.rejectionReason}
                      </p>
                    )}
                  </td>

                  <td className="py-4 pr-5 pl-4 text-right align-middle">
                    <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onInspect(creative)}
                        aria-label={`Inspect ${creative.slotCode} artwork`}
                        className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 border-outline-variant text-navy hover:bg-surface-container-low inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition-colors"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>

                      {creative.status === 'PENDING' && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isBusy}
                            leftIcon={<X className="h-3.5 w-3.5" />}
                            onClick={() => onOpenReject(creative)}
                            className="h-8 border-rose-200 px-2.5 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/50"
                          >
                            Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            isLoading={isBusy}
                            leftIcon={<Check className="h-3.5 w-3.5" />}
                            onClick={() => onApprove(creative)}
                            className="h-8 px-2.5"
                          >
                            Approve
                          </Button>
                        </>
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

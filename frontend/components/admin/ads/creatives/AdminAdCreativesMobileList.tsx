'use client';

import AdBannerPreviewFrame from '@/components/admin/ads/AdBannerPreviewFrame';
import { Button } from '@/components/ui/Button';
import { AD_CREATIVE_STATUS_META, formatAdDimensions, formatIsoWeekRange } from '@/lib/admin-ads';
import { cn } from '@/lib/utils';
import type { AdminAdCreative } from '@/types/ads';
import { formatDateTime } from '@/utils/datetime';
import { Check, ExternalLink, X } from 'lucide-react';

interface AdminAdCreativesMobileListProps {
  creatives: AdminAdCreative[];
  busyCreativeId: number | null;
  onInspect: (creative: AdminAdCreative) => void;
  onApprove: (creative: AdminAdCreative) => void;
  onOpenReject: (creative: AdminAdCreative) => void;
}

export default function AdminAdCreativesMobileList({
  creatives,
  busyCreativeId,
  onInspect,
  onApprove,
  onOpenReject,
}: AdminAdCreativesMobileListProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {creatives.map((creative) => {
        const statusMeta = AD_CREATIVE_STATUS_META[creative.status];
        const isBusy = busyCreativeId === creative.id;

        return (
          <article
            key={creative.id}
            className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-4 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-navy dark:text-forest-50 font-mono text-sm font-bold">
                    {creative.slotCode ?? '—'}
                  </span>
                  <span className="dark:bg-forest-850 dark:text-forest-200 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                    {formatAdDimensions(creative.width, creative.height)}
                  </span>
                </div>
                <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                  {creative.slotName ?? 'Ad slot'} · Company #{creative.companyId ?? '—'}
                </p>
              </div>

              <span
                className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', statusMeta.pillClass)}
              >
                {statusMeta.label}
              </span>
            </div>

            <div className="mt-3">
              <AdBannerPreviewFrame
                imageUrl={creative.imageUrl}
                alt={creative.altText || `${creative.slotCode} submission`}
                width={creative.width}
                height={creative.height}
                onInspect={() => onInspect(creative)}
              />
            </div>

            <div className="dark:text-forest-300 text-on-surface-variant mt-3 space-y-1 text-xs">
              <p>{formatIsoWeekRange(creative.weekStart, creative.weekEnd)}</p>
              <a
                href={creative.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex max-w-full items-center gap-1 truncate font-medium hover:underline dark:text-emerald-400"
              >
                <span className="truncate">{creative.targetUrl}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <p className="text-[11px]">Submitted {formatDateTime(creative.createdAt)}</p>
            </div>

            {creative.status === 'REJECTED' && creative.rejectionReason && (
              <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
                Rejected: {creative.rejectionReason}
              </p>
            )}

            {creative.status === 'PENDING' && (
              <div className="dark:border-forest-800 border-outline-variant mt-3 flex items-center justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isBusy}
                  leftIcon={<X className="h-3.5 w-3.5" />}
                  onClick={() => onOpenReject(creative)}
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/50"
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  size="sm"
                  isLoading={isBusy}
                  leftIcon={<Check className="h-3.5 w-3.5" />}
                  onClick={() => onApprove(creative)}
                >
                  Approve
                </Button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

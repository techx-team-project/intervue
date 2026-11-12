'use client';

import { AD_CREATIVE_STATUS_TABS } from '@/lib/admin-ads';
import { cn } from '@/lib/utils';
import type { AdCreativeStatus } from '@/types/ads';

interface AdminAdCreativesFilterBarProps {
  status: AdCreativeStatus | '';
  pendingCount?: number;
  onStatusChange: (status: AdCreativeStatus | '') => void;
}

export default function AdminAdCreativesFilterBar({
  status,
  pendingCount,
  onStatusChange,
}: AdminAdCreativesFilterBarProps) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-3 shadow-2xs">
      <div role="tablist" aria-label="Filter artwork by review status" className="flex flex-wrap items-center gap-1.5">
        {AD_CREATIVE_STATUS_TABS.map((tab) => {
          const isActive = status === tab.value;
          const showPendingBadge = tab.value === 'PENDING' && pendingCount !== undefined && pendingCount > 0;

          return (
            <button
              key={tab.value || 'ALL'}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                isActive
                  ? 'bg-primary text-white shadow-2xs'
                  : 'dark:text-forest-200 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-low hover:text-navy',
              )}
            >
              <span>{tab.label}</span>
              {showPendingBadge && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
                  )}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="dark:text-forest-400 text-on-surface-variant text-xs">
        {status === 'PENDING'
          ? 'Sorted oldest first so waiting bookings are reviewed in order.'
          : 'Sorted newest submissions first.'}
      </p>
    </div>
  );
}

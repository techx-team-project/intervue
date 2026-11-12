'use client';

import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import {
  formatVnd,
  formatVoucherDiscount,
  formatVoucherWindowDate,
  getVoucherScheduleState,
  getVoucherTheme,
} from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import type { AdminVoucher } from '@/types/voucher';
import { SquarePen } from 'lucide-react';
import Link from 'next/link';

interface AdminVouchersMobileListProps {
  vouchers: AdminVoucher[];
  nowMs: number;
  busyVoucherId: number | null;
  onToggleStatus: (voucher: AdminVoucher) => void;
}

export default function AdminVouchersMobileList({
  vouchers,
  nowMs,
  busyVoucherId,
  onToggleStatus,
}: AdminVouchersMobileListProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {vouchers.map((voucher) => {
        const theme = getVoucherTheme(voucher.accentColor);
        const scheduleState = getVoucherScheduleState(voucher, nowMs);
        const isBusy = busyVoucherId === voucher.id;

        return (
          <article
            key={voucher.id}
            className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-4 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: theme.swatchHex }}
                  />
                  <Link
                    href={`${ROUTES.ADMIN_SERVICE_VOUCHERS}/${voucher.id}/edit`}
                    className="text-primary font-mono text-sm font-bold tracking-wide hover:underline dark:text-emerald-400"
                  >
                    {voucher.code}
                  </Link>
                  {voucher.ribbonLabel && (
                    <span className="dark:bg-forest-850 dark:text-forest-200 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-700 uppercase">
                      {voucher.ribbonLabel}
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant dark:text-forest-300 mt-1 text-xs">{voucher.label}</p>
              </div>

              <span
                className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', scheduleState.pillClass)}
              >
                {scheduleState.label}
              </span>
            </div>

            <div className="dark:text-forest-300 text-on-surface-variant mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-on-surface dark:text-forest-100 font-semibold">{formatVoucherDiscount(voucher)}</p>
                <p className="mt-0.5 text-[11px]">
                  Min: {voucher.minOrderValue > 0 ? formatVnd(voucher.minOrderValue) : 'None'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">
                  {voucher.usedCount}
                  {voucher.usageLimit !== null ? ` / ${voucher.usageLimit}` : ''} used
                </p>
                <p className="mt-0.5 text-[11px]">
                  {voucher.applicablePackages.length === 0
                    ? 'All packages'
                    : `${voucher.applicablePackages.length} packages`}
                </p>
              </div>
            </div>

            <p className="dark:text-forest-400 text-on-surface-variant mt-2 text-[11px]">
              {voucher.startsAt || voucher.endsAt
                ? `${voucher.startsAt ? formatVoucherWindowDate(voucher.startsAt) : '—'} → ${voucher.endsAt ? formatVoucherWindowDate(voucher.endsAt) : '—'}`
                : 'Always on'}
              {' · '}
              {voucher.conditions.length} {voucher.conditions.length === 1 ? 'condition' : 'conditions'}
            </p>

            <div className="dark:border-forest-800 border-outline-variant mt-3 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={voucher.status === 'ACTIVE'}
                  disabled={isBusy}
                  onChange={() => onToggleStatus(voucher)}
                  aria-label={`Toggle ${voucher.code} active status`}
                />
                <span className="text-on-surface-variant dark:text-forest-300 text-xs font-medium">
                  {voucher.status === 'ACTIVE' ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <Link
                href={`${ROUTES.ADMIN_SERVICE_VOUCHERS}/${voucher.id}/edit`}
                className="text-primary inline-flex items-center gap-1 text-xs font-bold hover:underline dark:text-emerald-400"
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

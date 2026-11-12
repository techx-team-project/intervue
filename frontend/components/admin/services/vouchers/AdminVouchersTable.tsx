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

interface AdminVouchersTableProps {
  vouchers: AdminVoucher[];
  nowMs: number;
  busyVoucherId: number | null;
  onToggleStatus: (voucher: AdminVoucher) => void;
}

export default function AdminVouchersTable({
  vouchers,
  nowMs,
  busyVoucherId,
  onToggleStatus,
}: AdminVouchersTableProps) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant hidden overflow-hidden rounded-lg border bg-white shadow-xs lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/70 dark:text-forest-300 border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="px-5 py-3.5">Voucher</th>
              <th className="w-56 px-4 py-3.5">Discount</th>
              <th className="w-44 px-4 py-3.5">Scope</th>
              <th className="w-52 px-4 py-3.5">Window &amp; Usage</th>
              <th className="w-44 px-4 py-3.5">Status</th>
              <th className="w-24 py-3.5 pr-5 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-outline-variant divide-y">
            {vouchers.map((voucher) => {
              const theme = getVoucherTheme(voucher.accentColor);
              const scheduleState = getVoucherScheduleState(voucher, nowMs);
              const isBusy = busyVoucherId === voucher.id;

              return (
                <tr
                  key={voucher.id}
                  className="hover:bg-surface-container-low/70 dark:hover:bg-forest-850/60 transition-colors"
                >
                  <td className="px-5 py-4 align-middle">
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
                        <span className="dark:bg-forest-850 dark:text-forest-200 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-neutral-700 uppercase">
                          {voucher.ribbonLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant dark:text-forest-300 mt-1 line-clamp-1 max-w-md text-xs">
                      {voucher.label}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <p className="text-on-surface dark:text-forest-50 text-xs font-bold">
                      {formatVoucherDiscount(voucher)}
                    </p>
                    <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-[11px]">
                      Min order: {voucher.minOrderValue > 0 ? formatVnd(voucher.minOrderValue) : 'None'}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    {voucher.applicablePackages.length === 0 ? (
                      <span className="dark:bg-forest-850 dark:text-forest-100 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        All packages
                      </span>
                    ) : (
                      <span
                        title={voucher.applicablePackages.map((pkg) => pkg.name).join(', ')}
                        className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
                      >
                        {voucher.applicablePackages.length}{' '}
                        {voucher.applicablePackages.length === 1 ? 'package' : 'packages'}
                      </span>
                    )}
                    <p className="text-on-surface-variant dark:text-forest-300 mt-1 text-[11px]">
                      {voucher.conditions.length} {voucher.conditions.length === 1 ? 'condition' : 'conditions'}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <p className="text-on-surface dark:text-forest-100 text-xs font-medium">
                      {voucher.startsAt || voucher.endsAt
                        ? `${voucher.startsAt ? formatVoucherWindowDate(voucher.startsAt) : '—'} → ${voucher.endsAt ? formatVoucherWindowDate(voucher.endsAt) : '—'}`
                        : 'Always on'}
                    </p>
                    <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-[11px] tabular-nums">
                      Used: {voucher.usedCount}
                      {voucher.usageLimit !== null ? ` / ${voucher.usageLimit}` : ' (unlimited)'}
                      {voucher.perCompanyLimit !== null ? ` · ${voucher.perCompanyLimit}/company` : ''}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-2.5">
                      <Switch
                        checked={voucher.status === 'ACTIVE'}
                        disabled={isBusy}
                        onChange={() => onToggleStatus(voucher)}
                        aria-label={`Toggle ${voucher.code} active status`}
                      />
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          scheduleState.pillClass,
                        )}
                      >
                        {scheduleState.label}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 pr-5 pl-4 text-right align-middle">
                    <Link
                      href={`${ROUTES.ADMIN_SERVICE_VOUCHERS}/${voucher.id}/edit`}
                      aria-label={`Edit ${voucher.code}`}
                      title={`Edit ${voucher.code}`}
                      className="text-on-surface-variant hover:bg-surface-container-low hover:text-navy dark:text-forest-300 dark:hover:bg-forest-850 dark:hover:text-forest-50 inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                    >
                      <SquarePen className="h-4 w-4" />
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

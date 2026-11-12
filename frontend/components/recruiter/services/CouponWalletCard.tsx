'use client';

import { ROUTES } from '@/constants/routes';
import {
  formatVnd,
  formatVoucherCountdownVi,
  getVoucherRibbonText,
  getVoucherTheme,
  resolveVoucherDisplayConditions,
} from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import type { AvailableVoucher, UsedVoucher, VoucherAccentColor, VoucherPackageSummary } from '@/types/voucher';
import { Check, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface CouponWalletCardData {
  code: string;
  label: string;
  description?: string | null;
  ribbonLabel?: string | null;
  accentColor?: VoucherAccentColor | null;
  conditions?: string[] | null;
  applicablePackages?: VoucherPackageSummary[] | null;
  minOrderValue?: number;
  maxDiscount?: number | null;
  perCompanyLimit?: number | null;
  endsAt?: string | null;
  orderCode?: string;
  discountAmount?: number;
  usedAt?: string;
}

interface CouponWalletCardProps {
  voucher: CouponWalletCardData;
  variant?: 'available' | 'used';
  nowMs?: number;
  ctaHref?: string;
  isPreview?: boolean;
  hideTooltip?: boolean;
  className?: string;
}

export function availableToCouponCardData(voucher: AvailableVoucher): CouponWalletCardData {
  return {
    code: voucher.code,
    label: voucher.label,
    description: voucher.description,
    ribbonLabel: voucher.ribbonLabel,
    accentColor: voucher.accentColor,
    conditions: voucher.conditions,
    applicablePackages: voucher.applicablePackages,
    minOrderValue: voucher.minOrderValue,
    maxDiscount: voucher.maxDiscount,
    perCompanyLimit: voucher.perCompanyLimit,
    endsAt: voucher.endsAt,
  };
}

export function usedToCouponCardData(voucher: UsedVoucher): CouponWalletCardData {
  return {
    code: voucher.code,
    label: voucher.label,
    description: voucher.description,
    ribbonLabel: voucher.ribbonLabel,
    accentColor: voucher.accentColor,
    conditions: voucher.conditions,
    applicablePackages: voucher.applicablePackages,
    minOrderValue: voucher.minOrderValue,
    maxDiscount: voucher.maxDiscount,
    orderCode: voucher.orderCode,
    discountAmount: voucher.discountAmount,
    usedAt: voucher.usedAt,
  };
}

export default function CouponWalletCard({
  voucher,
  variant = 'available',
  nowMs = 0,
  ctaHref = ROUTES.RECRUITER_SERVICES,
  isPreview = false,
  hideTooltip = false,
  className,
}: CouponWalletCardProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const clipId = `coupon-clip-${rawId}`;
  const maskId = `coupon-mask-${rawId}`;

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  const theme = getVoucherTheme(voucher.accentColor);
  const ribbonText = getVoucherRibbonText(voucher.ribbonLabel, voucher.applicablePackages);
  const countdown = variant === 'available' ? formatVoucherCountdownVi(voucher.endsAt ?? null, nowMs) : null;
  const conditions = resolveVoucherDisplayConditions(voucher);
  const strokeHex = variant === 'used' ? '#cbd5e1' : theme.notchStrokeHex;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard?.writeText(voucher.code);
    } catch {
      // Clipboard may fail in sandboxed iframes; toast still communicates copy success.
    }
    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopied(false), 1800);
    if (!isPreview) {
      toast.success(`Copied code ${voucher.code}.`);
    }
  };

  return (
    <div className={cn('group/coupon relative', className)}>
      {/* Hover condition tooltip (TopCV style) */}
      {!hideTooltip && conditions.length > 0 && (
        <div
          role="tooltip"
          className="pointer-events-none invisible absolute bottom-[calc(100%+10px)] left-1/2 z-40 w-[min(340px,calc(100vw-2.5rem))] -translate-x-1/2 translate-y-1 rounded-xl bg-[#243242] p-4 text-white opacity-0 shadow-xl transition-all duration-150 group-focus-within/coupon:visible group-focus-within/coupon:translate-y-0 group-focus-within/coupon:opacity-100 group-hover/coupon:visible group-hover/coupon:translate-y-0 group-hover/coupon:opacity-100"
        >
          <p className="mb-2.5 text-[13px] font-bold text-white">Terms and conditions:</p>
          <ul className="space-y-2">
            {conditions.map((condition, index) => (
              <li
                key={`${condition}-${index}`}
                className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-100"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
          <span
            aria-hidden
            className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-[#243242]"
          />
        </div>
      )}

      {/* Masked ticket frame */}
      <div className="relative flex min-h-[144px] transition-transform duration-150 group-hover/coupon:-translate-y-0.5">
        <svg aria-hidden className="drop-shadow-2xs pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
            </clipPath>
            <mask id={maskId}>
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <circle cx="0" cy="50%" r="6.5" fill="black" />
              <circle cx="100%" cy="50%" r="6.5" fill="black" />
            </mask>
          </defs>
          <g clipPath={`url(#${clipId})`} mask={`url(#${maskId})`}>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx="4"
              ry="4"
              strokeWidth="2"
              className="dark:fill-forest-900 dark:stroke-forest-700 fill-white stroke-[#e5e7eb] transition-colors duration-150"
            />
            {variant === 'available' && (
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="4"
                ry="4"
                fill="none"
                stroke={strokeHex}
                strokeWidth="2.5"
                className="opacity-0 transition-opacity duration-150 group-hover/coupon:opacity-100"
              />
            )}
            <circle
              cx="0"
              cy="50%"
              r="6.5"
              fill="none"
              strokeWidth="1.5"
              className="dark:stroke-forest-700 stroke-[#e5e7eb]"
            />
            <circle
              cx="100%"
              cy="50%"
              r="6.5"
              fill="none"
              strokeWidth="1.5"
              className="dark:stroke-forest-700 stroke-[#e5e7eb]"
            />
            {variant === 'available' && (
              <circle
                cx="100%"
                cy="50%"
                r="6.5"
                fill="none"
                stroke={strokeHex}
                strokeWidth="1.75"
                className="opacity-0 transition-opacity duration-150 group-hover/coupon:opacity-100"
              />
            )}
          </g>
        </svg>

        {/* Left vertical ribbon */}
        <div
          className={cn(
            'relative z-10 flex w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-l-[4px]',
            variant === 'used' ? 'bg-slate-400 dark:bg-slate-700' : theme.ribbonBgClass,
          )}
          style={{
            maskImage: 'radial-gradient(circle 6.5px at 0 50%, transparent 6.5px, black 7px)',
            WebkitMaskImage: 'radial-gradient(circle 6.5px at 0 50%, transparent 6.5px, black 7px)',
          }}
        >
          <span className="-rotate-90 text-[11px] font-extrabold tracking-wider whitespace-nowrap text-white uppercase select-none">
            {ribbonText}
          </span>
        </div>

        {/* Ticket right body */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between px-4 py-4 pr-5">
          <div>
            <p
              title={voucher.label}
              className={cn(
                'line-clamp-2 text-[15px] leading-snug font-bold',
                variant === 'used' ? 'text-slate-600 dark:text-slate-300' : theme.headlineTextClass,
              )}
            >
              {voucher.label || 'InterVue service offer'}
            </p>

            {variant === 'available' ? (
              <p className="dark:text-forest-300 mt-2 text-[12px] text-slate-600 tabular-nums">
                {countdown ? `Time left: ${countdown}` : voucher.endsAt ? 'Expiring soon' : 'Validity: No time limit'}
              </p>
            ) : (
              <p className="dark:text-forest-300 mt-2 truncate text-[12px] text-slate-500">
                {voucher.usedAt ? `Used ${new Date(voucher.usedAt).toLocaleDateString('vi-VN')}` : 'Used'}
                {voucher.orderCode ? ` · Order #${voucher.orderCode}` : ''}
                {typeof voucher.discountAmount === 'number' ? ` · Discount ${formatVnd(voucher.discountAmount)}` : ''}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => void handleCopyCode()}
              title="Click to copy the offer code"
              className={cn(
                'inline-flex max-w-[144px] cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-[12px] font-bold tracking-wide transition hover:brightness-95',
                variant === 'used'
                  ? 'dark:bg-forest-850 dark:text-forest-300 bg-slate-100 text-slate-600'
                  : cn(theme.codePillBgClass, theme.codePillTextClass),
              )}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
              ) : (
                <Copy className="h-3 w-3 shrink-0 opacity-70" />
              )}
              <span className="truncate font-mono">{copied ? 'Copied' : voucher.code || 'CODE'}</span>
            </button>

            {variant === 'available' ? (
              isPreview ? (
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center justify-center rounded-[4px] px-4 py-1.5 text-[12px] font-bold text-white shadow-2xs',
                    theme.buttonBgClass,
                  )}
                >
                  Use now
                </span>
              ) : (
                <Link
                  href={ctaHref}
                  className={cn(
                    'inline-flex shrink-0 items-center justify-center rounded-[4px] px-4 py-1.5 text-[12px] font-bold text-white shadow-2xs transition active:scale-[0.98]',
                    theme.buttonBgClass,
                  )}
                >
                  Use now
                </Link>
              )
            ) : (
              <span className="dark:bg-forest-850 dark:text-forest-300 inline-flex shrink-0 items-center justify-center rounded-[4px] bg-slate-200 px-3.5 py-1.5 text-[12px] font-semibold text-slate-600">
                Used
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

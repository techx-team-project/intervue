'use client';

import VoucherTicketCard, {
  ScallopedPercentBadge,
  renderHighlightedVoucherLabel,
} from '@/components/recruiter/services/VoucherTicketCard';
import { cn } from '@/lib/utils';
import type { AvailableVoucher } from '@/types/voucher';
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

interface ServicePackageVouchersCardProps {
  vouchers: AvailableVoucher[];
}

function subscribeMinuteTick(callback: () => void) {
  const timer = window.setInterval(callback, 30_000);
  return () => {
    window.clearInterval(timer);
  };
}

function getMinuteSnapshot(): number {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

function getServerMinuteSnapshot(): number {
  return 0;
}

function formatCountdown(endsAtIso: string | null, nowMs: number): string | null {
  if (!endsAtIso || nowMs === 0) return null;
  const diffMs = Date.parse(endsAtIso) - nowMs;
  if (!Number.isFinite(diffMs) || diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${days} ngày : ${pad(hours)} giờ : ${pad(minutes)} phút`;
}

function nearestExpiryIso(vouchers: AvailableVoucher[], nowMs: number): string | null {
  if (nowMs === 0) return null;
  let bestIso: string | null = null;
  let bestMs = Infinity;
  for (const voucher of vouchers) {
    if (!voucher.endsAt) continue;
    const ms = Date.parse(voucher.endsAt);
    if (Number.isFinite(ms) && ms > nowMs && ms < bestMs) {
      bestMs = ms;
      bestIso = voucher.endsAt;
    }
  }
  return bestIso;
}

function buildVoucherTooltip(voucher: AvailableVoucher): string {
  const parts = [`Mã ưu đãi: ${voucher.code}`];
  if (voucher.minOrderValue > 0) {
    parts.push(`Đơn tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ`);
  }
  if (voucher.maxDiscount) {
    parts.push(`Giảm tối đa ${voucher.maxDiscount.toLocaleString('vi-VN')}đ`);
  }
  if (voucher.description) {
    parts.push(voucher.description);
  }
  parts.push('Nhấn để sao chép mã');
  return parts.join(' · ');
}

export default function ServicePackageVouchersCard({ vouchers }: ServicePackageVouchersCardProps) {
  const nowMs = useSyncExternalStore(subscribeMinuteTick, getMinuteSnapshot, getServerMinuteSnapshot);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  if (vouchers.length === 0) {
    return null;
  }

  const countdown = formatCountdown(nearestExpiryIso(vouchers, nowMs), nowMs);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard?.writeText(code);
    } catch {
      // Clipboard API may be unavailable in restricted contexts; toast still surfaces the code.
    }
    setCopiedCode(code);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopiedCode(null), 2000);
    toast.success(`Đã sao chép mã ưu đãi ${code}. Dùng mã này tại bước Giỏ hàng / Thanh toán.`);
  };

  return (
    <section aria-label="Ưu đãi khuyến mãi">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-on-surface border-l-[3px] border-[#00b14f] pl-2.5 text-[15px] leading-tight font-bold">
          Ưu đãi khuyến mãi
        </h3>
        {countdown && (
          <span
            suppressHydrationWarning
            className="rounded-full border border-[#ef4444]/85 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#ef4444] tabular-nums"
          >
            {countdown}
          </span>
        )}
      </div>

      <div className="mt-3.5 max-h-[252px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] space-y-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {vouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code;
          return (
            <VoucherTicketCard
              key={voucher.code}
              onClick={() => void handleCopyCode(voucher.code)}
              title={buildVoucherTooltip(voucher)}
              active={isCopied}
            >
              <ScallopedPercentBadge />
              <span className="min-w-0 flex-1 text-[13px] leading-snug font-medium text-[#009944]">
                {renderHighlightedVoucherLabel(voucher.label)}
              </span>

              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-y-0 right-0 flex items-center pl-8 transition-opacity duration-150',
                  isCopied
                    ? 'bg-[linear-gradient(90deg,transparent_0%,#dcfce7_35%,#dcfce7_100%)] opacity-100'
                    : 'bg-[linear-gradient(90deg,transparent_0%,#e4faed_35%,#e4faed_100%)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                )}
              >
                <span className="inline-flex items-center gap-1 rounded-full border border-[#00b14f]/40 bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#009944] shadow-2xs">
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 stroke-[2.5]" />
                      Đã chép
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {voucher.code}
                    </>
                  )}
                </span>
              </span>
            </VoucherTicketCard>
          );
        })}
      </div>
    </section>
  );
}

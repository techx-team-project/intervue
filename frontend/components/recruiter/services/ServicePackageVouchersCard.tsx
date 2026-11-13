'use client';

import VoucherTicketCard, {
  ScallopedPercentBadge,
  renderHighlightedVoucherLabel,
} from '@/components/recruiter/services/VoucherTicketCard';
import {
  formatVoucherCountdownVi,
  getVoucherTickServerSnapshot,
  getVoucherTickSnapshot,
  resolveVoucherDisplayConditions,
  subscribeVoucherTick,
} from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import type { AvailableVoucher } from '@/types/voucher';
import { Check, CheckCircle2, ChevronDown, Copy } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

interface ServicePackageVouchersCardProps {
  vouchers: AvailableVoucher[];
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

export default function ServicePackageVouchersCard({ vouchers }: ServicePackageVouchersCardProps) {
  const nowMs = useSyncExternalStore(subscribeVoucherTick, getVoucherTickSnapshot, getVoucherTickServerSnapshot);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
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

  const countdown = formatVoucherCountdownVi(nearestExpiryIso(vouchers, nowMs), nowMs);

  const toggleExpanded = (code: string) => {
    setExpandedCode((current) => (current === code ? null : code));
  };

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
    toast.success(`Copied offer code ${code}. Use it at the Cart / Checkout step.`);
  };

  return (
    <section aria-label="Promotions">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-on-surface border-l-[3px] border-[#00b14f] pl-2.5 text-[15px] leading-tight font-bold">
          Promotions
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

      <div className="mt-3.5 max-h-[420px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] space-y-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {vouchers.map((voucher) => {
          const isExpanded = expandedCode === voucher.code;
          const isCopied = copiedCode === voucher.code;
          const conditions = resolveVoucherDisplayConditions(voucher);
          const itemCountdown = formatVoucherCountdownVi(voucher.endsAt, nowMs);

          return (
            <div key={voucher.code} className="space-y-0">
              <VoucherTicketCard
                onClick={() => toggleExpanded(voucher.code)}
                expanded={isExpanded}
                ariaExpanded={isExpanded}
              >
                <ScallopedPercentBadge />
                <span className="min-w-0 flex-1 text-[13.5px] leading-snug font-medium text-[#009944]">
                  {renderHighlightedVoucherLabel(voucher.label)}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'h-4 w-4 shrink-0 text-[#009944] transition-transform duration-200',
                    isExpanded && 'rotate-180',
                  )}
                />
              </VoucherTicketCard>

              {isExpanded && (
                <div className="mt-1.5 rounded-lg border border-[#00b14f]/40 bg-[#f7fef9] px-4 py-3.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-slate-800">Terms and conditions:</p>
                    {itemCountdown && (
                      <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                        {itemCountdown} left
                      </span>
                    )}
                  </div>

                  <ul className="mt-2.5 space-y-2">
                    {conditions.map((condition, index) => (
                      <li
                        key={`${voucher.code}-cond-${index}`}
                        className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#00b14f]/15 pt-2.5">
                    <span className="text-xs text-slate-600">
                      Code:{' '}
                      <code className="rounded bg-[#dcfce7] px-2 py-0.5 font-mono font-bold text-[#00823a]">
                        {voucher.code}
                      </code>
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopyCode(voucher.code)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#00b14f]/35 bg-white px-2.5 py-1 text-xs font-bold text-[#009944] transition hover:bg-[#ecfdf3]"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

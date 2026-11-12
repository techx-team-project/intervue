'use client';

import { formatRemaining, useCountdown } from '@/hooks/useCountdown';
import { useOrderPayment } from '@/hooks/useRecruiterOrders';
import type { RecruiterOrderStatus } from '@/types/recruiter-order';
import { formatServicePrice } from '@/utils/service-package';
import { CheckCircle2, Clock, Copy, Info } from 'lucide-react';
import { useState } from 'react';

interface OrderPaymentPanelProps {
  code: string;
  status: RecruiterOrderStatus;
}

const LIVE_STATUSES: RecruiterOrderStatus[] = ['PENDING_PAYMENT', 'UNDERPAID'];

export default function OrderPaymentPanel({ code, status }: OrderPaymentPanelProps) {
  const live = LIVE_STATUSES.includes(status);
  const { data } = useOrderPayment(code, live);
  const remaining = useCountdown(live ? (data?.expiresAt ?? null) : null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!data) return null;

  const copy = async (field: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (data.status === 'PAID' || data.status === 'FULFILLED') {
    const overpaid = data.paidAmount - data.totalAmount;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3.5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-900">
            Received {formatServicePrice(data.paidAmount, data.currency)}. This order has been paid.
          </p>
        </div>
        {overpaid > 0 && (
          <div className="flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-900">
              You overpaid by {formatServicePrice(overpaid, data.currency)}. The excess is not credited to your account
              automatically — please contact InterVue for a refund.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!live) return null;

  if (!data.configured) {
    return (
      <div className="flex gap-3 rounded-lg border-l-4 border-sky-500 bg-sky-50 px-4 py-3.5">
        <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-600" />
        <p className="text-on-surface-variant text-sm leading-relaxed">
          The payment gateway is not configured. Please contact InterVue for bank transfer instructions.
        </p>
      </div>
    );
  }

  const remainingAmount = Math.max(0, data.totalAmount - data.paidAmount);

  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-on-surface text-base font-bold">Transfer to complete payment</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Auto-updating
          </span>
        </div>
        {remaining !== null && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 px-3 py-1 text-xs font-bold text-rose-600">
            <Clock className="h-3.5 w-3.5" />
            {formatRemaining(remaining)}
          </span>
        )}
      </div>

      {data.status === 'UNDERPAID' && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
          Received {formatServicePrice(data.paidAmount, data.currency)}. Please transfer the remaining{' '}
          {formatServicePrice(remainingAmount, data.currency)} using the same transfer content below.
        </p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-[200px_minmax(0,1fr)]">
        {data.qrUrl && (
          <div className="border-outline-variant mx-auto rounded-xl border p-2">
            {/* Remote QR host is not in next.config images.remotePatterns, so this stays a plain img */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.qrUrl} alt={`Payment QR code for order ${data.orderCode}`} className="h-44 w-44" />
          </div>
        )}

        <dl className="divide-outline-variant divide-y text-sm">
          <Row label="Bank" value={data.bankCode ?? '—'} />
          <Row
            label="Account number"
            value={data.accountNumber ?? '—'}
            onCopy={() => copy('acc', data.accountNumber ?? '')}
            copied={copied === 'acc'}
            mono
          />
          <Row label="Account holder" value={data.accountName ?? '—'} />
          <Row label="Amount" value={formatServicePrice(remainingAmount, data.currency)} highlight />
          <Row
            label="Transfer content"
            value={data.transferContent}
            onCopy={() => copy('content', data.transferContent)}
            copied={copied === 'content'}
            mono
          />
        </dl>
      </div>

      <p className="text-on-surface-variant mt-4 text-xs leading-relaxed">
        Scanning the QR code is the most reliable option. If you enter it manually, keep the transfer content above
        <strong>exactly as shown</strong> — a single missing character means the bank will not report the payment and
        the order will not update. The order status updates automatically within seconds without refreshing once the
        bank records the payment.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="flex items-center gap-2">
        <span
          className={`font-bold ${mono ? 'font-mono' : ''} ${highlight ? 'text-primary text-base' : 'text-on-surface'}`}
        >
          {value}
        </span>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="text-outline hover:text-primary cursor-pointer transition"
            aria-label={`Copy ${label}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
        {copied && <span className="text-xs font-semibold text-emerald-600">Copied</span>}
      </dd>
    </div>
  );
}

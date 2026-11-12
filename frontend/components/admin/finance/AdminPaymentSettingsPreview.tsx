'use client';

import { formatVnd } from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import {
  buildSepayPreviewQrUrl,
  formatSampleOrderCode,
  formatSampleTransferContent,
  resolveTransferKeyword,
} from '@/schemas/payment-settings.schema';
import { formatDateTime } from '@/utils/datetime';
import { CheckCircle2, QrCode, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface AdminPaymentSettingsPreviewProps {
  vatPercent: string;
  orderExpireHours: string;
  orderCodePrefix: string;
  maxPendingOrders: string;
  bankCode: string;
  bankName?: string;
  bankContentKeyword?: string | null;
  bankAccountNumber: string;
  bankAccountName: string;
  paymentSyncEnabled: boolean;
  apiTokenConfigured: boolean;
  paymentSyncSince: string | null;
}

const SAMPLE_SUBTOTAL = 1_000_000;

export default function AdminPaymentSettingsPreview({
  vatPercent,
  orderExpireHours,
  orderCodePrefix,
  maxPendingOrders,
  bankCode,
  bankName,
  bankContentKeyword,
  bankAccountNumber,
  bankAccountName,
  paymentSyncEnabled,
  apiTokenConfigured,
  paymentSyncSince,
}: AdminPaymentSettingsPreviewProps) {
  const [failedQrUrl, setFailedQrUrl] = useState<string | null>(null);

  const parsedVat = Number(vatPercent);
  const safeVatPercent = Number.isFinite(parsedVat) && parsedVat >= 0 && parsedVat <= 100 ? parsedVat : 0;
  const sampleVatAmount = Math.round((SAMPLE_SUBTOTAL * safeVatPercent) / 100);
  const sampleTotal = SAMPLE_SUBTOTAL + sampleVatAmount;

  const cleanBank = bankCode.trim();
  const cleanAccount = bankAccountNumber.replace(/\s+/g, '');
  const cleanHolder = bankAccountName.trim();
  const isBankConfigured = Boolean(cleanBank && cleanAccount);
  const transferKeyword = resolveTransferKeyword(cleanBank, bankContentKeyword);

  const sampleOrderCode = formatSampleOrderCode(orderCodePrefix);
  const sampleTransferContent = formatSampleTransferContent(cleanBank, orderCodePrefix, transferKeyword);
  const qrUrl = isBankConfigured
    ? buildSepayPreviewQrUrl({
        bankCode: cleanBank,
        bankAccountNumber: cleanAccount,
        amount: sampleTotal,
        transferContent: sampleTransferContent,
      })
    : null;
  const qrFailed = qrUrl !== null && failedQrUrl === qrUrl;

  const parsedExpire = Number(orderExpireHours);
  const parsedMaxPending = Number(maxPendingOrders);

  return (
    <aside className="xl:col-span-4">
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant sticky top-36 space-y-4 rounded-xl border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <QrCode className="text-primary h-4 w-4" />
            <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Live VietQR &amp; SePay preview</h2>
          </div>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
              isBankConfigured
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
            )}
          >
            {isBankConfigured ? 'QR ready' : 'Bank not set'}
          </span>
        </div>

        <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/50 rounded-xl border p-4">
          {qrUrl && !qrFailed ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="border-outline-variant overflow-hidden rounded-xl border bg-white p-2 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`Sample VietQR for ${cleanBank}`}
                  onError={() => setFailedQrUrl(qrUrl)}
                  className="h-36 w-36 object-contain"
                />
              </div>
              <div className="w-full space-y-1 text-xs">
                <p className="text-navy dark:text-forest-50 font-semibold">
                  {cleanBank}
                  {bankName ? ` · ${bankName}` : ''}
                </p>
                <p className="text-on-surface-variant dark:text-forest-300 font-mono">{cleanAccount}</p>
                {cleanHolder && (
                  <p className="text-on-surface-variant dark:text-forest-200 font-medium">{cleanHolder}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-5 text-center">
              <div className="dark:bg-forest-850 text-outline flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs">
                {qrFailed ? <ShieldAlert className="h-5 w-5 text-amber-500" /> : <QrCode className="h-5 w-5" />}
              </div>
              <p className="text-navy dark:text-forest-100 text-xs font-semibold">
                {qrFailed ? 'Could not load VietQR preview' : 'No receiving bank configured yet'}
              </p>
              <p className="text-on-surface-variant dark:text-forest-400 max-w-60 text-[11px] leading-relaxed">
                {qrFailed
                  ? 'Verify the bank code and account number or check qr.sepay.vn reachability.'
                  : 'Select a bank and enter your SePay account number to preview the QR code shown on recruiter orders.'}
              </p>
            </div>
          )}
        </div>

        <dl className="dark:divide-forest-800 divide-outline-variant divide-y text-xs">
          <div className="flex items-start justify-between gap-3 py-2.5">
            <dt className="text-on-surface-variant dark:text-forest-300 shrink-0">Transfer note</dt>
            <dd className="text-right">
              <span className="dark:bg-forest-850 dark:text-forest-100 inline-block rounded bg-neutral-100 px-2 py-0.5 font-mono font-bold text-neutral-800">
                {sampleTransferContent}
              </span>
              {transferKeyword && (
                <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                  Auto-prefixed with {transferKeyword} for {cleanBank || bankName || 'this bank'}
                </p>
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-on-surface-variant dark:text-forest-300">Sample order code</dt>
            <dd className="text-navy dark:text-forest-50 font-mono font-semibold">{sampleOrderCode}</dd>
          </div>

          <div className="flex items-start justify-between gap-3 py-2.5">
            <dt className="text-on-surface-variant dark:text-forest-300">Sample 1,000,000 ₫</dt>
            <dd className="text-right">
              <span className="text-primary font-bold tabular-nums dark:text-emerald-400">
                {formatVnd(sampleTotal)}
              </span>
              <p className="text-on-surface-variant dark:text-forest-400 text-[11px] tabular-nums">
                incl. {safeVatPercent}% VAT ({formatVnd(sampleVatAmount)})
              </p>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-on-surface-variant dark:text-forest-300">Order limits</dt>
            <dd className="text-navy dark:text-forest-100 font-medium tabular-nums">
              {Number.isFinite(parsedExpire) && parsedExpire > 0 ? `${parsedExpire}h` : '—'} · max{' '}
              {Number.isFinite(parsedMaxPending) && parsedMaxPending > 0 ? parsedMaxPending : '—'} unpaid
            </dd>
          </div>

          <div className="flex items-start justify-between gap-3 py-2.5">
            <dt className="text-on-surface-variant dark:text-forest-300 shrink-0">Reconciliation</dt>
            <dd className="text-right">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  paymentSyncEnabled && apiTokenConfigured && isBankConfigured
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                    : 'dark:bg-forest-850 dark:text-forest-300 bg-neutral-100 text-neutral-600',
                )}
              >
                {paymentSyncEnabled && apiTokenConfigured && isBankConfigured && <CheckCircle2 className="h-3 w-3" />}
                <span>{paymentSyncEnabled ? 'Scheduled every 2 min' : 'Manual only'}</span>
              </span>
              {paymentSyncSince && (
                <p className="text-on-surface-variant dark:text-forest-400 mt-1 text-[11px]">
                  Since {formatDateTime(paymentSyncSince)}
                </p>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

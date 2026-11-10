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
    return (
      <div className="flex items-center gap-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3.5">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-sm font-semibold text-emerald-900">
          Đã nhận {formatServicePrice(data.paidAmount, data.currency)}. Đơn hàng đã được thanh toán.
        </p>
      </div>
    );
  }

  if (!live) return null;

  if (!data.configured) {
    return (
      <div className="flex gap-3 rounded-lg border-l-4 border-sky-500 bg-sky-50 px-4 py-3.5">
        <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-600" />
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Cổng thanh toán chưa được cấu hình. Vui lòng liên hệ InterVue để được hướng dẫn chuyển khoản.
        </p>
      </div>
    );
  }

  const remainingAmount = Math.max(0, data.totalAmount - data.paidAmount);

  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-on-surface text-base font-bold">Chuyển khoản để hoàn tất</h2>
        {remaining !== null && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 px-3 py-1 text-xs font-bold text-rose-600">
            <Clock className="h-3.5 w-3.5" />
            {formatRemaining(remaining)}
          </span>
        )}
      </div>

      {data.status === 'UNDERPAID' && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
          Đã nhận {formatServicePrice(data.paidAmount, data.currency)}. Vui lòng chuyển bổ sung{' '}
          {formatServicePrice(remainingAmount, data.currency)} với cùng nội dung bên dưới.
        </p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-[200px_minmax(0,1fr)]">
        {data.qrUrl && (
          <div className="border-outline-variant mx-auto rounded-xl border p-2">
            {/* Remote QR host is not in next.config images.remotePatterns, so this stays a plain img */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.qrUrl} alt={`Mã QR thanh toán đơn ${data.orderCode}`} className="h-44 w-44" />
          </div>
        )}

        <dl className="divide-outline-variant divide-y text-sm">
          <Row label="Ngân hàng" value={data.bankCode ?? '—'} />
          <Row
            label="Số tài khoản"
            value={data.accountNumber ?? '—'}
            onCopy={() => copy('acc', data.accountNumber ?? '')}
            copied={copied === 'acc'}
            mono
          />
          <Row label="Chủ tài khoản" value={data.accountName ?? '—'} />
          <Row label="Số tiền" value={formatServicePrice(remainingAmount, data.currency)} highlight />
          <Row
            label="Nội dung chuyển khoản"
            value={data.transferContent}
            onCopy={() => copy('content', data.transferContent)}
            copied={copied === 'content'}
            mono
          />
        </dl>
      </div>

      <p className="text-on-surface-variant mt-4 text-xs leading-relaxed">
        Quét mã QR là chắc nhất. Nếu nhập tay, hãy giữ <strong>nguyên vẹn toàn bộ</strong> nội dung chuyển khoản ở trên
        — thiếu một ký tự là ngân hàng không báo về và đơn sẽ không tự cập nhật. Sau khi ngân hàng ghi nhận, trạng thái
        đơn đổi trong vài phút.
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
            aria-label={`Sao chép ${label}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
        {copied && <span className="text-xs font-semibold text-emerald-600">Đã chép</span>}
      </dd>
    </div>
  );
}

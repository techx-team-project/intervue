'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import Spinner from '@/components/common/Spinner';
import OrderPaymentPanel from '@/components/recruiter/orders/OrderPaymentPanel';
import OrderRefundPanel from '@/components/recruiter/orders/OrderRefundPanel';
import {
  INVOICED_STATUSES,
  ORDER_CANCELLABLE,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
} from '@/constants/recruiter-order';
import { ROUTES } from '@/constants/routes';
import { useRecruiterOrder, useRecruiterOrderMutations } from '@/hooks/useRecruiterOrders';
import { formatDate } from '@/utils/datetime';
import { formatServicePrice } from '@/utils/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, FileDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface RecruiterOrderDetailViewProps {
  code: string;
}

export default function RecruiterOrderDetailView({ code }: RecruiterOrderDetailViewProps) {
  const { data, isPending, isError, error, refetch } = useRecruiterOrder(code);
  const { cancel } = useRecruiterOrderMutations();
  const [actionError, setActionError] = useState<string | null>(null);

  const downloadInvoice = async () => {
    setActionError(null);
    try {
      const blob = await recruiterOrderApi.invoicePdf(code);
      window.open(URL.createObjectURL(blob), '_blank', 'noopener');
    } catch (cause) {
      setActionError(getErrorMessage(cause));
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="border-outline-variant rounded-xl border border-dashed px-6 py-16 text-center">
        <AlertCircle className="text-on-surface-variant mx-auto h-8 w-8" />
        <p className="text-on-surface mt-3 text-base font-bold">Không tìm thấy đơn hàng</p>
        <p className="text-on-surface-variant mt-1 text-sm">{getErrorMessage(error)}</p>
        <Link
          href={ROUTES.RECRUITER_ORDERS}
          className="bg-primary mt-5 inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition hover:brightness-95"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const invoice = data.invoice;

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={ROUTES.RECRUITER_ORDERS}
          className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>
        <h1 className="text-on-surface font-mono text-lg font-bold">{data.code}</h1>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_STYLE[data.status]}`}>
          {ORDER_STATUS_LABEL[data.status]}
        </span>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {actionError}
        </div>
      )}

      <OrderPaymentPanel code={data.code} status={data.status} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                <th className="py-3 pr-4 pl-5">Dịch vụ</th>
                <th className="px-4 py-3 text-center">SL</th>
                <th className="py-3 pr-5 pl-4 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 pr-4 pl-5">
                    <p className="text-on-surface font-semibold">{item.packageName}</p>
                    <p className="text-on-surface-variant font-mono text-xs">{item.packageCode}</p>
                    {item.benefits.length > 0 && (
                      <ul className="text-on-surface-variant mt-1.5 space-y-0.5 text-xs">
                        {item.benefits.map((benefit) => (
                          <li key={`${item.id}-${benefit.label}`}>• {benefit.label}</li>
                        ))}
                      </ul>
                    )}
                    {item.bookedWeeks.length > 0 && (
                      <p className="text-on-surface-variant mt-1.5 text-xs">
                        Tuần: {item.bookedWeeks.map((week) => formatDate(week)).join(', ')}
                      </p>
                    )}
                  </td>
                  <td className="text-on-surface-variant px-4 py-3.5 text-center">{item.quantity}</td>
                  <td className="text-on-surface py-3.5 pr-5 pl-4 text-right font-semibold">
                    {formatServicePrice(item.lineTotal, data.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <dl className="border-outline-variant divide-outline-variant divide-y rounded-2xl border bg-white shadow-2xs">
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <dt className="text-on-surface-variant">Tạm tính</dt>
              <dd className="text-on-surface font-semibold">{formatServicePrice(data.subtotal, data.currency)}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <dt className="text-on-surface-variant">VAT ({Math.round(data.vatRate * 100)}%)</dt>
              <dd className="text-on-surface font-semibold">{formatServicePrice(data.vatAmount, data.currency)}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <dt className="text-on-surface text-sm font-bold">Tổng cộng</dt>
              <dd className="text-primary text-base font-bold">
                {formatServicePrice(data.totalAmount, data.currency)}
              </dd>
            </div>
          </dl>

          {invoice && (
            <div className="border-outline-variant rounded-2xl border bg-white p-4 shadow-2xs">
              <p className="text-on-surface text-sm font-bold">
                Hoá đơn {invoice.invoiceType === 'BUSINESS' ? 'doanh nghiệp' : 'cá nhân'}
              </p>
              <dl className="text-on-surface-variant mt-2 space-y-1 text-xs">
                {invoice.invoiceType === 'BUSINESS' ? (
                  <>
                    <div>Mã số thuế: {invoice.taxId ?? '—'}</div>
                    <div>Đơn vị: {invoice.companyName ?? '—'}</div>
                    <div>Địa chỉ: {invoice.companyAddress ?? '—'}</div>
                  </>
                ) : (
                  <>
                    <div>Họ tên: {invoice.fullName ?? '—'}</div>
                    <div>CCCD/MST: {invoice.identityNumber ?? '—'}</div>
                    <div>Địa chỉ: {invoice.personalAddress ?? '—'}</div>
                  </>
                )}
                <div>Email nhận hoá đơn: {invoice.recipientEmail}</div>
              </dl>
            </div>
          )}

          <OrderRefundPanel code={data.code} onRequested={refetch} />

          {INVOICED_STATUSES.includes(data.status) && (
            <button
              type="button"
              onClick={downloadInvoice}
              className="border-outline-variant text-on-surface-variant inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white text-sm font-semibold transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              Tải hoá đơn (PDF)
            </button>
          )}

          {ORDER_CANCELLABLE.includes(data.status) && (
            <button
              type="button"
              disabled={cancel.isPending}
              onClick={() => {
                setActionError(null);
                cancel.mutate(data.code, { onError: (cause) => setActionError(getErrorMessage(cause)) });
              }}
              className="border-outline-variant text-on-surface-variant inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border bg-white text-sm font-semibold transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
            >
              Huỷ đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

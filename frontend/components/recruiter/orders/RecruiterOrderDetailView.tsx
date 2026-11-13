'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import Spinner from '@/components/common/Spinner';
import CancelOrderModal from '@/components/recruiter/orders/CancelOrderModal';
import OrderDetailRow from '@/components/recruiter/orders/OrderDetailRow';
import OrderPaymentPanel from '@/components/recruiter/orders/OrderPaymentPanel';
import OrderRefundPanel from '@/components/recruiter/orders/OrderRefundPanel';
import {
  ORDER_CANCELLABLE,
  ORDER_DOCUMENT_STATUSES,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
} from '@/constants/recruiter-order';
import { ROUTES } from '@/constants/routes';
import { useRecruiterOrder, useRecruiterOrderMutations } from '@/hooks/useRecruiterOrders';
import { formatDate } from '@/utils/datetime';
import { formatServicePrice } from '@/utils/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, FileDown, ListChecks, Receipt, ShoppingBag, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface RecruiterOrderDetailViewProps {
  code: string;
}

export default function RecruiterOrderDetailView({ code }: RecruiterOrderDetailViewProps) {
  const { data, isPending, error, refetch } = useRecruiterOrder(code);
  const { cancel } = useRecruiterOrderMutations();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const downloadInvoice = async () => {
    setActionError(null);
    try {
      const blob = await recruiterOrderApi.invoicePdf(code);
      window.open(URL.createObjectURL(blob), '_blank', 'noopener');
    } catch (cause) {
      setActionError(getErrorMessage(cause));
    }
  };

  const confirmCancelOrder = () => {
    setActionError(null);
    cancel.mutate(code, {
      onSuccess: () => setIsCancelModalOpen(false),
      onError: (cause) => {
        setIsCancelModalOpen(false);
        setActionError(getErrorMessage(cause));
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border-outline-variant rounded-xl border border-dashed px-6 py-16 text-center">
        <AlertCircle className="text-on-surface-variant mx-auto h-8 w-8" />
        <p className="text-on-surface mt-3 text-base font-bold">Order not found</p>
        <p className="text-on-surface-variant mt-1 text-sm">{getErrorMessage(error)}</p>
        <Link
          href={ROUTES.RECRUITER_ORDERS}
          className="bg-primary mt-5 inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition hover:brightness-95"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const invoice = data.invoice;

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={ROUTES.RECRUITER_ORDERS}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-on-surface font-mono text-lg font-bold">{data.code}</h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_STYLE[data.status]}`}>
            {ORDER_STATUS_LABEL[data.status]}
          </span>
          <span className="text-on-surface-variant text-xs">Placed on {formatDate(data.createdAt)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ORDER_DOCUMENT_STATUSES.includes(data.status) && (
            <button
              type="button"
              onClick={downloadInvoice}
              className="border-outline-variant text-on-surface-variant hover:border-primary hover:bg-primary-light hover:text-primary inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border bg-white px-3.5 text-sm font-medium transition"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              View invoice (PDF)
            </button>
          )}

          {ORDER_CANCELLABLE.includes(data.status) && (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
            >
              <XCircle className="h-4 w-4" aria-hidden />
              Cancel order
            </button>
          )}
        </div>
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
          <h2 className="border-outline-variant text-on-surface flex items-center gap-2 border-b px-5 py-4 text-sm font-bold">
            <ShoppingBag className="text-primary h-4 w-4" />
            Order items
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                <th className="py-3 pr-4 pl-5">Service</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="py-3 pr-5 pl-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 pr-4 pl-5">
                    <p className="text-on-surface font-semibold">{item.packageName}</p>
                    {item.benefits.length > 0 && (
                      <ul className="text-on-surface-variant marker:text-outline mt-1.5 list-inside list-disc space-y-0.5 text-xs">
                        {item.benefits.map((benefit) => (
                          <li key={`${item.id}-${benefit.label}`}>{benefit.label}</li>
                        ))}
                      </ul>
                    )}
                    {item.bookedWeeks.length > 0 && (
                      <p className="text-on-surface-variant mt-1.5 text-xs">
                        <span className="font-medium">Booked weeks:</span>{' '}
                        {item.bookedWeeks.map((week) => formatDate(week)).join(', ')}
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
          <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
            <h2 className="border-outline-variant text-on-surface flex items-center gap-2 border-b px-5 py-4 text-sm font-bold">
              <ListChecks className="text-primary h-4 w-4" />
              Order summary
            </h2>
            <dl className="divide-outline-variant divide-y px-5">
              <OrderDetailRow label="Subtotal" value={formatServicePrice(data.subtotal, data.currency)} />
              {data.discountAmount > 0 && (
                <OrderDetailRow label="Discount" value={`-${formatServicePrice(data.discountAmount, data.currency)}`} />
              )}
              <OrderDetailRow
                label={`VAT (${Math.round(data.vatRate * 100)}%)`}
                value={formatServicePrice(data.vatAmount, data.currency)}
              />
              <OrderDetailRow label="Total" value={formatServicePrice(data.totalAmount, data.currency)} highlight />
            </dl>
          </div>

          {invoice && (
            <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
              <h2 className="border-outline-variant text-on-surface flex items-center gap-2 border-b px-5 py-4 text-sm font-bold">
                <Receipt className="text-primary h-4 w-4" />
                {invoice.invoiceType === 'BUSINESS' ? 'Corporate e-invoice' : 'Personal invoice'}
              </h2>
              <dl className="divide-outline-variant divide-y px-5 text-sm">
                {invoice.invoiceType === 'BUSINESS' ? (
                  <>
                    <OrderDetailRow label="Tax ID" value={invoice.taxId ?? '—'} mono />
                    <OrderDetailRow label="Company name" value={invoice.companyName ?? '—'} />
                    <OrderDetailRow label="Address" value={invoice.companyAddress ?? '—'} />
                  </>
                ) : (
                  <>
                    <OrderDetailRow label="Full name" value={invoice.fullName ?? '—'} />
                    <OrderDetailRow label="ID number" value={invoice.identityNumber ?? '—'} mono />
                    <OrderDetailRow label="Address" value={invoice.personalAddress ?? '—'} />
                  </>
                )}
                <OrderDetailRow label="E-invoice email" value={invoice.recipientEmail} />
              </dl>
            </div>
          )}

          <OrderRefundPanel code={data.code} onRequested={refetch} />
        </div>
      </div>

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancelOrder}
        isConfirming={cancel.isPending}
        code={data.code}
        totalAmount={data.totalAmount}
        currency={data.currency}
      />
    </div>
  );
}

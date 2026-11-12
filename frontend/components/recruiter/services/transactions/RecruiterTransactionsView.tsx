'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { useRecruiterPayments, useRecruiterRefunds } from '@/hooks/useRecruiterOrders';
import { formatServicePrice } from '@/utils/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Receipt } from 'lucide-react';
import { useState } from 'react';

const REFUND_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending review',
  APPROVED: 'Refund approved',
  REJECTED: 'Rejected',
};

const REFUND_STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-rose-50 text-rose-700',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  MATCHED: 'Matched to an order',
  UNMATCHED: 'Not matched to any order',
};

const PAYMENT_STATUS_STYLE: Record<string, string> = {
  MATCHED: 'bg-emerald-50 text-emerald-700',
  UNMATCHED: 'bg-amber-50 text-amber-700',
};

type Tab = 'payments' | 'refunds';

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center">
      <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
        <Receipt className="h-6 w-6" />
      </div>
      <h4 className="text-on-surface mt-3 text-sm font-bold">{label}</h4>
    </div>
  );
}

function ErrorState({ error }: { error: unknown }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
      {getErrorMessage(error)}
    </div>
  );
}

function PaymentsTab() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError, error } = useRecruiterPayments(page);

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (isError) return <ErrorState error={error} />;
  if (data.items.length === 0) return <EmptyState label="No bank transfers yet" />;

  return (
    <div className="space-y-4">
      <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                <th className="py-3.5 pr-4 pl-6">Time</th>
                <th className="px-4 py-3.5">Transfer description</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5">Matched order</th>
                <th className="py-3.5 pr-6 pl-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {data.items.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="text-on-surface-variant py-3.5 pr-4 pl-6 whitespace-nowrap">
                    {new Date(transaction.transactionAt).toLocaleString('vi-VN')}
                  </td>
                  <td
                    className="text-on-surface-variant max-w-xs truncate px-4 py-3.5"
                    title={transaction.content ?? ''}
                  >
                    {transaction.content ?? '—'}
                  </td>
                  <td className="text-on-surface px-4 py-3.5 text-right font-semibold">
                    {formatServicePrice(transaction.amountIn, 'VND')}
                  </td>
                  <td className="text-on-surface-variant px-4 py-3.5 font-mono">
                    {transaction.matchedOrderCode ?? '—'}
                  </td>
                  <td className="py-3.5 pr-6 pl-4 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${PAYMENT_STATUS_STYLE[transaction.status]}`}
                    >
                      {PAYMENT_STATUS_LABEL[transaction.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.totalPages > 1 && (
        <Pagination
          page={data.page + 1}
          pageCount={data.totalPages}
          totalItems={data.totalItems}
          pageSize={data.size}
          onPageChange={(next) => setPage(next - 1)}
        />
      )}
    </div>
  );
}

function RefundsTab() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError, error } = useRecruiterRefunds(page);

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (isError) return <ErrorState error={error} />;
  if (data.items.length === 0) return <EmptyState label="No refund requests yet" />;

  return (
    <div className="space-y-4">
      <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                <th className="py-3.5 pr-4 pl-6">Order</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5 text-right">Requested refund</th>
                <th className="px-4 py-3.5 text-right">Approved amount</th>
                <th className="py-3.5 pr-6 pl-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {data.items.map((refund) => (
                <tr key={refund.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="text-primary py-3.5 pr-4 pl-6 font-mono font-bold">{refund.orderCode}</td>
                  <td className="text-on-surface-variant max-w-xs truncate px-4 py-3.5" title={refund.reason}>
                    {refund.reason}
                  </td>
                  <td className="text-on-surface px-4 py-3.5 text-right font-semibold">
                    {formatServicePrice(refund.refundableAmount, 'VND')}
                  </td>
                  <td className="text-on-surface-variant px-4 py-3.5 text-right">
                    {refund.approvedAmount === null ? '—' : formatServicePrice(refund.approvedAmount, 'VND')}
                  </td>
                  <td className="py-3.5 pr-6 pl-4 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${REFUND_STATUS_STYLE[refund.status]}`}
                    >
                      {REFUND_STATUS_LABEL[refund.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.totalPages > 1 && (
        <Pagination
          page={data.page + 1}
          pageCount={data.totalPages}
          totalItems={data.totalItems}
          pageSize={data.size}
          onPageChange={(next) => setPage(next - 1)}
        />
      )}
    </div>
  );
}

export default function RecruiterTransactionsView() {
  const [tab, setTab] = useState<Tab>('payments');

  return (
    <div className="space-y-4">
      <div className="border-outline-variant inline-flex rounded-full border bg-white p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setTab('payments')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            tab === 'payments' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Payments
        </button>
        <button
          type="button"
          onClick={() => setTab('refunds')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            tab === 'refunds' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Refunds
        </button>
      </div>

      {tab === 'payments' ? <PaymentsTab /> : <RefundsTab />}
    </div>
  );
}

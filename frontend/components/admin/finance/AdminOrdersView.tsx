'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { AdminOrder, AdminOrderStatus } from '@/types/admin-payment';
import { formatDate, formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { MouseEvent } from 'react';

const PAGE_SIZE = 50;

const STATUS_STYLE: Record<AdminOrderStatus, string> = {
  PENDING_PAYMENT: 'bg-slate-100 text-slate-600',
  UNDERPAID: 'bg-amber-50 text-amber-700',
  PAID: 'bg-emerald-50 text-emerald-700',
  FULFILLED: 'bg-emerald-50 text-emerald-700',
  EXPIRED: 'bg-slate-100 text-slate-500',
  CANCELLED: 'bg-slate-100 text-slate-500',
  REFUND_REQUESTED: 'bg-amber-50 text-amber-700',
  REFUNDED: 'bg-rose-50 text-rose-700',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(STATUS_STYLE) as AdminOrderStatus[]).map((status) => ({ value: status, label: status })),
];

function money(amount: number, currency: string) {
  return `${amount.toLocaleString('vi-VN')} ${currency}`;
}

export default function AdminOrdersView({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<AdminOrderStatus | ''>('');
  const [needsManualRefund, setNeedsManualRefund] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvingCode, setResolvingCode] = useState<string | null>(null);

  const search = async (overrideNeedsManualRefund = needsManualRefund) => {
    setIsSearching(true);
    setError(null);
    try {
      const page = await adminPaymentApi.searchOrders({
        code: code.trim(),
        status,
        needsManualRefund: overrideNeedsManualRefund,
        page: 0,
        size: PAGE_SIZE,
      });
      setOrders(page.items);
      setExpanded(null);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSearching(false);
    }
  };

  const toggleNeedsManualRefund = () => {
    const next = !needsManualRefund;
    setNeedsManualRefund(next);
    void search(next);
  };

  const resolveManualRefund = async (event: MouseEvent, order: AdminOrder) => {
    event.stopPropagation();
    setResolvingCode(order.code);
    setError(null);
    try {
      const updated = await adminPaymentApi.resolveManualRefund(order.code);
      setOrders((current) =>
        current.map((item) =>
          item.code === order.code ? { ...item, manualRefundResolvedAt: updated.manualRefundResolvedAt } : item,
        ),
      );
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setResolvingCode(null);
    }
  };

  const toggle = async (order: AdminOrder) => {
    if (expanded === order.code) {
      setExpanded(null);
      return;
    }
    setExpanded(order.code);
    if (order.items.length > 0) return;
    try {
      const full = await adminPaymentApi.getOrder(order.code);
      setOrders((current) => current.map((item) => (item.code === full.code ? full : item)));
    } catch (cause) {
      setError(getErrorMessage(cause));
    }
  };

  return (
    <div className="space-y-5 pb-16">
      <div>
        <h1 className="text-on-surface text-xl font-bold">Orders</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Every service order with what it contains, how much arrived and which document was issued.
        </p>
      </div>

      <div className="border-outline-variant flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4 shadow-2xs">
        <Input
          label="Order code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="IVO…"
          className="w-48"
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as AdminOrderStatus | '')}
          options={STATUS_OPTIONS}
        />
        <Button isLoading={isSearching} onClick={() => search()}>
          Search
        </Button>
        <button
          type="button"
          onClick={toggleNeedsManualRefund}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
            needsManualRefund
              ? 'border-rose-300 bg-rose-50 text-rose-700'
              : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          Cần hoàn tiền thủ công
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="border-outline-variant text-on-surface-variant rounded-2xl border border-dashed px-4 py-12 text-center text-sm">
          No order matches this search.
        </div>
      ) : (
        <div className="border-outline-variant overflow-x-auto rounded-2xl border bg-white shadow-2xs">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="border-outline-variant text-on-surface-variant border-b text-xs">
              <tr>
                <th className="w-8 px-4 py-3" />
                <th className="px-4 py-3 text-left font-semibold">Order</th>
                <th className="px-4 py-3 text-left font-semibold">Company</th>
                <th className="px-4 py-3 text-left font-semibold">Placed</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
                <th className="px-4 py-3 text-right font-semibold">Paid</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.code}>
                  <tr
                    className="border-outline-variant hover:bg-surface-container-low cursor-pointer border-b last:border-0"
                    onClick={() => toggle(order)}
                  >
                    <td className="text-on-surface-variant px-4 py-3">
                      {expanded === order.code ? (
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      ) : (
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-on-surface font-semibold">{order.code}</p>
                      {order.invoiceNumber && <p className="text-on-surface-variant text-xs">{order.invoiceNumber}</p>}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3 text-xs">
                      {order.companyName ?? `#${order.companyId}`}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3 text-xs">{formatDateTime(order.createdAt)}</td>
                    <td className="text-on-surface px-4 py-3 text-right font-semibold">
                      {money(order.totalAmount, order.currency)}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3 text-right">
                      {money(order.paidAmount, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[order.status]}`}>
                          {order.status}
                        </span>
                        {order.status === 'EXPIRED' &&
                          order.paidAmount > 0 &&
                          (order.manualRefundResolvedAt ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                              ✓ Đã hoàn tiền (thủ công)
                            </span>
                          ) : (
                            <>
                              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                                Cần hoàn tiền thủ công
                              </span>
                              <button
                                type="button"
                                disabled={resolvingCode === order.code}
                                onClick={(event) => resolveManualRefund(event, order)}
                                className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                              >
                                Đã hoàn tiền xong
                              </button>
                            </>
                          ))}
                      </div>
                    </td>
                  </tr>
                  {expanded === order.code && (
                    <tr className="border-outline-variant border-b last:border-0">
                      <td />
                      <td colSpan={6} className="px-4 py-3">
                        {order.items.length === 0 ? (
                          <p className="text-on-surface-variant text-xs">Loading the lines…</p>
                        ) : (
                          <ul className="space-y-1">
                            {order.items.map((item) => (
                              <li key={item.id} className="text-on-surface-variant text-xs">
                                <div className="flex justify-between">
                                  <span>
                                    {item.packageName} × {item.quantity}
                                  </span>
                                  <span>{money(item.lineTotal, order.currency)}</span>
                                </div>
                                {item.bookedWeeks.length > 0 && (
                                  <p className="mt-0.5 text-[11px] text-slate-400">
                                    Tuần: {item.bookedWeeks.map((week) => formatDate(week)).join(', ')}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                        <dl className="text-on-surface-variant mt-3 grid gap-1 text-xs sm:grid-cols-4">
                          <div>Subtotal: {money(order.subtotal, order.currency)}</div>
                          <div>Discount: {money(order.discountAmount, order.currency)}</div>
                          <div>VAT: {money(order.vatAmount, order.currency)}</div>
                          <div>Paid at: {order.paidAt ? formatDateTime(order.paidAt) : '—'}</div>
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

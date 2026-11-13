'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import type { AdminRefundRequest, AdminRefundStatus, AdminRefundStatusCounts } from '@/types/admin-payment';
import type { Page } from '@/types/api';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Banknote, CheckCircle2, Clock, ReceiptText, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

const PAGE_SIZE = 20;

const STATUS_STYLE: Record<AdminRefundStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-slate-100 text-slate-600',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STATS: Array<{ key: AdminRefundStatus; label: string; icon: LucideIcon; tone: string }> = [
  { key: 'PENDING', label: 'Pending review', icon: Clock, tone: 'bg-amber-100 text-amber-600' },
  { key: 'APPROVED', label: 'Approved', icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-600' },
  { key: 'REJECTED', label: 'Rejected', icon: XCircle, tone: 'bg-rose-100 text-rose-600' },
];

function money(amount: number) {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

interface AdminRefundsViewProps {
  initialRefunds: Page<AdminRefundRequest>;
  initialSummary: AdminRefundStatusCounts;
  initialStatus?: AdminRefundStatus | '';
}

export default function AdminRefundsView({
  initialRefunds,
  initialSummary,
  initialStatus = '',
}: AdminRefundsViewProps) {
  const [result, setResult] = useState(initialRefunds);
  const [summary, setSummary] = useState(initialSummary);
  const [status, setStatus] = useState<AdminRefundStatus | ''>(initialStatus);
  const [orderCode, setOrderCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewing, setReviewing] = useState<AdminRefundRequest | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const search = async (nextStatus: AdminRefundStatus | '' = status, nextOrderCode = orderCode, page = 0) => {
    setIsSearching(true);
    setError(null);
    try {
      setResult(
        await adminPaymentApi.searchRefunds({
          status: nextStatus,
          orderCode: nextOrderCode.trim(),
          page,
          size: PAGE_SIZE,
        }),
      );
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSearching(false);
    }
  };

  const refreshSummary = async () => {
    try {
      setSummary(await adminPaymentApi.refundsSummary());
    } catch {
      // the stats row is a secondary indicator — a failed refresh just keeps the last known counts
    }
  };

  const selectStatusFromStats = (key: AdminRefundStatus) => {
    const next = status === key ? '' : key;
    setStatus(next);
    void search(next, orderCode, 0);
  };

  const openReview = (refund: AdminRefundRequest) => {
    setReviewing(refund);
    setAmount(String(refund.refundableAmount));
    setNote('');
    setError(null);
  };

  const review = async (approve: boolean) => {
    if (!reviewing) return;
    setIsReviewing(true);
    setError(null);
    try {
      if (approve) {
        await adminPaymentApi.approveRefund(reviewing.id, Number(amount), note.trim());
      } else {
        await adminPaymentApi.rejectRefund(reviewing.id, note.trim());
      }
      setReviewing(null);
      await Promise.all([search(status, orderCode, result.page), refreshSummary()]);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      <div>
        <h1 className="text-on-surface text-xl font-bold">Refunds</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Only the part of an order that was never activated can come back. Services already applied to a job keep
          running.
        </p>
      </div>

      <div className="flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
        <Banknote className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm leading-relaxed text-amber-900">
          Approving records the decision and takes the unused services back. <strong>It does not move money</strong> —
          make the bank transfer yourself.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ key, label, icon: Icon, tone }) => {
          const isActive = status === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectStatusFromStats(key)}
              aria-pressed={isActive}
              className={`border-outline-variant flex flex-col justify-between rounded-2xl border bg-white p-4 text-left transition ${
                isActive ? 'border-primary/50 ring-primary/15 ring-2' : 'hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant text-xs font-semibold tracking-wide uppercase">{label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-on-surface mt-3 text-2xl font-bold">{summary.byStatus[key] ?? 0}</p>
            </button>
          );
        })}
      </div>

      <div className="border-outline-variant flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4 shadow-2xs">
        <Input
          label="Order code"
          value={orderCode}
          onChange={(event) => setOrderCode(event.target.value.toUpperCase())}
          placeholder="IVO…"
          className="w-48"
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as AdminRefundStatus | '')}
          options={STATUS_OPTIONS}
        />
        <Button isLoading={isSearching} onClick={() => search()}>
          Search
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      {result.items.length === 0 ? (
        <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center">
          <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
            <ReceiptText className="h-6 w-6" />
          </div>
          <h4 className="text-on-surface mt-3 text-sm font-bold">No refund matches this search</h4>
          <p className="text-on-surface-variant mt-1 text-xs">Requests appear here once a recruiter asks for one.</p>
        </div>
      ) : (
        <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b text-xs font-semibold tracking-wider uppercase">
                  <th className="py-3.5 pr-4 pl-6">Order</th>
                  <th className="px-4 py-3.5">Company</th>
                  <th className="px-4 py-3.5">Requested</th>
                  <th className="px-4 py-3.5 text-right">Refundable</th>
                  <th className="px-4 py-3.5 text-right">Approved</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-outline-variant divide-y">
                {result.items.map((refund) => (
                  <tr key={refund.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 pr-4 pl-6">
                      <p className="text-on-surface font-semibold">{refund.orderCode}</p>
                      <p className="text-on-surface-variant mt-0.5 max-w-[260px] truncate text-xs">{refund.reason}</p>
                    </td>
                    <td className="text-on-surface-variant px-4 py-3.5 text-xs">
                      {refund.companyName ?? `#${refund.companyId}`}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3.5 text-xs">{formatDateTime(refund.createdAt)}</td>
                    <td className="text-on-surface px-4 py-3.5 text-right font-semibold">
                      {money(refund.refundableAmount)}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3.5 text-right">
                      {refund.approvedAmount === null ? '—' : money(refund.approvedAmount)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[refund.status]}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-6 pl-4 text-right">
                      {refund.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => openReview(refund)}
                          className="text-primary cursor-pointer font-semibold hover:underline"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.totalPages > 1 && (
        <Pagination
          page={result.page + 1}
          pageCount={result.totalPages}
          totalItems={result.totalItems}
          pageSize={result.size}
          onPageChange={(next) => void search(status, orderCode, next - 1)}
        />
      )}

      <Modal isOpen={reviewing !== null} onClose={() => setReviewing(null)} title="Review refund request" maxWidth="md">
        {reviewing && (
          <>
            <p className="text-on-surface-variant text-sm whitespace-pre-line">{reviewing.reason}</p>
            <dl className="text-on-surface-variant mt-3 grid gap-1 text-xs sm:grid-cols-2">
              <div>Order total: {money(reviewing.orderTotal)}</div>
              <div>Refundable: {money(reviewing.refundableAmount)}</div>
            </dl>
            <div className="mt-4 space-y-3">
              <Input
                label="Amount to refund (VND)"
                type="number"
                min={0}
                max={reviewing.refundableAmount}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                helperText={`At most ${money(reviewing.refundableAmount)}`}
              />
              <Textarea
                label="Note"
                rows={2}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Bank reference, or why it was rejected"
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="neutral" onClick={() => setReviewing(null)}>
                Cancel
              </Button>
              <Button variant="neutral" isLoading={isReviewing} onClick={() => review(false)}>
                Reject
              </Button>
              <Button isLoading={isReviewing} onClick={() => review(true)}>
                Approve
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import type { AdminRefundRequest } from '@/types/admin-payment';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Banknote } from 'lucide-react';
import { useState } from 'react';

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-slate-100 text-slate-600',
};

export default function AdminRefundsView({ initialRefunds }: { initialRefunds: AdminRefundRequest[] }) {
  const [refunds, setRefunds] = useState(initialRefunds);
  const [openId, setOpenId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = (refund: AdminRefundRequest) => {
    setOpenId(refund.id);
    setAmount(String(refund.refundableAmount));
    setNote('');
    setError(null);
  };

  const review = async (id: number, approve: boolean) => {
    setBusyId(id);
    setError(null);
    try {
      const saved = approve
        ? await adminPaymentApi.approveRefund(id, Number(amount), note.trim())
        : await adminPaymentApi.rejectRefund(id, note.trim());
      setRefunds((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setOpenId(null);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setBusyId(null);
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

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      {refunds.length === 0 ? (
        <div className="border-outline-variant text-on-surface-variant rounded-2xl border border-dashed px-4 py-12 text-center text-sm">
          No refund has been requested yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {refunds.map((refund) => (
            <li key={refund.id} className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-on-surface font-semibold">{refund.orderCode}</p>
                  <p className="text-on-surface-variant text-xs">
                    Requested {formatDateTime(refund.createdAt)} · company #{refund.companyId}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[refund.status]}`}>
                  {refund.status}
                </span>
              </div>

              <p className="text-on-surface mt-3 text-sm whitespace-pre-line">{refund.reason}</p>

              <dl className="text-on-surface-variant mt-3 grid gap-1 text-xs sm:grid-cols-3">
                <div>Order total: {refund.orderTotal.toLocaleString('vi-VN')}đ</div>
                <div>Refundable: {refund.refundableAmount.toLocaleString('vi-VN')}đ</div>
                <div>
                  Approved: {refund.approvedAmount === null ? '—' : `${refund.approvedAmount.toLocaleString('vi-VN')}đ`}
                </div>
              </dl>

              {refund.adminNote && <p className="text-on-surface-variant mt-2 text-xs">Note: {refund.adminNote}</p>}

              {refund.status === 'PENDING' &&
                (openId === refund.id ? (
                  <div className="mt-4 space-y-3">
                    <Input
                      label="Amount to refund (VND)"
                      type="number"
                      min={0}
                      max={refund.refundableAmount}
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      helperText={`At most ${refund.refundableAmount.toLocaleString('vi-VN')}đ`}
                    />
                    <Textarea
                      label="Note"
                      rows={2}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Bank reference, or why it was rejected"
                    />
                    <div className="flex flex-wrap justify-end gap-3">
                      <Button variant="neutral" onClick={() => setOpenId(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="neutral"
                        isLoading={busyId === refund.id}
                        onClick={() => review(refund.id, false)}
                      >
                        Reject
                      </Button>
                      <Button isLoading={busyId === refund.id} onClick={() => review(refund.id, true)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" className="mt-4" onClick={() => open(refund)}>
                    Review
                  </Button>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

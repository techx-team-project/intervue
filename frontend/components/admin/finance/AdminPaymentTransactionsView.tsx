'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import type { PaymentTransaction, PaymentTransactionStatus } from '@/types/admin-payment';
import type { Page } from '@/types/api';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, Landmark, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface AdminPaymentTransactionsViewProps {
  initialPage: Page<PaymentTransaction>;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All transactions' },
  { value: 'UNMATCHED', label: 'Unmatched' },
  { value: 'MATCHED', label: 'Matched' },
];

export default function AdminPaymentTransactionsView({ initialPage }: AdminPaymentTransactionsViewProps) {
  const [result, setResult] = useState(initialPage);
  const [status, setStatus] = useState<PaymentTransactionStatus | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [matching, setMatching] = useState<PaymentTransaction | null>(null);
  const [orderCode, setOrderCode] = useState('');
  const [note, setNote] = useState('');

  const reload = async (nextStatus: PaymentTransactionStatus | '', page: number) => {
    setIsBusy(true);
    setError(null);
    try {
      setResult(await adminPaymentApi.searchTransactions(nextStatus, page));
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsBusy(false);
    }
  };

  const runSync = async () => {
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      const outcome = await adminPaymentApi.sync();
      setNotice(
        outcome.ok
          ? `${outcome.message}. Fetched ${outcome.fetched}, recorded ${outcome.created}, matched ${outcome.matched}.`
          : outcome.message,
      );
      await reload(status, 0);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsBusy(false);
    }
  };

  const submitMatch = async () => {
    if (!matching) return;
    setError(null);
    try {
      await adminPaymentApi.match(matching.id, orderCode.trim().toUpperCase(), note.trim() || undefined);
      setMatching(null);
      setOrderCode('');
      setNote('');
      await reload(status, result.page);
    } catch (cause) {
      setError(getErrorMessage(cause));
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-navy text-xl font-bold sm:text-2xl">Bank transactions</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Incoming transfers pulled from SePay and how they matched orders.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Select
            value={status}
            onChange={(event) => {
              const next = event.target.value as PaymentTransactionStatus | '';
              setStatus(next);
              void reload(next, 0);
            }}
            options={STATUS_OPTIONS}
          />
          <Button onClick={runSync} isLoading={isBusy} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Run now
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {error}
        </div>
      )}
      {notice && (
        <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900">
          <Check className="h-4 w-4 text-sky-600" />
          {notice}
        </div>
      )}

      {result.items.length === 0 ? (
        <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center">
          <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
            <Landmark className="h-6 w-6" />
          </div>
          <h4 className="text-on-surface mt-3 text-sm font-bold">No bank transactions recorded</h4>
          <p className="text-on-surface-variant mt-1 text-xs">
            They appear here once SePay is configured and reconciliation has run.
          </p>
        </div>
      ) : (
        <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-xs">
              <thead>
                <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
                  <th className="py-3.5 pr-4 pl-6">When</th>
                  <th className="px-4 py-3.5">Gateway</th>
                  <th className="px-4 py-3.5">Content</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-outline-variant divide-y">
                {result.items.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="text-on-surface-variant py-3.5 pr-4 pl-6">
                      {new Date(transaction.transactionAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="text-on-surface-variant px-4 py-3.5">{transaction.gateway ?? '—'}</td>
                    <td className="text-on-surface-variant max-w-[260px] truncate px-4 py-3.5">
                      {transaction.content ?? '—'}
                    </td>
                    <td className="text-on-surface px-4 py-3.5 text-right font-semibold">
                      {new Intl.NumberFormat('en-US').format(transaction.amountIn)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          transaction.status === 'MATCHED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="text-on-surface px-4 py-3.5 font-mono">{transaction.matchedOrderCode ?? '—'}</td>
                    <td className="py-3.5 pr-6 pl-4 text-right">
                      {transaction.status === 'UNMATCHED' && (
                        <button
                          type="button"
                          onClick={() => setMatching(transaction)}
                          className="text-primary cursor-pointer font-semibold hover:underline"
                        >
                          Match
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
          onPageChange={(next) => void reload(status, next - 1)}
        />
      )}

      <Modal
        isOpen={matching !== null}
        onClose={() => setMatching(null)}
        title="Match transaction to an order"
        maxWidth="md"
      >
        <p className="text-on-surface-variant text-sm">
          Amount received: <strong>{matching && new Intl.NumberFormat('en-US').format(matching.amountIn)}</strong>
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label="Order code"
            value={orderCode}
            onChange={(event) => setOrderCode(event.target.value)}
            placeholder="IVOXXXXXXXX"
          />
          <Input label="Note" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="neutral" onClick={() => setMatching(null)}>
            Cancel
          </Button>
          <Button onClick={submitMatch} disabled={orderCode.trim().length === 0}>
            Match
          </Button>
        </div>
      </Modal>
    </div>
  );
}

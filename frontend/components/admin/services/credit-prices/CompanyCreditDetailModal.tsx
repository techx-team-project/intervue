'use client';

import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAdjustCompanyCredits, useAdminCompanyCreditDetail, useAdminCompanyCreditLedger } from '@/hooks/useCredits';
import { cn } from '@/lib/utils';
import type { AdminCompanyCreditDetail, EntitlementStatus } from '@/types/credit';
import { formatDate, formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { Coins, History, Layers, MinusCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CompanyCreditDetailModalProps {
  companyId: number | null;
  onClose: () => void;
}

const LOT_STATUS_STYLES: Record<EntitlementStatus, string> = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  CONSUMED: 'bg-slate-100 text-slate-600 dark:bg-forest-850 dark:text-forest-300',
  EXPIRED: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  REVOKED: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
};

const LEDGER_PAGE_SIZE = 10;

interface CompanyCreditDetailBodyProps {
  detail: AdminCompanyCreditDetail;
}

function CompanyCreditDetailBody({ detail }: CompanyCreditDetailBodyProps) {
  const [subTab, setSubTab] = useState<'LOTS' | 'LEDGER'>('LOTS');
  const [ledgerPage, setLedgerPage] = useState(0);
  const [direction, setDirection] = useState<'GRANT' | 'DEDUCT'>('GRANT');
  const [amountInput, setAmountInput] = useState('');
  const [validityInput, setValidityInput] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ledger = useAdminCompanyCreditLedger(detail.companyId, ledgerPage, LEDGER_PAGE_SIZE, subTab === 'LEDGER');
  const adjustMutation = useAdjustCompanyCredits();

  const parsedAmount = Number(amountInput.trim());
  const parsedValidity = validityInput.trim() === '' ? null : Number(validityInput.trim());

  const amountError = (() => {
    if (!amountInput.trim() || !Number.isInteger(parsedAmount) || parsedAmount < 1 || parsedAmount > 1_000_000) {
      return 'Enter an integer 1–1,000,000';
    }
    if (direction === 'DEDUCT' && parsedAmount > detail.availableBalance) {
      return `Cannot exceed available balance (${detail.availableBalance.toLocaleString('en-US')})`;
    }
    return undefined;
  })();

  const validityError =
    direction === 'GRANT' &&
    parsedValidity !== null &&
    (!Number.isInteger(parsedValidity) || parsedValidity < 1 || parsedValidity > 3650)
      ? 'Enter 1–3,650 days or leave blank'
      : undefined;

  const trimmedReason = reason.trim();
  const reasonError =
    trimmedReason.length === 0
      ? 'Reason is required for audit logs'
      : trimmedReason.length > 200
        ? 'Maximum 200 characters'
        : undefined;

  const handleAdjust = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (amountError || validityError || reasonError) return;

    const signedAmount = direction === 'GRANT' ? parsedAmount : -parsedAmount;
    try {
      await adjustMutation.mutateAsync({
        companyId: detail.companyId,
        input: {
          amount: signedAmount,
          reason: trimmedReason,
          validityDays: direction === 'GRANT' ? parsedValidity : null,
        },
      });
      setAmountInput('');
      setValidityInput('');
      setReason('');
      setSubmitted(false);
      toast.success(
        direction === 'GRANT'
          ? `Granted +${parsedAmount.toLocaleString('en-US')} credits`
          : `Deducted ${parsedAmount.toLocaleString('en-US')} credits`,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant rounded-lg border bg-emerald-50/40 p-3">
          <div className="text-on-surface-variant dark:text-forest-300 text-[11px] font-semibold uppercase">
            Available
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-lg font-extrabold text-emerald-700 tabular-nums dark:text-emerald-300">
            <Coins className="h-4 w-4" />
            {detail.availableBalance.toLocaleString('en-US')}
          </div>
        </div>
        <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant rounded-lg border bg-slate-50/70 p-3">
          <div className="text-on-surface-variant dark:text-forest-300 text-[11px] font-semibold uppercase">
            Lifetime Granted
          </div>
          <div className="text-navy dark:text-forest-50 mt-1 text-lg font-bold tabular-nums">
            {detail.lifetimeGranted.toLocaleString('en-US')}
          </div>
        </div>
        <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant rounded-lg border bg-slate-50/70 p-3">
          <div className="text-on-surface-variant dark:text-forest-300 text-[11px] font-semibold uppercase">
            Lifetime Spent
          </div>
          <div className="text-navy dark:text-forest-50 mt-1 text-lg font-bold tabular-nums">
            {detail.lifetimeSpent.toLocaleString('en-US')}
          </div>
        </div>
        <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant rounded-lg border bg-slate-50/70 p-3">
          <div className="text-on-surface-variant dark:text-forest-300 text-[11px] font-semibold uppercase">
            Expired Unspent
          </div>
          <div className="text-navy dark:text-forest-50 mt-1 text-lg font-bold tabular-nums">
            {detail.expiredBalance.toLocaleString('en-US')}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleAdjust}
        className="dark:border-forest-800 dark:bg-forest-950/40 border-outline-variant space-y-3 rounded-lg border bg-slate-50/50 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-navy dark:text-forest-50 text-sm font-bold">Manual Credit Adjustment</h3>
          <div className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant inline-flex rounded-lg border bg-white p-0.5">
            <button
              type="button"
              onClick={() => setDirection('GRANT')}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                direction === 'GRANT'
                  ? 'bg-emerald-600 text-white'
                  : 'dark:text-forest-300 text-slate-600 hover:text-slate-900',
              )}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Grant (+)
            </button>
            <button
              type="button"
              onClick={() => setDirection('DEDUCT')}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                direction === 'DEDUCT'
                  ? 'bg-rose-600 text-white'
                  : 'dark:text-forest-300 text-slate-600 hover:text-slate-900',
              )}
            >
              <MinusCircle className="h-3.5 w-3.5" />
              Deduct (−)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Credits amount *"
            type="number"
            min={1}
            max={1_000_000}
            radius="lg"
            placeholder="e.g. 500"
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
            error={submitted ? amountError : undefined}
            className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-50 py-2 text-sm tabular-nums"
          />
          {direction === 'GRANT' ? (
            <Input
              label="Validity (days, optional)"
              type="number"
              min={1}
              max={3650}
              radius="lg"
              placeholder="Leave blank for no expiry"
              value={validityInput}
              onChange={(event) => setValidityInput(event.target.value)}
              error={submitted ? validityError : undefined}
              className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-50 py-2 text-sm tabular-nums"
            />
          ) : (
            <div className="dark:border-forest-800 dark:bg-forest-900/60 border-outline-variant text-on-surface-variant dark:text-forest-300 flex items-center rounded-lg border bg-white px-3 py-2 text-xs">
              Deductions consume oldest/soonest-expiring credit lots first (FIFO). Max available:{' '}
              <span className="ml-1 font-bold">{detail.availableBalance.toLocaleString('en-US')}</span>
            </div>
          )}
        </div>

        <Input
          label="Audit reason *"
          maxLength={200}
          radius="lg"
          placeholder="e.g. Compensation for system incident #142 or promotional partner bonus"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          error={submitted ? reasonError : undefined}
          className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-50 py-2 text-sm"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            isLoading={adjustMutation.isPending}
            variant={direction === 'DEDUCT' ? 'danger' : 'primary'}
          >
            {direction === 'GRANT' ? 'Grant credits' : 'Deduct credits'}
          </Button>
        </div>
      </form>

      <div>
        <div className="dark:border-forest-800 border-outline-variant mb-3 flex gap-5 border-b">
          <button
            type="button"
            onClick={() => setSubTab('LOTS')}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 border-b-2 py-2 text-xs font-bold transition-colors',
              subTab === 'LOTS'
                ? 'border-primary text-primary'
                : 'dark:text-forest-300 border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            Credit Lots ({detail.lots.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('LEDGER')}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 border-b-2 py-2 text-xs font-bold transition-colors',
              subTab === 'LEDGER'
                ? 'border-primary text-primary'
                : 'dark:text-forest-300 border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            <History className="h-3.5 w-3.5" />
            Ledger History
          </button>
        </div>

        {subTab === 'LOTS' ? (
          detail.lots.length === 0 ? (
            <p className="dark:text-forest-300 text-on-surface-variant py-6 text-center text-xs">
              This company has no credit lots yet.
            </p>
          ) : (
            <div className="dark:border-forest-800 border-outline-variant max-h-64 overflow-y-auto rounded-lg border">
              <table className="w-full text-left text-xs">
                <thead className="dark:bg-forest-950 dark:text-forest-300 text-on-surface-variant sticky top-0 bg-slate-50 text-[11px] font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2">Source / Label</th>
                    <th className="px-3 py-2 text-right">Remaining / Total</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Expiry</th>
                    <th className="px-3 py-2">Granted</th>
                  </tr>
                </thead>
                <tbody className="dark:divide-forest-800 divide-outline-variant/60 divide-y">
                  {detail.lots.map((lot) => (
                    <tr key={lot.id}>
                      <td className="text-navy dark:text-forest-50 px-3 py-2 font-medium">
                        {lot.label}
                        {lot.bonus && (
                          <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            BONUS
                          </span>
                        )}
                      </td>
                      <td className="text-on-surface dark:text-forest-100 px-3 py-2 text-right font-semibold tabular-nums">
                        {lot.remainingQuantity.toLocaleString('en-US')} / {lot.totalQuantity.toLocaleString('en-US')}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            'inline-block rounded-full px-2 py-0.5 text-[10px] font-bold',
                            LOT_STATUS_STYLES[lot.status],
                          )}
                        >
                          {lot.status}
                        </span>
                      </td>
                      <td className="dark:text-forest-300 text-on-surface-variant px-3 py-2 whitespace-nowrap">
                        {lot.activationDeadline ? formatDate(lot.activationDeadline) : 'No expiry'}
                      </td>
                      <td className="dark:text-forest-300 text-on-surface-variant px-3 py-2 whitespace-nowrap">
                        {formatDateTime(lot.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : ledger.isPending ? (
          <p className="dark:text-forest-300 text-on-surface-variant py-6 text-center text-xs">
            Loading wallet ledger...
          </p>
        ) : ledger.isError || !ledger.data || ledger.data.items.length === 0 ? (
          <p className="dark:text-forest-300 text-on-surface-variant py-6 text-center text-xs">
            No credit transactions recorded yet.
          </p>
        ) : (
          <div className="dark:border-forest-800 border-outline-variant overflow-hidden rounded-lg border">
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <tbody className="dark:divide-forest-800 divide-outline-variant/60 divide-y">
                  {ledger.data.items.map((entry, idx) => (
                    <tr key={`${entry.at}-${idx}`}>
                      <td className="dark:text-forest-300 text-on-surface-variant px-3 py-2 whitespace-nowrap">
                        {formatDateTime(entry.at)}
                      </td>
                      <td className="text-on-surface dark:text-forest-100 px-3 py-2">{entry.label}</td>
                      <td
                        className={cn(
                          'px-3 py-2 text-right font-bold whitespace-nowrap tabular-nums',
                          entry.credit ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400',
                        )}
                      >
                        {entry.credit ? '+' : '−'}
                        {entry.quantity.toLocaleString('en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dark:border-forest-800 border-outline-variant border-t px-3 py-2">
              <Pagination
                page={ledgerPage + 1}
                pageCount={Math.max(ledger.data.totalPages, 1)}
                totalItems={ledger.data.totalItems}
                pageSize={LEDGER_PAGE_SIZE}
                onPageChange={(next) => setLedgerPage(Math.max(0, next - 1))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompanyCreditDetailModal({ companyId, onClose }: CompanyCreditDetailModalProps) {
  const { data, isLoading, isError, refetch } = useAdminCompanyCreditDetail(companyId);

  return (
    <Modal
      isOpen={companyId !== null}
      onClose={onClose}
      maxWidth="3xl"
      title={data ? `${data.companyName} — Credit Wallet` : 'Company Credit Wallet'}
      description={
        data?.taxCode
          ? `Company #${data.companyId} · Tax code ${data.taxCode}`
          : companyId
            ? `Company #${companyId}`
            : undefined
      }
      footer={
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      }
    >
      {isLoading ? (
        <p className="dark:text-forest-300 text-on-surface-variant py-8 text-center text-sm">
          Loading wallet details...
        </p>
      ) : isError || !data ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm font-semibold text-rose-600">Unable to load company wallet</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <CompanyCreditDetailBody key={data.companyId} detail={data} />
      )}
    </Modal>
  );
}

'use client';

import { recruiterOrderApi } from '@/apiRequest/recruiter-order';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { formatServicePrice } from '@/utils/service-package';
import { getErrorMessage } from '@/utils/error';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Awaiting admin review',
  APPROVED: 'Refund approved',
  REJECTED: 'Refund rejected',
};

interface OrderRefundPanelProps {
  code: string;
  onRequested: () => void;
}

export default function OrderRefundPanel({ code, onRequested }: OrderRefundPanelProps) {
  const quote = useQuery({
    queryKey: ['recruiter', 'orders', code, 'refund'],
    queryFn: () => recruiterOrderApi.refundQuote(code),
  });
  const banks = useQuery({
    queryKey: ['recruiter', 'orders', 'refund-banks'],
    queryFn: recruiterOrderApi.refundBanks,
    staleTime: 60 * 60 * 1000,
  });

  const [reason, setReason] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (quote.isPending || quote.isError) return null;

  const data = quote.data;
  if (data.existingStatus === null && !data.requestable) return null;

  const canSubmit =
    reason.trim().length > 0 &&
    bankCode !== '' &&
    bankAccountNumber.trim().length > 0 &&
    bankAccountName.trim().length > 0;

  const send = async () => {
    setIsSending(true);
    setError(null);
    try {
      await recruiterOrderApi.requestRefund(code, {
        reason: reason.trim(),
        bankCode,
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountName: bankAccountName.trim(),
      });
      setReason('');
      setBankCode('');
      setBankAccountNumber('');
      setBankAccountName('');
      await quote.refetch();
      onRequested();
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="border-outline-variant space-y-3 rounded-2xl border bg-white p-5 shadow-2xs">
      <h3 className="text-on-surface flex items-center gap-2 text-sm font-bold">
        <RotateCcw className="h-4 w-4 text-amber-600" aria-hidden />
        Refund
      </h3>

      {data.existingStatus ? (
        <p className="text-on-surface-variant text-sm">{STATUS_LABEL[data.existingStatus]}</p>
      ) : (
        <>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            Only services that are <strong>not yet activated</strong> can be refunded. Services already applied to a job
            count as used and run until they expire. Refundable amount for this order:{' '}
            <strong className="text-on-surface">{formatServicePrice(data.refundableAmount, 'VND')}</strong> of{' '}
            {formatServicePrice(data.orderTotal, 'VND')}.
          </p>

          <Textarea
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Tell us why you want this refund"
          />

          <div className="border-outline-variant space-y-3 rounded-xl border border-dashed p-3.5">
            <p className="text-on-surface text-xs font-bold">Where should we send the money?</p>
            <Select
              label="Bank"
              value={bankCode}
              onChange={(event) => setBankCode(event.target.value)}
              options={[
                { value: '', label: banks.isPending ? 'Loading banks…' : 'Select a bank' },
                ...(banks.data ?? []).map((bank) => ({ value: bank.code, label: `${bank.code} — ${bank.name}` })),
              ]}
            />
            <Input
              label="Account number"
              value={bankAccountNumber}
              onChange={(event) => setBankAccountNumber(event.target.value)}
              placeholder="e.g. 0123456789"
            />
            <Input
              label="Account holder name"
              value={bankAccountName}
              onChange={(event) => setBankAccountName(event.target.value)}
              placeholder="As printed on the bank card"
            />
          </div>

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

          <Button size="sm" disabled={!canSubmit} isLoading={isSending} onClick={send}>
            Submit refund request
          </Button>

          <p className="text-on-surface-variant text-[11px]">
            Refunds are transferred manually by bank after an admin approves them; the system does not transfer
            automatically.
          </p>
        </>
      )}
    </section>
  );
}

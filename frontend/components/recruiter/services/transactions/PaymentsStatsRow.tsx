import type { PaymentTransactionSummary } from '@/types/recruiter-order';
import { formatServicePrice } from '@/utils/service-package';
import { Receipt, Wallet } from 'lucide-react';

interface PaymentsStatsRowProps {
  summary?: PaymentTransactionSummary;
}

export default function PaymentsStatsRow({ summary }: PaymentsStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="border-outline-variant flex flex-col justify-between rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant font-semibold tracking-wide uppercase">
            Total payments
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Receipt className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-navy text-2xl font-bold">{summary ? summary.totalCount : '–'}</p>
          <p className="text-label-sm text-on-surface-variant mt-0.5 font-medium">Bank transfers received</p>
        </div>
      </div>
      <div className="border-outline-variant flex flex-col justify-between rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant font-semibold tracking-wide uppercase">
            Total received
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-navy text-2xl font-bold">
            {summary ? formatServicePrice(summary.totalAmount, 'VND') : '–'}
          </p>
          <p className="text-label-sm text-on-surface-variant mt-0.5 font-medium">All-time</p>
        </div>
      </div>
    </div>
  );
}

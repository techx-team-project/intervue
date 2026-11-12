import type { OrderStatusCounts, RecruiterOrderStatus } from '@/types/recruiter-order';
import { Ban, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface OrdersStatsRowProps {
  counts?: OrderStatusCounts;
}

const CARDS: Array<{
  key: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  statuses: RecruiterOrderStatus[];
  tone: string;
}> = [
  {
    key: 'awaiting-payment',
    label: 'Awaiting payment',
    hint: 'Needs your attention',
    icon: Clock,
    statuses: ['PENDING_PAYMENT', 'UNDERPAID'],
    tone: 'bg-amber-100 text-amber-600',
  },
  {
    key: 'activated',
    label: 'Activated',
    hint: 'Service package is active',
    icon: CheckCircle2,
    statuses: ['PAID', 'FULFILLED'],
    tone: 'bg-emerald-100 text-emerald-600',
  },
  {
    key: 'refund',
    label: 'Refund',
    hint: 'Requested or completed',
    icon: RotateCcw,
    statuses: ['REFUND_REQUESTED', 'REFUNDED'],
    tone: 'bg-violet-100 text-violet-600',
  },
  {
    key: 'cancelled',
    label: 'Cancelled / Expired',
    hint: 'No longer payable',
    icon: Ban,
    statuses: ['CANCELLED', 'EXPIRED'],
    tone: 'bg-surface-container-high text-on-surface-variant',
  },
];

function sum(counts: OrderStatusCounts | undefined, statuses: RecruiterOrderStatus[]): number {
  if (!counts) return 0;
  return statuses.reduce((total, status) => total + (counts.byStatus[status] ?? 0), 0);
}

export default function OrdersStatsRow({ counts }: OrdersStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map(({ key, label, hint, icon: Icon, statuses, tone }) => (
        <div key={key} className="border-outline-variant flex flex-col justify-between rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-on-surface-variant font-semibold tracking-wide uppercase">{label}</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-navy text-2xl font-bold">{counts ? sum(counts, statuses) : '–'}</p>
            <p className="text-label-sm text-on-surface-variant mt-0.5 font-medium">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

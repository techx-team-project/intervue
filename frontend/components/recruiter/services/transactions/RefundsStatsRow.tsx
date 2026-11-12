import type { RefundStatus, RefundStatusCounts } from '@/types/recruiter-order';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface RefundsStatsRowProps {
  counts?: RefundStatusCounts;
}

const CARDS: Array<{ key: RefundStatus; label: string; hint: string; icon: LucideIcon; tone: string }> = [
  {
    key: 'PENDING',
    label: 'Pending review',
    hint: 'Waiting on Admin',
    icon: Clock,
    tone: 'bg-amber-100 text-amber-600',
  },
  {
    key: 'APPROVED',
    label: 'Approved',
    hint: 'Refund completed',
    icon: CheckCircle2,
    tone: 'bg-emerald-100 text-emerald-600',
  },
  {
    key: 'REJECTED',
    label: 'Rejected',
    hint: 'Request declined',
    icon: XCircle,
    tone: 'bg-rose-100 text-rose-600',
  },
];

export default function RefundsStatsRow({ counts }: RefundsStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CARDS.map(({ key, label, hint, icon: Icon, tone }) => (
        <div key={key} className="border-outline-variant flex flex-col justify-between rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-on-surface-variant font-semibold tracking-wide uppercase">{label}</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-navy text-2xl font-bold">{counts ? (counts.byStatus[key] ?? 0) : '–'}</p>
            <p className="text-label-sm text-on-surface-variant mt-0.5 font-medium">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

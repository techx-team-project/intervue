import type { AdminAuditEntry, AdminAuditOutcome } from '@/types/admin';
import { Ban, Check, MinusCircle, PencilLine, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AdminAuditFeedProps {
  entries: AdminAuditEntry[];
}

const OUTCOME_ICON: Record<AdminAuditOutcome, LucideIcon> = {
  approved: Check,
  rejected: X,
  locked: Ban,
  updated: PencilLine,
  dismissed: MinusCircle,
};

const OUTCOME_STYLE: Record<AdminAuditOutcome, string> = {
  approved: 'bg-primary/10 text-primary',
  rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
  locked: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
  updated: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
  dismissed: 'bg-[#f1f5f9] text-[#94a3b8] dark:bg-forest-850',
};

export default function AdminAuditFeed({ entries }: AdminAuditFeedProps) {
  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 flex h-full max-h-[34rem] flex-col overflow-hidden rounded-2xl border border-[#e9eaec] bg-white shadow-xs">
      <header className="dark:border-forest-800 flex shrink-0 items-baseline justify-between gap-2 border-b border-[#f1f5f9] px-4 py-3.5">
        <h2 className="text-navy dark:text-forest-50 text-[14px] font-bold">Admin activity</h2>
        <span className="text-[11.5px] text-[#94a3b8]">Today</span>
      </header>

      <ol className="scrollbar-on-hover dark:divide-forest-800 min-h-0 flex-1 divide-y divide-[#f1f5f9] overflow-y-auto">
        {entries.map((entry) => {
          const Icon = OUTCOME_ICON[entry.outcome];

          return (
            <li key={entry.id} className="flex gap-2.5 px-4 py-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${OUTCOME_STYLE[entry.outcome]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="dark:text-forest-200 text-[12.5px] leading-snug text-[#475569]">
                  <span className="text-navy dark:text-forest-50 font-bold">{entry.actorName}</span>{' '}
                  {entry.action.toLowerCase()} <span className="font-semibold">{entry.targetLabel}</span>
                </p>

                <p className="mt-0.5 text-[11.5px] text-[#94a3b8]">
                  {entry.actorRoleLabel} · {entry.at}
                </p>

                {entry.reason && (
                  <p className="dark:text-forest-300 mt-1 text-[11.5px] leading-snug text-[#64748b]">
                    “{entry.reason}”
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

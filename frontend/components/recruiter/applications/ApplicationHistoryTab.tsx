import { APPLICATION_STATUS_META } from '@/constants/application-status';
import { cn } from '@/lib/utils';
import type { ApplicationStatusChange } from '@/types/recruiter-application';
import { formatDateTime } from '@/utils/datetime';

interface ApplicationHistoryTabProps {
  history: ApplicationStatusChange[];
}

export default function ApplicationHistoryTab({ history }: ApplicationHistoryTabProps) {
  const entries = [...history].reverse();

  return (
    <ol className="relative space-y-4 pl-6">
      <span className="absolute top-2 bottom-2 left-[7px] w-px bg-[#e2e8f0]" />

      {entries.map((entry, index) => (
        <li key={entry.id} className="relative">
          <span
            className={cn(
              'absolute top-1 -left-[23px] h-3.5 w-3.5 rounded-full border-2 border-white shadow-2xs',
              index === 0 ? 'bg-primary' : 'bg-[#cbd5e1]',
            )}
          />

          <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[11px] font-bold',
                  APPLICATION_STATUS_META[entry.to].chipClassName,
                )}
              >
                {APPLICATION_STATUS_META[entry.to].label}
              </span>
              {entry.from && (
                <span className="text-[11px] text-[#94a3b8]">from {APPLICATION_STATUS_META[entry.from].label}</span>
              )}
            </div>

            <p className="mt-1.5 text-[12px] text-[#64748b]">
              {entry.changedBy} • {formatDateTime(entry.changedAt)}
            </p>

            {entry.reason && <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700">{entry.reason}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

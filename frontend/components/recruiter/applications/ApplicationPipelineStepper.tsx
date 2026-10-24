import { ACTIVE_APPLICATION_STATUSES, APPLICATION_STATUS_META } from '@/constants/application-status';
import { cn } from '@/lib/utils';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { formatDate } from '@/utils/datetime';
import { Check, XCircle } from 'lucide-react';

interface ApplicationPipelineStepperProps {
  application: RecruiterApplication;
}

function getReachedIndex(application: RecruiterApplication): number {
  const activeIndex = ACTIVE_APPLICATION_STATUSES.indexOf(application.status);
  if (activeIndex >= 0) return activeIndex;

  const lastActive = [...application.statusHistory]
    .reverse()
    .find((entry) => ACTIVE_APPLICATION_STATUSES.includes(entry.to));

  return lastActive ? ACTIVE_APPLICATION_STATUSES.indexOf(lastActive.to) : 0;
}

export default function ApplicationPipelineStepper({ application }: ApplicationPipelineStepperProps) {
  const reachedIndex = getReachedIndex(application);
  const isClosed = !ACTIVE_APPLICATION_STATUSES.includes(application.status);

  return (
    <section className="rounded-2xl border border-[#e5e9ef] bg-white p-4 shadow-xs sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-navy text-[13.5px] font-bold">Hiring progress</h2>
        {isClosed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11.5px] font-bold text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            {APPLICATION_STATUS_META[application.status].label}
          </span>
        )}
      </div>

      <ol className="mt-4 flex items-start gap-1 overflow-x-auto pb-1">
        {ACTIVE_APPLICATION_STATUSES.map((status, index) => {
          const isDone = index < reachedIndex;
          const isCurrent = index === reachedIndex && !isClosed;
          const historyEntry = [...application.statusHistory].reverse().find((entry) => entry.to === status);

          return (
            <li key={status} className="flex min-w-[7.5rem] flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    'h-0.5 flex-1 rounded-full',
                    index === 0 ? 'bg-transparent' : isDone || isCurrent ? 'bg-primary' : 'bg-[#e2e8f0]',
                  )}
                />
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11.5px] font-black transition',
                    isCurrent && !isClosed && 'border-primary bg-primary text-white',
                    isDone && 'border-primary bg-primary text-white',
                    !isDone && !isCurrent && 'border-[#e2e8f0] bg-white text-[#94a3b8]',
                    isClosed && index === reachedIndex && 'border-slate-300 bg-slate-200 text-slate-600',
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'h-0.5 flex-1 rounded-full',
                    index === ACTIVE_APPLICATION_STATUSES.length - 1
                      ? 'bg-transparent'
                      : isDone
                        ? 'bg-primary'
                        : 'bg-[#e2e8f0]',
                  )}
                />
              </div>

              <p
                className={cn(
                  'mt-2 text-[12px] font-bold',
                  isCurrent ? 'text-primary' : isDone ? 'text-navy' : 'text-[#94a3b8]',
                )}
              >
                {APPLICATION_STATUS_META[status].label}
              </p>
              <p className="text-[11px] text-[#94a3b8]">
                {historyEntry ? formatDate(historyEntry.changedAt) : 'Not reached yet'}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

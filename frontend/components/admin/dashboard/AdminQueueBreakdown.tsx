import { QUEUE_BAR_COLOR } from '@/constants/admin-work';
import type { AdminQueueSummary } from '@/types/admin';

interface AdminQueueBreakdownProps {
  queues: AdminQueueSummary[];
}

export default function AdminQueueBreakdown({ queues }: AdminQueueBreakdownProps) {
  const pending = queues.filter((queue) => queue.count > 0);
  const total = pending.reduce((sum, queue) => sum + queue.count, 0);

  if (total === 0) return null;

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-navy dark:text-forest-50 text-[14px] font-bold">What is waiting</h2>
        <span className="text-[11.5px] text-[#94a3b8]">{pending.length} queues</span>
      </div>

      <div className="dark:bg-forest-850 mt-3 flex h-2.5 overflow-hidden rounded-full bg-[#f1f5f9]" role="presentation">
        {pending.map((queue) => (
          <span
            key={queue.key}
            style={{ width: `${(queue.count / total) * 100}%` }}
            className={QUEUE_BAR_COLOR[queue.key]}
          />
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {pending.map((queue) => (
          <li key={queue.key} className="flex items-center gap-1.5 text-[12px]">
            <span className={`h-2 w-2 shrink-0 rounded-full ${QUEUE_BAR_COLOR[queue.key]}`} aria-hidden="true" />
            <span className="dark:text-forest-300 text-[#64748b]">{queue.label}</span>
            <span className="text-navy dark:text-forest-50 font-bold tabular-nums">{queue.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

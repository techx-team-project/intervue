import type { RecruiterPriorityItem } from '@/types/recruiter';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TodayPrioritiesProps {
  items: RecruiterPriorityItem[];
}

export default function TodayPriorities({ items }: TodayPrioritiesProps) {
  return (
    <section className="border-outline-variant flex h-full flex-col rounded-xl border bg-white p-6">
      <h2 className="text-navy text-body-lg font-bold">Cần xử lý hôm nay</h2>

      {items.length === 0 ? (
        <p className="text-body-md text-on-surface-variant mt-4">Hôm nay chưa có việc gấp nào.</p>
      ) : (
        <ul className="divide-outline-variant mt-3 flex-1 divide-y">
          {items.map((item) => {
            const Icon = item.icon;
            const isWarning = item.tone === 'warning';

            return (
              <li key={item.id}>
                <Link href={item.href} className="group flex items-center gap-3 py-3.5">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${isWarning ? 'text-amber-600' : 'text-on-surface-variant'}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-navy text-body-md truncate font-semibold">{item.label}</p>
                    <p className="text-label-sm text-on-surface-variant truncate">{item.description}</p>
                  </div>

                  <ChevronRight className="text-outline group-hover:text-navy h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

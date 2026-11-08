import type { RecruiterPriorityItem } from '@/types/recruiter';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TodayPrioritiesProps {
  items: RecruiterPriorityItem[];
}

export default function TodayPriorities({ items }: TodayPrioritiesProps) {
  return (
    <div className="border-outline-variant flex h-full flex-col rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
      <h2 className="text-navy text-body-lg font-bold">Today’s priorities</h2>

      {items.length === 0 ? (
        <p className="text-body-md text-on-surface-variant mt-4">Nothing needs your attention today 🎉</p>
      ) : (
        <div className="mt-4 flex-1 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isWarning = item.tone === 'warning';

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group hover:bg-surface-container-low flex items-center gap-3 rounded-xl p-2.5 transition"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isWarning ? 'bg-amber-50 text-amber-600' : 'text-primary bg-emerald-50'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-navy text-body-md truncate font-bold">{item.label}</p>
                  <p className="text-label-sm text-outline truncate">{item.description}</p>
                </div>

                <ChevronRight className="text-outline group-hover:text-outline h-4 w-4 shrink-0 transition" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

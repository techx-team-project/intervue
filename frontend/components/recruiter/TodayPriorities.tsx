import type { RecruiterPriorityItem } from '@/types/recruiter';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TodayPrioritiesProps {
  items: RecruiterPriorityItem[];
}

export default function TodayPriorities({ items }: TodayPrioritiesProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <h2 className="text-navy text-[15px] font-black">Việc cần làm hôm nay</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-[13px] text-[#64748b]">Không có việc cần xử lý hôm nay 🎉</p>
      ) : (
        <div className="mt-4 flex-1 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isWarning = item.tone === 'warning';

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-[#f8fafc]"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isWarning ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-[#00873c]'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-navy truncate text-[13px] font-bold">{item.label}</p>
                  <p className="truncate text-[11.5px] text-[#94a3b8]">{item.description}</p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-[#cbd5e1] transition group-hover:text-[#94a3b8]" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

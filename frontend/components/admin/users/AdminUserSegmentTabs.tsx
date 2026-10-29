'use client';

import { USER_SEGMENTS } from '@/constants/admin-user';
import { cn } from '@/lib/utils';
import type { AdminUserSegment, AdminUserSegmentCount } from '@/types/admin-user';

interface AdminUserSegmentTabsProps {
  active: AdminUserSegment;
  counts: AdminUserSegmentCount[];
  onChange: (segment: AdminUserSegment) => void;
}

export default function AdminUserSegmentTabs({ active, counts, onChange }: AdminUserSegmentTabsProps) {
  const countFor = (segment: AdminUserSegment) => counts.find((entry) => entry.segment === segment)?.count ?? 0;

  return (
    <div className="dark:border-forest-800 -mx-1 overflow-x-auto border-b border-[#e9eaec] px-1">
      <div role="tablist" aria-label="User segments" className="flex min-w-max items-center gap-1">
        {USER_SEGMENTS.map(({ segment, label }) => {
          const isActive = segment === active;
          const count = countFor(segment);

          return (
            <button
              key={segment}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(segment)}
              className={cn(
                'relative flex cursor-pointer items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold whitespace-nowrap transition-colors',
                isActive
                  ? 'text-primary'
                  : 'dark:text-forest-300 dark:hover:text-forest-100 text-[#64748b] hover:text-[#334155]',
              )}
            >
              {label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10.5px] font-black',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'dark:bg-forest-850 dark:text-forest-300 bg-slate-100 text-slate-500',
                )}
              >
                {count}
              </span>

              {isActive && <span className="bg-primary absolute inset-x-2 -bottom-px h-0.5 rounded-full" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

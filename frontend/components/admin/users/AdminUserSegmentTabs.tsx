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
    <div className="dark:border-forest-800 border-outline-variant -mx-1 overflow-x-auto border-b px-1">
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
                'text-body-md relative flex cursor-pointer items-center gap-1.5 px-3 py-2.5 font-bold whitespace-nowrap transition-colors',
                isActive
                  ? 'text-primary'
                  : 'dark:text-forest-300 dark:hover:text-forest-100 text-on-surface-variant hover:text-on-surface-variant',
              )}
            >
              {label}
              <span
                className={cn(
                  'text-label-sm rounded-full px-1.5 py-0.5 font-bold',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'dark:bg-forest-850 dark:text-forest-300 bg-surface-container-high text-on-surface-variant',
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

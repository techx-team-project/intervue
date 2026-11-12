'use client';

import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

export type JobDetailNavItem = { id: string; label: string };

type JobDetailNavProps = {
  items: JobDetailNavItem[];
};

export default function JobDetailNav({ items }: JobDetailNavProps) {
  const activeId = useActiveSection(items.map((item) => item.id));

  return (
    <nav
      aria-label="Job sections"
      className="bg-surface border-outline-variant no-scrollbar sticky top-16 z-30 -mx-4 overflow-x-auto border-b px-4 sm:mx-0 sm:rounded-2xl sm:border"
    >
      <ul className="flex gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={cn(
                'text-body-md -mb-px block border-b-2 px-3.5 py-3.5 font-semibold whitespace-nowrap transition-colors',
                activeId === item.id
                  ? 'border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

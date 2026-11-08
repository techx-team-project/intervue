import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface AdminUserFact {
  label: string;
  value: ReactNode;
  hint?: string;
}

interface AdminUserFactListProps {
  facts: AdminUserFact[];
  className?: string;
}

export default function AdminUserFactList({ facts, className }: AdminUserFactListProps) {
  return (
    <dl className={cn('dark:divide-forest-800 divide-y divide-[#f1f5f9]', className)}>
      {facts.map((fact) => (
        <div key={fact.label} className="text-body-sm flex items-baseline justify-between gap-4 py-2.5">
          <dt className="dark:text-forest-300 text-on-surface-variant shrink-0">{fact.label}</dt>
          <dd className="text-navy dark:text-forest-100 min-w-0 text-right font-semibold">
            {fact.value}
            {fact.hint && <span className="text-label-sm text-outline mt-0.5 block font-normal">{fact.hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

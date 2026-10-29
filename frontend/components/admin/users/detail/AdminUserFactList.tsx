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
        <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5 text-[12.5px]">
          <dt className="dark:text-forest-300 shrink-0 text-[#64748b]">{fact.label}</dt>
          <dd className="text-navy dark:text-forest-100 min-w-0 text-right font-semibold">
            {fact.value}
            {fact.hint && <span className="mt-0.5 block text-[11px] font-normal text-[#94a3b8]">{fact.hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

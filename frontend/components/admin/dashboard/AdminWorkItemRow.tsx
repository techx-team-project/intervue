'use client';

import { WORK_ITEM_KIND_CHIP, WORK_ITEM_KIND_LABEL } from '@/constants/admin-work';
import { cn } from '@/lib/utils';
import type { AdminWorkItem } from '@/types/admin';
import { Check, ChevronDown, Clock, X } from 'lucide-react';

interface AdminWorkItemRowProps {
  item: AdminWorkItem;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function AdminWorkItemRow({ item, isExpanded, onToggle, onApprove, onReject }: AdminWorkItemRowProps) {
  return (
    <li
      className={cn(
        'transition-colors',
        isExpanded ? 'dark:bg-forest-850/40 bg-[#f8fafc]' : 'dark:hover:bg-forest-850/40 hover:bg-[#f8fafc]',
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
        >
          <span
            className={cn(
              'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ring-1 ring-inset',
              WORK_ITEM_KIND_CHIP[item.kind],
            )}
          >
            {WORK_ITEM_KIND_LABEL[item.kind]}
          </span>

          <span className="min-w-0 flex-1">
            <span className="text-navy dark:text-forest-50 block truncate text-[13.5px] font-bold">{item.subject}</span>
            <span className="dark:text-forest-300 block truncate text-[12px] text-[#64748b]">{item.context}</span>
          </span>

          <span className="hidden shrink-0 items-center gap-1 text-[11.5px] text-[#94a3b8] sm:flex">
            <Clock className="h-3 w-3" />
            {item.waitingLabel}
          </span>

          <ChevronDown
            className={cn('h-4 w-4 shrink-0 text-[#cbd5e1] transition-transform', isExpanded && 'rotate-180')}
          />
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onApprove}
            title="Approve"
            aria-label={`Approve ${item.subject}`}
            className="bg-primary/10 text-primary hover:bg-primary/20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onReject}
            title="Reject with a reason"
            aria-label={`Reject ${item.subject}`}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-500/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <dl className="dark:border-forest-800 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[#f1f5f9] px-4 py-3 sm:grid-cols-2">
          {item.facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <dt className="dark:text-forest-300 shrink-0 text-[#64748b]">{fact.label}</dt>
              <dd className="text-navy dark:text-forest-100 min-w-0 truncate text-right font-semibold">{fact.value}</dd>
            </div>
          ))}

          <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
            <dt className="dark:text-forest-300 shrink-0 text-[#64748b]">Submitted</dt>
            <dd className="text-navy dark:text-forest-100 min-w-0 truncate text-right font-semibold">
              {item.submittedAt}
            </dd>
          </div>
        </dl>
      )}
    </li>
  );
}

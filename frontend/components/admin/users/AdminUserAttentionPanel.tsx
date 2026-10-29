'use client';

import { cn } from '@/lib/utils';
import type { AdminUserAttentionItem, AdminUserSegment } from '@/types/admin-user';
import { ArrowRight, CheckCircle2, TriangleAlert } from 'lucide-react';

interface AdminUserAttentionPanelProps {
  items: AdminUserAttentionItem[];
  onSelectSegment: (segment: AdminUserSegment) => void;
}

const TONE_CLASS: Record<AdminUserAttentionItem['tone'], string> = {
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
};

export default function AdminUserAttentionPanel({ items, onSelectSegment }: AdminUserAttentionPanelProps) {
  if (items.length === 0) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 flex items-center gap-3 rounded-2xl border border-[#e9eaec] bg-white p-3.5 shadow-xs">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <p className="dark:text-forest-200 text-[12.5px] text-[#475569]">
          Nothing needs attention on these accounts right now.
        </p>
      </div>
    );
  }

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e9eaec] bg-white p-3.5 shadow-xs">
      <header className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4 shrink-0 text-amber-600" />
        <h2 className="text-navy dark:text-forest-50 text-[13px] font-bold">Needs attention</h2>
        <span className="dark:text-forest-400 text-[11.5px] text-[#94a3b8]">counted from the accounts below</span>
      </header>

      <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((item) => {
          const body = (
            <>
              <span
                className={cn(
                  'flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 text-[11.5px] font-black ring-1 ring-inset',
                  TONE_CLASS[item.tone],
                )}
              >
                {item.count}
              </span>
              <span className="dark:text-forest-200 min-w-0 flex-1 text-[12.5px] text-[#475569]">{item.label}</span>
              {item.segment && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#cbd5e1]" />}
            </>
          );

          const shell =
            'dark:border-forest-800 flex items-center gap-2.5 rounded-xl border border-[#f1f5f9] px-3 py-2.5 text-left';

          if (!item.segment) {
            return (
              <li key={item.key} className={shell}>
                {body}
              </li>
            );
          }

          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onSelectSegment(item.segment as AdminUserSegment)}
                className={cn(shell, 'dark:hover:bg-forest-850/40 w-full cursor-pointer transition hover:bg-[#f8fafc]')}
              >
                {body}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

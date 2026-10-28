'use client';

import { WORK_ITEM_KIND_LABEL } from '@/constants/admin-work';
import { cn } from '@/lib/utils';
import type { AdminWorkItem, AdminWorkItemKind } from '@/types/admin';
import { Inbox } from 'lucide-react';
import { useState } from 'react';
import AdminWorkItemRow from './AdminWorkItemRow';

interface AdminWorklistProps {
  items: AdminWorkItem[];
  initialKind?: AdminWorkItemKind;
  onApprove: (item: AdminWorkItem) => void;
  onReject: (item: AdminWorkItem) => void;
}

export default function AdminWorklist({ items, initialKind, onApprove, onReject }: AdminWorklistProps) {
  const [kindFilter, setKindFilter] = useState<AdminWorkItemKind | 'all'>(initialKind ?? 'all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const kinds = Array.from(new Set(items.map((item) => item.kind)));
  const visible = kindFilter === 'all' ? items : items.filter((item) => item.kind === kindFilter);

  const chipClass = (isActive: boolean) =>
    cn(
      'cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-bold transition-colors',
      isActive
        ? 'bg-primary text-white'
        : 'text-[#64748b] hover:bg-[#f1f5f9] dark:text-forest-300 dark:hover:bg-forest-850',
    );

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-[#e9eaec] bg-white shadow-xs">
      <header className="dark:border-forest-800 flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] px-4 py-3.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-navy dark:text-forest-50 text-[14px] font-bold">Next up</h2>
          <span className="text-[11.5px] text-[#94a3b8]">{visible.length} shown</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button type="button" onClick={() => setKindFilter('all')} className={chipClass(kindFilter === 'all')}>
            All
          </button>

          {kinds.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setKindFilter(kind)}
              className={chipClass(kindFilter === kind)}
            >
              {WORK_ITEM_KIND_LABEL[kind]}
            </button>
          ))}
        </div>
      </header>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
          <Inbox className="h-7 w-7 text-[#cbd5e1]" />
          <p className="text-navy dark:text-forest-50 text-[13px] font-bold">
            {items.length === 0 ? 'Everything here is handled' : 'Nothing left in this filter'}
          </p>
          <p className="text-[12px] text-[#94a3b8]">
            {items.length === 0
              ? 'New submissions will appear here as they arrive.'
              : 'Switch back to All to see the rest of the queue.'}
          </p>
        </div>
      ) : (
        <ul className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
          {visible.map((item) => (
            <AdminWorkItemRow
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              onApprove={() => onApprove(item)}
              onReject={() => onReject(item)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

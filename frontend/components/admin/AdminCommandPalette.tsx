'use client';

import { flattenItems, visibleSections } from '@/lib/admin-nav';
import { cn } from '@/lib/utils';
import type { AdminPermission, AdminQueueCounts } from '@/types/admin';
import { CornerDownLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface AdminCommandPaletteProps {
  onClose: () => void;
  queueCounts: AdminQueueCounts;
  permissions?: AdminPermission[];
}

interface PaletteEntry {
  sectionTitle: string;
  label: string;
  href: string;
  pending: number;
}

export default function AdminCommandPalette({ onClose, queueCounts, permissions }: AdminCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { entries, comingSoonCount } = useMemo(() => {
    const available: PaletteEntry[] = [];
    let soon = 0;

    visibleSections(permissions).forEach((section) => {
      flattenItems(section.items).forEach((item) => {
        if (!item.href) return;
        if (item.comingSoon) {
          soon += 1;
          return;
        }
        available.push({
          sectionTitle: section.title,
          label: item.label,
          href: item.href,
          pending: item.queue ? (queueCounts[item.queue] ?? 0) : 0,
        });
      });
    });

    return { entries: available, comingSoonCount: soon };
  }, [permissions, queueCounts]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => `${entry.sectionTitle} ${entry.label}`.toLowerCase().includes(needle));
  }, [entries, query]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const select = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (results.length === 0 ? 0 : (prev + 1) % results.length));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (results.length === 0 ? 0 : (prev - 1 + results.length) % results.length));
      return;
    }

    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      select(results[activeIndex].href);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette" className="fixed inset-0 z-60">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/55" />

      <div
        onKeyDown={handleKeyDown}
        className="absolute inset-x-4 top-20 mx-auto max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:inset-x-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Jump to a section…"
            aria-label="Jump to a section"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <kbd className="shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
            Esc
          </kbd>
        </div>

        <div className="scrollbar-on-hover max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-[13px] text-slate-500">No section matches “{query}”.</p>
          ) : (
            results.map((entry, index) => (
              <button
                key={entry.href}
                type="button"
                onClick={() => select(entry.href)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                  index === activeIndex ? 'bg-emerald-50' : 'hover:bg-slate-50',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-slate-800">{entry.label}</span>
                  <span className="block truncate text-xs text-slate-500">{entry.sectionTitle}</span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  {entry.pending > 0 && (
                    <span className="text-xs font-bold text-rose-600 tabular-nums">{entry.pending}</span>
                  )}
                  {index === activeIndex && <CornerDownLeft className="h-3.5 w-3.5 text-emerald-600" />}
                </span>
              </button>
            ))
          )}
        </div>

        {comingSoonCount > 0 && (
          <p className="border-t border-slate-100 px-4 py-2.5 text-xs text-slate-400">
            {comingSoonCount} more sections are planned but not built yet.
          </p>
        )}
      </div>
    </div>
  );
}

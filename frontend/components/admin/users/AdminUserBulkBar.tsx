'use client';

import { Lock, LogOut, X } from 'lucide-react';

interface AdminUserBulkBarProps {
  selectedCount: number;
  onClear: () => void;
  onLock: () => void;
  onRevokeSessions: () => void;
}

export default function AdminUserBulkBar({ selectedCount, onClear, onLock, onRevokeSessions }: AdminUserBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 fixed inset-x-0 bottom-0 z-50 border-t border-[#e2e8f0] bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] sm:px-6 lg:static lg:rounded-2xl lg:border lg:shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary rounded-full px-2.5 py-0.5 text-[12px] font-black text-white">
            {selectedCount}
          </span>
          <span className="text-navy dark:text-forest-50 text-[13px] font-bold">
            {selectedCount === 1 ? 'account selected' : 'accounts selected'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRevokeSessions}
            className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Revoke sessions
          </button>

          <button
            type="button"
            onClick={onLock}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-[12.5px] font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/10"
          >
            <Lock className="h-3.5 w-3.5" />
            Lock accounts
          </button>

          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="dark:text-forest-300 dark:hover:bg-forest-850 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Ban, LogOut, X } from 'lucide-react';

interface AdminUserBulkBarProps {
  selectedCount: number;
  onClear: () => void;
  onBan: () => void;
  onRevokeSessions: () => void;
}

export default function AdminUserBulkBar({ selectedCount, onClear, onBan, onRevokeSessions }: AdminUserBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant fixed inset-x-0 bottom-0 z-50 border-t bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] sm:px-6 lg:static lg:rounded-2xl lg:border lg:shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-body-sm rounded-full px-2.5 py-0.5 font-bold text-white">
            {selectedCount}
          </span>
          <span className="text-navy dark:text-forest-50 text-body-md font-bold">
            {selectedCount === 1 ? 'account selected' : 'accounts selected'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRevokeSessions}
            className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 border-outline-variant text-body-sm text-on-surface hover:bg-surface-container-low inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-bold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Revoke sessions
          </button>

          <button
            type="button"
            onClick={onBan}
            className="text-body-sm inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/10"
          >
            <Ban className="h-3.5 w-3.5" />
            Ban
          </button>

          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="dark:text-forest-300 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-high flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Check, Pause, TimerReset, X, XCircle } from 'lucide-react';

interface JobPostsBulkBarProps {
  selectedCount: number;
  onPauseSelected: () => void;
  onExtendSelected: () => void;
  onCloseSelected: () => void;
  onDeselectAll: () => void;
  isPending?: boolean;
}

export default function JobPostsBulkBar({
  selectedCount,
  onPauseSelected,
  onExtendSelected,
  onCloseSelected,
  onDeselectAll,
  isPending = false,
}: JobPostsBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md duration-200">
      <div className="flex items-center gap-2 pr-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </span>
        <span className="text-xs font-bold whitespace-nowrap">
          {selectedCount} {selectedCount === 1 ? 'job' : 'jobs'} selected
        </span>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={isPending}
          onClick={onPauseSelected}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          <Pause className="h-3.5 w-3.5" />
          <span>Pause</span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={onExtendSelected}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          <TimerReset className="h-3.5 w-3.5" />
          <span>Extend 30d</span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={onCloseSelected}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-950/60 hover:text-rose-200 disabled:opacity-50"
        >
          <XCircle className="h-3.5 w-3.5" />
          <span>Close</span>
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      <button
        type="button"
        disabled={isPending}
        onClick={onDeselectAll}
        className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
        title="Deselect all"
      >
        <X className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Deselect</span>
      </button>
    </div>
  );
}

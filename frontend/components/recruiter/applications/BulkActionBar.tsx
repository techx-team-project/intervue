'use client';

import type { ApplicationStatus } from '@/types/recruiter-application';
import { Bookmark, X, XCircle } from 'lucide-react';
import ApplicationStatusMenu from './ApplicationStatusMenu';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onChangeStatus: (status: ApplicationStatus) => void;
  onReject: () => void;
  onSave: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onClear,
  onChangeStatus,
  onReject,
  onSave,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl sm:inset-x-4 sm:bottom-6">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-700 bg-[#1e293b] px-3.5 py-3 shadow-2xl">
        <p className="mr-auto text-[12.5px] font-bold text-white">
          <span className="text-emerald-300">{selectedCount}</span> applications selected
        </p>

        <ApplicationStatusMenu onSelect={onChangeStatus} align="right" label="Change status" />

        <button
          type="button"
          onClick={onSave}
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-600 px-3 py-2 text-[12.5px] font-bold text-slate-100 transition-colors hover:bg-slate-700 sm:flex-none"
        >
          <Bookmark className="h-3.5 w-3.5" />
          Save
        </button>

        <button
          type="button"
          onClick={onReject}
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-rose-700 sm:flex-none"
        >
          <XCircle className="h-3.5 w-3.5" />
          Close
        </button>

        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

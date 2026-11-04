'use client';

import type { BusinessDocumentType, DocumentReviewStatus } from '@/types/recruiter-company';
import { RotateCcw, Search, X } from 'lucide-react';

export interface AdminVerificationFilterState {
  keyword: string;
  reviewStatus: DocumentReviewStatus | 'ALL';
  documentType: BusinessDocumentType | 'ALL';
}

interface AdminBusinessVerificationFilterBarProps {
  filters: AdminVerificationFilterState;
  onChange: (updated: Partial<AdminVerificationFilterState>) => void;
  onReset: () => void;
}

export function AdminBusinessVerificationFilterBar({
  filters,
  onChange,
  onReset,
}: AdminBusinessVerificationFilterBarProps) {
  const hasActiveFilters =
    filters.keyword.trim().length > 0 || filters.reviewStatus !== 'ALL' || filters.documentType !== 'ALL';

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="dark:text-forest-400 pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          placeholder="Search by company name, Tax ID, or submitter..."
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 dark:placeholder-forest-500 w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-9 pl-9 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
        {filters.keyword && (
          <button
            type="button"
            onClick={() => onChange({ keyword: '' })}
            className="dark:text-forest-400 dark:hover:text-forest-200 absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Selects: Document Type & Status */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.documentType}
          onChange={(e) => onChange({ documentType: e.target.value as BusinessDocumentType | 'ALL' })}
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-200 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
        >
          <option value="ALL">All Document Types</option>
          <option value="BUSINESS_LICENSE">License (ERC)</option>
          <option value="LETTER_OF_AUTHORIZATION">Authorization (LOA)</option>
        </select>

        <select
          value={filters.reviewStatus}
          onChange={(e) => onChange({ reviewStatus: e.target.value as DocumentReviewStatus | 'ALL' })}
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-200 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="MORE_INFO_REQUIRED">More Info Needed</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="REVOKED">Revoked</option>
          <option value="EXPIRED">Expired</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

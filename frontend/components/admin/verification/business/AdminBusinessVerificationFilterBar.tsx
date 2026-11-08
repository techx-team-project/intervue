'use client';

import type { BusinessDocumentType, DocumentReviewStatus } from '@/types/recruiter-company';
import { RotateCcw, Search, X } from 'lucide-react';

export type ExtendedFilterStatus = DocumentReviewStatus | 'ALL' | 'EXPIRING_SOON' | 'SLA_OVERDUE';

export interface AdminVerificationFilterState {
  keyword: string;
  reviewStatus: ExtendedFilterStatus;
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
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 flex flex-col gap-3 rounded-2xl border bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="dark:text-forest-400 text-outline pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={filters.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          placeholder="Search by company name, Tax ID, or submitter email..."
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 dark:placeholder-forest-500 border-outline-variant bg-surface-container-low/70 text-on-surface w-full rounded-xl border py-2 pr-9 pl-9 text-xs font-medium placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
        {filters.keyword && (
          <button
            type="button"
            onClick={() => onChange({ keyword: '' })}
            className="dark:text-forest-400 dark:hover:text-forest-200 text-outline hover:text-on-surface-variant absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1"
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
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-200 border-outline-variant bg-surface-container-low/70 text-on-surface rounded-xl border px-3 py-2 text-xs font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none"
        >
          <option value="ALL">All Document Types</option>
          <option value="BUSINESS_LICENSE">License (ERC)</option>
          <option value="LETTER_OF_AUTHORIZATION">Authorization (LOA)</option>
        </select>

        <select
          value={filters.reviewStatus}
          onChange={(e) => onChange({ reviewStatus: e.target.value as ExtendedFilterStatus })}
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-200 border-outline-variant bg-surface-container-low/70 text-on-surface rounded-xl border px-3 py-2 text-xs font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none"
        >
          <option value="ALL">All Review Statuses</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="SLA_OVERDUE">SLA Overdue (&gt;24h)</option>
          <option value="MORE_INFO_REQUIRED">Needs Action</option>
          <option value="APPROVED">Approved</option>
          <option value="EXPIRING_SOON">Expiring Soon (&lt;30d)</option>
          <option value="REJECTED">Rejected</option>
          <option value="REVOKED">Revoked</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface inline-flex items-center gap-1 rounded-xl border bg-white px-3 py-2 text-xs font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

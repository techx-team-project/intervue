'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Spinner from '@/components/common/Spinner';
import type { Page } from '@/types/api';
import type {
  AdminBusinessVerificationListResource,
  BusinessVerificationSummaryResource,
} from '@/types/recruiter-company';
import { AlertTriangle, Building2, Calendar, Clock, FileText, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdminCompanyDirectoryTable } from './AdminCompanyDirectoryTable';
import {
  AdminBusinessVerificationFilterBar,
  type AdminVerificationFilterState,
  type ExtendedFilterStatus,
} from './AdminBusinessVerificationFilterBar';
import { AdminBusinessVerificationSummaryRow } from './AdminBusinessVerificationSummaryRow';
import { AdminBusinessVerificationTable } from './AdminBusinessVerificationTable';
import { isDocumentExpiringWithinDays } from './mock-verification-data';
import { useMockVerificationStore } from './useMockVerificationStore';

export type VerificationTabKey = 'QUEUE' | 'NEED_INFO' | 'APPROVED' | 'EXPIRING' | 'COMPANIES' | 'ALL';

export interface AdminBusinessVerificationListViewProps {
  initialSummary?: BusinessVerificationSummaryResource;
  initialPage?: Page<AdminBusinessVerificationListResource>;
}

export function AdminBusinessVerificationListView({}: AdminBusinessVerificationListViewProps = {}) {
  const { dossiers, companies, summary, isReady, reset } = useMockVerificationStore();

  const [activeTab, setActiveTab] = useState<VerificationTabKey>('QUEUE');
  const [filters, setFilters] = useState<AdminVerificationFilterState>({
    keyword: '',
    reviewStatus: 'ALL',
    documentType: 'ALL',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Filter dossiers based on tab and active filters
  const filteredDossiers = useMemo(() => {
    return dossiers.filter((d) => {
      // Tab constraint
      if (activeTab === 'QUEUE' && d.document.reviewStatus !== 'PENDING_REVIEW') return false;
      if (activeTab === 'NEED_INFO' && d.document.reviewStatus !== 'MORE_INFO_REQUIRED') return false;
      if (activeTab === 'APPROVED' && d.document.reviewStatus !== 'APPROVED') return false;
      if (activeTab === 'EXPIRING') {
        if (!isDocumentExpiringWithinDays(d.document.expiresAt, d.document.reviewStatus, 30)) return false;
      }

      // Filter bar keyword
      if (filters.keyword.trim()) {
        const kw = filters.keyword.trim().toLowerCase();
        const matchName = d.company.name.toLowerCase().includes(kw);
        const matchTrading = d.company.tradingName?.toLowerCase().includes(kw) ?? false;
        const matchTax = d.company.taxCode.includes(kw);
        const matchSubmitter =
          d.submitter.fullName.toLowerCase().includes(kw) || d.submitter.email.toLowerCase().includes(kw);
        if (!matchName && !matchTrading && !matchTax && !matchSubmitter) return false;
      }

      // Filter bar Document Type
      if (filters.documentType !== 'ALL' && d.document.documentType !== filters.documentType) {
        return false;
      }

      // Filter bar Status
      if (filters.reviewStatus !== 'ALL') {
        if (filters.reviewStatus === 'SLA_OVERDUE') {
          if (!d.isSlaOverdue || d.document.reviewStatus !== 'PENDING_REVIEW') return false;
        } else if (filters.reviewStatus === 'EXPIRING_SOON') {
          if (!isDocumentExpiringWithinDays(d.document.expiresAt, d.document.reviewStatus, 30)) return false;
        } else if (d.document.reviewStatus !== filters.reviewStatus) {
          return false;
        }
      }

      return true;
    });
  }, [dossiers, activeTab, filters]);

  // Paginated items
  const paginatedDossiers = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredDossiers.slice(start, start + pageSize);
  }, [filteredDossiers, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (updated: Partial<AdminVerificationFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(0);
  };

  const handleSelectStatusFromSummary = (status: ExtendedFilterStatus) => {
    if (status === 'ALL') {
      setActiveTab('ALL');
      setFilters((prev) => ({ ...prev, reviewStatus: 'ALL' }));
    } else if (status === 'PENDING_REVIEW') {
      setActiveTab('QUEUE');
      setFilters((prev) => ({ ...prev, reviewStatus: 'ALL' }));
    } else if (status === 'MORE_INFO_REQUIRED') {
      setActiveTab('NEED_INFO');
      setFilters((prev) => ({ ...prev, reviewStatus: 'ALL' }));
    } else if (status === 'APPROVED') {
      setActiveTab('APPROVED');
      setFilters((prev) => ({ ...prev, reviewStatus: 'ALL' }));
    } else if (status === 'EXPIRING_SOON') {
      setActiveTab('EXPIRING');
      setFilters((prev) => ({ ...prev, reviewStatus: 'ALL' }));
    } else {
      setActiveTab('ALL');
      setFilters((prev) => ({ ...prev, reviewStatus: status }));
    }
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      reviewStatus: 'ALL',
      documentType: 'ALL',
    });
    setCurrentPage(0);
  };

  const handleSelectCompanyTaxCode = (taxCode: string) => {
    setActiveTab('ALL');
    setFilters({
      keyword: taxCode,
      reviewStatus: 'ALL',
      documentType: 'ALL',
    });
    setCurrentPage(0);
  };

  if (!isReady) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const slaOverdue = summary.slaOverdueCount ?? 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header with Action Controls */}
      <AdminPageHeader
        description="Review Enterprise Registration Certificates (ERC) and Letters of Authorization (LOA) to authorize corporate recruitment publishing."
        count={summary.pendingReview}
        countLabel="awaiting review"
        actions={
          <div className="flex items-center gap-2">
            <span className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive Mock Mode</span>
            </span>
            <button
              type="button"
              onClick={reset}
              className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              title="Reset mock data to the initial 6 corporate dossiers"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset Data</span>
            </button>
          </div>
        }
      />

      {/* SLA Alert Banner if any overdue */}
      {slaOverdue > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-300/80 bg-amber-50/90 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-800/80 dark:bg-amber-950/40">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            <p className="text-xs font-semibold text-amber-950 dark:text-amber-200">
              <strong className="font-bold">SLA Alert:</strong> {slaOverdue} verification dossier has been waiting for
              over 24 hours (FPT Software Corporation). Prioritize this review to maintain corporate partner
              satisfaction.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelectStatusFromSummary('PENDING_REVIEW')}
            className="self-start rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-amber-700 sm:self-auto"
          >
            Filter Pending Queue &rarr;
          </button>
        </div>
      )}

      {/* Summary KPI Command Row */}
      <AdminBusinessVerificationSummaryRow
        summary={summary}
        selectedStatus={
          activeTab === 'QUEUE'
            ? 'PENDING_REVIEW'
            : activeTab === 'NEED_INFO'
              ? 'MORE_INFO_REQUIRED'
              : activeTab === 'APPROVED'
                ? 'APPROVED'
                : activeTab === 'EXPIRING'
                  ? 'EXPIRING_SOON'
                  : filters.reviewStatus
        }
        onSelectStatus={handleSelectStatusFromSummary}
      />

      {/* Main Workspace Section: Tabs + Filter + Table */}
      <div className="space-y-5">
        {/* Workflow Tabs Navigation */}
        <div className="dark:border-forest-800 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('QUEUE');
                setCurrentPage(0);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold transition ${
                activeTab === 'QUEUE'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400'
                  : 'dark:text-forest-400 dark:hover:text-forest-200 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Pending Queue</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  activeTab === 'QUEUE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-600'
                }`}
              >
                {summary.pendingReview}
              </span>
              {summary.slaOverdueCount > 0 && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500" title="Overdue >24h" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('NEED_INFO');
                setCurrentPage(0);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold transition ${
                activeTab === 'NEED_INFO'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400'
                  : 'dark:text-forest-400 dark:hover:text-forest-200 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Needs Action</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  activeTab === 'NEED_INFO'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-600'
                }`}
              >
                {summary.moreInfoRequired}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('APPROVED');
                setCurrentPage(0);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold transition ${
                activeTab === 'APPROVED'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400'
                  : 'dark:text-forest-400 dark:hover:text-forest-200 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Approved</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  activeTab === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-600'
                }`}
              >
                {summary.approved}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('EXPIRING');
                setCurrentPage(0);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold transition ${
                activeTab === 'EXPIRING'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400'
                  : 'dark:text-forest-400 dark:hover:text-forest-200 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Expiring LOA</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  activeTab === 'EXPIRING'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-600'
                }`}
              >
                {summary.expiringSoonCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('COMPANIES');
                setCurrentPage(0);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold transition ${
                activeTab === 'COMPANIES'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400'
                  : 'dark:text-forest-400 dark:hover:text-forest-200 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Company Directory</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  activeTab === 'COMPANIES'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-600'
                }`}
              >
                {companies.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('ALL');
                setCurrentPage(0);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold transition ${
                activeTab === 'ALL'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400'
                  : 'dark:text-forest-400 dark:hover:text-forest-200 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>All Requests ({dossiers.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'COMPANIES' ? (
          <AdminCompanyDirectoryTable companies={companies} onSelectCompanyDossier={handleSelectCompanyTaxCode} />
        ) : (
          <div className="space-y-4">
            {/* Filter Bar */}
            <AdminBusinessVerificationFilterBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Dossiers Table with built-in pagination */}
            <AdminBusinessVerificationTable
              items={paginatedDossiers}
              totalItems={filteredDossiers.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

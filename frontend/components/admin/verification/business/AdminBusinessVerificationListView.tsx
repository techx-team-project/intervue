'use client';

import {
  adminBusinessVerificationApi,
  type AdminBusinessVerificationQueryParams,
} from '@/apiRequest/admin-business-verification';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import type { Page } from '@/types/api';
import type {
  AdminBusinessVerificationListResource,
  BusinessVerificationSummaryResource,
  DocumentReviewStatus,
} from '@/types/recruiter-company';
import { useCallback, useRef, useState } from 'react';
import {
  AdminBusinessVerificationFilterBar,
  type AdminVerificationFilterState,
} from './AdminBusinessVerificationFilterBar';
import { AdminBusinessVerificationSummaryRow } from './AdminBusinessVerificationSummaryRow';
import { AdminBusinessVerificationTable } from './AdminBusinessVerificationTable';

export interface AdminBusinessVerificationListViewProps {
  initialSummary: BusinessVerificationSummaryResource;
  initialPage: Page<AdminBusinessVerificationListResource>;
}

export function AdminBusinessVerificationListView({
  initialSummary,
  initialPage,
}: AdminBusinessVerificationListViewProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [pageData, setPageData] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<AdminVerificationFilterState>({
    keyword: '',
    reviewStatus: 'ALL',
    documentType: 'ALL',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(
    async (currentFilters: AdminVerificationFilterState, page: number) => {
      setIsLoading(true);
      try {
        const params: AdminBusinessVerificationQueryParams = {
          page,
          size: pageSize,
          sort: 'submittedAt,desc',
        };
        if (currentFilters.keyword.trim()) params.keyword = currentFilters.keyword.trim();
        if (currentFilters.reviewStatus !== 'ALL') params.reviewStatus = currentFilters.reviewStatus;
        if (currentFilters.documentType !== 'ALL') params.documentType = currentFilters.documentType;

        const [resPage, resSummary] = await Promise.all([
          adminBusinessVerificationApi.search(params),
          adminBusinessVerificationApi.getSummary(),
        ]);

        setPageData(resPage);
        setSummary(resSummary);
      } catch {
        // Handled silently or keeping previous state
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  const handleFilterChange = (updated: Partial<AdminVerificationFilterState>) => {
    const nextFilters = { ...filters, ...updated };
    setFilters(nextFilters);
    setCurrentPage(0);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchResults(nextFilters, 0);
    }, 250);
  };

  const handleSelectStatusFromSummary = (status: DocumentReviewStatus | 'ALL') => {
    handleFilterChange({ reviewStatus: status });
  };

  const handleResetFilters = () => {
    const cleanFilters: AdminVerificationFilterState = {
      keyword: '',
      reviewStatus: 'ALL',
      documentType: 'ALL',
    };
    setFilters(cleanFilters);
    setCurrentPage(0);
    fetchResults(cleanFilters, 0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchResults(filters, newPage);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        description="Review Enterprise Registration Certificates and Letters of Authorization to authorize corporate recruitment publishing."
        count={summary.pendingReview}
        countLabel="awaiting review"
      />

      {/* Summary Row */}
      <AdminBusinessVerificationSummaryRow
        summary={summary}
        selectedStatus={filters.reviewStatus}
        onSelectStatus={handleSelectStatusFromSummary}
      />

      {/* Filter Bar */}
      <AdminBusinessVerificationFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      <div className="relative">
        {isLoading && (
          <div className="backdrop-blur-2xs dark:bg-forest-950/60 absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60">
            <Spinner />
          </div>
        )}
        <AdminBusinessVerificationTable items={pageData.items} />
      </div>

      {/* Pagination */}
      {pageData.totalPages > 1 && (
        <Pagination
          page={currentPage + 1}
          pageCount={pageData.totalPages}
          totalItems={pageData.totalItems}
          pageSize={pageSize}
          onPageChange={(p) => handlePageChange(p - 1)}
        />
      )}
    </div>
  );
}

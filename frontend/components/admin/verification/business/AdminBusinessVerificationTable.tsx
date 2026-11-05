'use client';

import { ROUTES } from '@/constants/routes';
import type { DocumentReviewStatus } from '@/types/recruiter-company';
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Copy, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { isDocumentExpiringWithinDays, type ExtendedVerificationDetail } from './mock-verification-data';

interface AdminBusinessVerificationTableProps {
  items: ExtendedVerificationDetail[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function AdminBusinessVerificationTable({
  items,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
}: AdminBusinessVerificationTableProps) {
  const [copiedTax, setCopiedTax] = useState<string | null>(null);

  const handleCopyTax = (tax: string) => {
    navigator.clipboard.writeText(tax);
    setCopiedTax(tax);
    toast.success(`Copied Tax ID: ${tax}`);
    setTimeout(() => setCopiedTax(null), 1800);
  };

  if (totalItems === 0) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 flex min-h-[320px] flex-col items-center justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-8 text-center">
        <div className="dark:bg-forest-800 dark:text-forest-400 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <FileText className="h-5 w-5" />
        </div>
        <p className="dark:text-forest-100 text-sm font-semibold text-slate-800">No dossiers found</p>
        <p className="dark:text-forest-400 max-w-sm text-xs text-slate-500">
          No business verification dossiers match the active filters. Try clearing your search keyword or switching
          tabs.
        </p>
      </div>
    );
  }

  const firstItem = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const lastItem = Math.min((currentPage + 1) * pageSize, totalItems);
  const pageCount = Math.ceil(totalItems / pageSize) || 1;

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-xs">
          <thead className="dark:border-forest-800 dark:bg-forest-950/50 dark:text-forest-300 border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-600">
            <tr>
              <th className="px-5 py-3.5">Company & Tax ID</th>
              <th className="px-4 py-3.5">Credential Document</th>
              <th className="px-4 py-3.5">Submitter & Role</th>
              <th className="px-4 py-3.5">Timeline & SLA</th>
              <th className="px-4 py-3.5">Review Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800/60 divide-y divide-slate-100">
            {items.map((item) => {
              const { document, company, submitter, waitingHours, isSlaOverdue, governanceWarning } = item;
              const isErc = document.documentType === 'BUSINESS_LICENSE';
              const isExpiringSoon = isDocumentExpiringWithinDays(document.expiresAt, document.reviewStatus, 30);

              return (
                <tr
                  key={document.id}
                  className="group dark:hover:bg-forest-800/30 transition-colors hover:bg-slate-50/80"
                >
                  {/* Company Info */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="dark:text-forest-50 text-[13.5px] font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {company.name}
                      </p>
                      <div className="dark:text-forest-400 flex items-center gap-2 text-xs text-slate-500">
                        <span className="dark:text-forest-300 font-mono font-medium text-slate-600">
                          Tax ID: {company.taxCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTax(company.taxCode)}
                          className="dark:hover:text-forest-200 rounded p-0.5 text-slate-400 hover:text-slate-700"
                          title="Copy Tax ID"
                        >
                          {copiedTax === company.taxCode ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <span>·</span>
                        <span>{company.businessType === 'ENTERPRISE' ? 'Enterprise' : 'Household'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Document Credential */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          isErc
                            ? 'border border-purple-200/60 bg-purple-50 text-purple-700 dark:border-purple-800/50 dark:bg-purple-950/50 dark:text-purple-300'
                            : 'border border-blue-200/60 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-300'
                        }`}
                      >
                        {isErc ? 'License (ERC)' : 'Authorization (LOA)'}
                      </span>
                      <p
                        className="dark:text-forest-300 max-w-[200px] truncate text-[11.5px] text-slate-600"
                        title={document.originalFileName}
                      >
                        {document.originalFileName}
                      </p>
                      {governanceWarning && (
                        <p className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>Requires LOA (Member)</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Submitter Info */}
                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="dark:text-forest-100 font-semibold text-slate-800">{submitter.fullName}</span>
                        <span
                          className={`py-0.2 rounded px-1.5 text-[10px] font-medium ${
                            submitter.role === 'OWNER'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'dark:bg-forest-800 dark:text-forest-400 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {submitter.role === 'OWNER' ? 'Owner' : 'Member'}
                        </span>
                      </div>
                      <p className="dark:text-forest-400 text-[11.5px] text-slate-500">{submitter.email}</p>
                    </div>
                  </td>

                  {/* Time & SLA */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {document.reviewStatus === 'PENDING_REVIEW' ? (
                        isSlaOverdue ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-rose-200/70 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/60 dark:text-rose-300">
                            Overdue 28h
                          </span>
                        ) : (
                          <span className="dark:text-forest-300 text-xs font-medium text-slate-600">
                            Waiting {waitingHours}h
                          </span>
                        )
                      ) : (
                        <span className="dark:text-forest-400 text-xs font-medium text-slate-500">
                          {document.reviewedAt
                            ? new Date(document.reviewedAt).toLocaleDateString('en-US')
                            : new Date(document.submittedAt).toLocaleDateString('en-US')}
                        </span>
                      )}
                      <p className="dark:text-forest-500 text-[11px] text-slate-400">
                        Submitted: {new Date(document.submittedAt).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </td>

                  {/* Review Status */}
                  <td className="px-4 py-4">
                    <ReviewStatusBadge status={document.reviewStatus} isExpiringSoon={Boolean(isExpiringSoon)} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`${ROUTES.ADMIN_VERIFICATION_BUSINESS}/${document.id}`}
                      className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 active:scale-95 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stream View */}
      <div className="dark:divide-forest-800/60 divide-y divide-slate-100 lg:hidden">
        {items.map((item) => {
          const { document, company, submitter } = item;
          const isErc = document.documentType === 'BUSINESS_LICENSE';

          return (
            <div key={document.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="dark:bg-forest-800 dark:text-forest-300 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {isErc ? 'License (ERC)' : 'Authorization (LOA)'}
                  </span>
                  <h4 className="dark:text-forest-100 text-sm font-semibold text-slate-900">{company.name}</h4>
                  <p className="dark:text-forest-400 text-xs text-slate-500">Tax ID: {company.taxCode}</p>
                </div>
                <ReviewStatusBadge status={document.reviewStatus} />
              </div>

              <div className="dark:border-forest-800/40 dark:text-forest-400 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                <span>Submitted by: {submitter.fullName}</span>
                <Link
                  href={`${ROUTES.ADMIN_VERIFICATION_BUSINESS}/${document.id}`}
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Inspect &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrated Pagination Footer */}
      <div className="dark:border-forest-800 dark:bg-forest-950/40 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50/50 px-5 py-3">
        <p className="dark:text-forest-400 text-xs text-slate-500">
          Showing <span className="dark:text-forest-100 font-semibold text-slate-800">{firstItem}</span>–
          <span className="dark:text-forest-100 font-semibold text-slate-800">{lastItem}</span> of{' '}
          <span className="dark:text-forest-100 font-semibold text-slate-800">{totalItems}</span> dossiers
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="mr-0.5 h-3.5 w-3.5" />
            Previous
          </button>

          {Array.from({ length: pageCount }, (_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPageChange(idx)}
              className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
                currentPage === idx
                  ? 'bg-emerald-600 text-white'
                  : 'dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= pageCount - 1}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewStatusBadge({ status, isExpiringSoon }: { status: DocumentReviewStatus; isExpiringSoon?: boolean }) {
  if (isExpiringSoon) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/50 dark:text-orange-300">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        <span>Expiring Soon</span>
      </span>
    );
  }

  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span>Pending Review</span>
        </span>
      );
    case 'MORE_INFO_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <span>Needs Action</span>
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Approved</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-300">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>Rejected</span>
        </span>
      );
    case 'REVOKED':
      return (
        <span className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          <span>Revoked</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {status}
        </span>
      );
  }
}

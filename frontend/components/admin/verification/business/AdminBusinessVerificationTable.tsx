'use client';

import { ROUTES } from '@/constants/routes';
import type {
  AdminBusinessVerificationListResource,
  BusinessDocumentType,
  DocumentReviewStatus,
} from '@/types/recruiter-company';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

interface AdminBusinessVerificationTableProps {
  items: AdminBusinessVerificationListResource[];
}

export function AdminBusinessVerificationTable({ items }: AdminBusinessVerificationTableProps) {
  if (items.length === 0) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="dark:bg-forest-800 dark:text-forest-400 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <FileText className="h-6 w-6" />
        </div>
        <p className="dark:text-forest-100 text-sm font-bold text-slate-800">No verification requests found</p>
        <p className="dark:text-forest-400 max-w-sm text-xs text-slate-500">
          No matching business verification requests for the chosen filters. Try clearing your filters or search
          keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-xs">
          <thead className="dark:border-forest-800 dark:bg-forest-950/60 dark:text-forest-400 border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3.5">Document</th>
              <th className="px-4 py-3.5">Company</th>
              <th className="px-4 py-3.5">Submitter</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Submitted</th>
              <th className="px-4 py-3.5">Expires</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800/60 divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="group dark:hover:bg-forest-800/40 transition-colors hover:bg-slate-50/70">
                {/* Document Type & Filename */}
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <DocumentTypeBadge type={item.documentType} />
                    <p
                      className="dark:text-forest-300 max-w-[220px] truncate font-mono text-[11px] text-slate-600"
                      title={item.originalFileName}
                    >
                      {item.originalFileName}
                    </p>
                  </div>
                </td>

                {/* Company Name & Tax Code */}
                <td className="px-4 py-4">
                  <div className="space-y-0.5">
                    <div className="dark:text-forest-100 flex items-center gap-1.5 font-bold text-slate-900">
                      <Building2 className="dark:text-forest-400 h-3.5 w-3.5 text-slate-400" />
                      <span>{item.companyName}</span>
                    </div>
                    <p className="dark:text-forest-400 font-mono text-[11px] text-slate-500">
                      Tax ID: {item.companyTaxCode}
                    </p>
                  </div>
                </td>

                {/* Submitter */}
                <td className="px-4 py-4">
                  <div className="space-y-0.5">
                    <p className="dark:text-forest-100 font-bold text-slate-800">{item.submittedByName}</p>
                    <p className="dark:text-forest-400 text-[11px] text-slate-500">{item.submittedByEmail}</p>
                  </div>
                </td>

                {/* Review Status */}
                <td className="px-4 py-4">
                  <StatusBadge status={item.reviewStatus} />
                </td>

                {/* Submitted At */}
                <td className="dark:text-forest-300 px-4 py-4 font-mono text-[11px] text-slate-600">
                  {new Date(item.submittedAt).toLocaleDateString()}
                </td>

                {/* Expires At */}
                <td className="dark:text-forest-400 px-4 py-4 font-mono text-[11px] text-slate-500">
                  {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '—'}
                </td>

                {/* Action */}
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`${ROUTES.ADMIN_VERIFICATION_BUSINESS}/${item.id}`}
                    className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:border-emerald-500"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stream Cards */}
      <div className="dark:divide-forest-800/60 divide-y divide-slate-100 lg:hidden">
        {items.map((item) => (
          <div key={item.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DocumentTypeBadge type={item.documentType} />
                <h4 className="dark:text-forest-100 text-sm font-bold text-slate-900">{item.companyName}</h4>
                <p className="dark:text-forest-400 font-mono text-xs text-slate-500">Tax ID: {item.companyTaxCode}</p>
              </div>
              <StatusBadge status={item.reviewStatus} />
            </div>

            <div className="dark:border-forest-800/40 dark:text-forest-400 flex items-center justify-between border-t border-slate-50 pt-2 text-xs text-slate-500">
              <span>Submitted by {item.submittedByName}</span>
              <Link
                href={`${ROUTES.ADMIN_VERIFICATION_BUSINESS}/${item.id}`}
                className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Inspect &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentTypeBadge({ type }: { type: BusinessDocumentType }) {
  if (type === 'BUSINESS_LICENSE') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
        <FileCheck className="h-3 w-3" /> Business License (ERC)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
      <FileText className="h-3 w-3" /> Authorization (LOA)
    </span>
  );
}

function StatusBadge({ status }: { status: DocumentReviewStatus }) {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3" /> Approved
        </span>
      );
    case 'PENDING_REVIEW':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <Clock className="h-3 w-3" /> Pending Review
        </span>
      );
    case 'MORE_INFO_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
          <AlertTriangle className="h-3 w-3" /> Info Needed
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          <AlertCircle className="h-3 w-3" /> Rejected
        </span>
      );
    case 'REVOKED':
      return (
        <span className="dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-800">
          <ShieldAlert className="h-3 w-3" /> Revoked
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="dark:bg-forest-900 dark:text-forest-400 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
          <Clock className="h-3 w-3" /> Expired
        </span>
      );
  }
}

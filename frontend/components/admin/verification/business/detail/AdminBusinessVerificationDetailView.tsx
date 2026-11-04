'use client';

import { ROUTES } from '@/constants/routes';
import type { AdminBusinessVerificationDetailResource } from '@/types/recruiter-company';
import { AlertTriangle, ArrowLeft, Building2, ExternalLink, FileText, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AdminBusinessDocumentViewer } from './AdminBusinessDocumentViewer';
import { AdminBusinessVerificationActions } from './AdminBusinessVerificationActions';

interface AdminBusinessVerificationDetailViewProps {
  initialDetail: AdminBusinessVerificationDetailResource;
}

export function AdminBusinessVerificationDetailView({ initialDetail }: AdminBusinessVerificationDetailViewProps) {
  const [detail, setDetail] = useState(initialDetail);
  const { document, company, submitter, members, companyDocuments } = detail;

  const isMemberSubmittingLicense = submitter.role === 'MEMBER' && document.documentType === 'BUSINESS_LICENSE';

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Link & Title */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href={ROUTES.ADMIN_VERIFICATION_BUSINESS}
            className="dark:text-forest-400 dark:hover:text-forest-200 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Verification Queue</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="dark:text-forest-50 text-xl font-extrabold text-slate-900 sm:text-2xl">
              Verification Dossier #{document.id}
            </h1>
            <span className="dark:bg-forest-800 dark:text-forest-200 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {document.documentType}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Studio (7 cols left, 5 cols right on lg) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Sandboxed Inline Viewer */}
        <div className="lg:col-span-7">
          <AdminBusinessDocumentViewer document={document} />
        </div>

        {/* Right Column: Fact Cross-Check & Actions */}
        <div className="space-y-6 lg:col-span-5">
          {/* Action Hub */}
          <AdminBusinessVerificationActions detail={detail} onUpdated={(fresh) => setDetail(fresh)} />

          {/* Warning if Member submitted Business License */}
          {isMemberSubmittingLicense && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/80 p-4 text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold">Governance Warning: Role Incompatibility</p>
                  <p className="leading-relaxed">
                    The submitter is registered as a <strong>MEMBER</strong>, but submitted an Enterprise Registration
                    Certificate (ERC). Platform policy restricts ERC submissions to company <strong>OWNERs</strong>.
                    Members must submit a signed Letter of Authorization (LOA).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Company Legal Facts */}
          <div className="dark:border-forest-800 dark:bg-forest-900 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="dark:border-forest-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="dark:text-forest-100 flex items-center gap-2 font-bold text-slate-900">
                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm">Company Legal Facts</span>
              </div>
              <a
                href={`https://dangkykinhdoanh.gov.vn/vn/Pages/Trangchu.aspx`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                title="Cross-check on National Business Registration Portal"
              >
                <span>dangkykinhdoanh.gov.vn</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="dark:text-forest-400 text-slate-400">Registered Name:</span>
                <p className="dark:text-forest-100 font-bold text-slate-900">{company.name}</p>
              </div>

              {company.tradingName && (
                <div>
                  <span className="dark:text-forest-400 text-slate-400">Trading / Commercial Name:</span>
                  <p className="dark:text-forest-200 font-semibold text-slate-800">{company.tradingName}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="dark:text-forest-400 text-slate-400">Tax Identification:</span>
                  <p className="dark:text-forest-100 font-mono font-bold text-slate-900">{company.taxCode}</p>
                </div>
                <div>
                  <span className="dark:text-forest-400 text-slate-400">Business Entity:</span>
                  <p className="dark:text-forest-200 font-semibold text-slate-800">{company.businessType}</p>
                </div>
              </div>

              <div>
                <span className="dark:text-forest-400 text-slate-400">Headquarters Address:</span>
                <p className="dark:text-forest-300 font-medium text-slate-700">{company.address}</p>
              </div>

              {company.website && (
                <div>
                  <span className="dark:text-forest-400 text-slate-400">Website:</span>
                  <p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>
              )}

              <div className="dark:border-forest-800 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="dark:text-forest-400 text-slate-400">Enterprise Status:</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    company.verified
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {company.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Submitter Profile */}
          <div className="dark:border-forest-800 dark:bg-forest-900 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="dark:border-forest-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="dark:text-forest-100 flex items-center gap-2 font-bold text-slate-900">
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm">Submitter &amp; Legal Role</span>
              </div>
              <span className="dark:bg-forest-800 dark:text-forest-200 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                Role: {submitter.role}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="dark:text-forest-400 text-slate-400">Full Name:</span>
                <span className="dark:text-forest-100 font-bold text-slate-900">{submitter.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-forest-400 text-slate-400">Account Email:</span>
                <span className="dark:text-forest-300 font-mono text-slate-700">{submitter.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-forest-400 text-slate-400">Joined Company:</span>
                <span className="dark:text-forest-400 text-slate-600">
                  {new Date(submitter.joinedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-forest-400 text-slate-400">Phone Verified:</span>
                <span
                  className={
                    submitter.phoneVerified ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }
                >
                  {submitter.phoneVerified ? 'Yes (Verified)' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-forest-400 text-slate-400">Publishing Rights:</span>
                <span
                  className={
                    submitter.canPublish
                      ? 'font-bold text-emerald-600 dark:text-emerald-400'
                      : 'dark:text-forest-400 text-slate-500'
                  }
                >
                  {submitter.canPublish ? 'Active (Level 3)' : 'Restricted'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Company Members Overview */}
          {members && members.length > 0 && (
            <div className="dark:border-forest-800 dark:bg-forest-900 space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="dark:text-forest-100 flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>Affiliated Team Members ({members.length})</span>
                </span>
              </div>

              <div className="dark:divide-forest-800/60 divide-y divide-slate-100 text-xs">
                {members.slice(0, 5).map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="dark:text-forest-200 font-semibold text-slate-800">{m.fullName}</p>
                      <p className="dark:text-forest-400 text-[10px] text-slate-400">{m.email}</p>
                    </div>
                    <span className="dark:bg-forest-800 dark:text-forest-300 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: All Company Documents */}
          {companyDocuments && companyDocuments.length > 0 && (
            <div className="dark:border-forest-800 dark:bg-forest-900 space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="dark:text-forest-100 flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span>Company Documents ({companyDocuments.length})</span>
                </span>
              </div>

              <div className="dark:divide-forest-800/60 divide-y divide-slate-100 text-xs">
                {companyDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="dark:text-forest-200 font-semibold text-slate-800">{doc.documentType}</p>
                      <p className="dark:text-forest-400 text-[10px] text-slate-400">{doc.originalFileName}</p>
                    </div>
                    <span className="dark:bg-forest-800 dark:text-forest-300 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {doc.reviewStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

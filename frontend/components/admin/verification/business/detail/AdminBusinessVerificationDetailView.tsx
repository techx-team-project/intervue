'use client';

import { ROUTES } from '@/constants/routes';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Check,
  ChevronLeft,
  Copy,
  ExternalLink,
  History,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { AdminBusinessVerificationDetailResource } from '@/types/recruiter-company';
import type { ExtendedVerificationDetail } from '../mock-verification-data';
import { AdminBusinessDocumentViewer } from './AdminBusinessDocumentViewer';
import { AdminBusinessVerificationActions } from './AdminBusinessVerificationActions';

interface AdminBusinessVerificationDetailViewProps {
  dossierId?: number;
  initialDetail?: ExtendedVerificationDetail;
  liveDetail?: AdminBusinessVerificationDetailResource;
  onRefresh?: () => void;
}

export function AdminBusinessVerificationDetailView({
  initialDetail,
  liveDetail,
  onRefresh,
}: AdminBusinessVerificationDetailViewProps) {
  const currentDossier = useMemo(() => {
    if (liveDetail) {
      const { document, company, submitter, members } = liveDetail;
      const submittedAtDate = new Date(document.submittedAt);
      const waitingHours = Math.max(0, Math.round((Date.now() - submittedAtDate.getTime()) / (1000 * 60 * 60)));
      const isSlaOverdue = waitingHours > 24 && document.reviewStatus === 'PENDING_REVIEW';
      const totalPages = document.identityBackStoragePublicId ? 3 : document.identityStoragePublicId ? 2 : 1;
      return {
        document,
        company,
        submitter: submitter || {
          id: 0,
          userId: 0,
          email: '',
          fullName: 'Enterprise Submitter',
          role: 'MEMBER' as const,
          status: 'ACTIVE' as const,
          joinedAt: document.submittedAt,
          phoneVerified: false,
          userAgreementAccepted: false,
          canPublish: false,
        },
        members: members || [],
        auditLogs: [],
        waitingHours,
        isSlaOverdue,
        totalPages,
        sampleScanUrl: undefined as string | undefined,
      };
    }
    return initialDetail || null;
  }, [liveDetail, initialDetail]);

  const [copiedTax, setCopiedTax] = useState(false);

  // Compliance checklist interactive states
  const [checkedTax, setCheckedTax] = useState(false);
  const [checkedRep, setCheckedRep] = useState(false);
  const [checkedSeal, setCheckedSeal] = useState(false);
  const [checkedTaxStatus, setCheckedTaxStatus] = useState(false);

  if (!currentDossier) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
        <p className="dark:text-forest-200 text-on-surface text-sm font-semibold">Verification dossier not found.</p>
        <Link
          href={ROUTES.ADMIN_VERIFICATION_BUSINESS}
          className="text-xs font-semibold text-emerald-600 hover:underline"
        >
          &larr; Back to Verification Queue
        </Link>
      </div>
    );
  }

  const { document, company, submitter, members, auditLogs, waitingHours, isSlaOverdue, totalPages, sampleScanUrl } =
    currentDossier;

  const isErc = document.documentType === 'BUSINESS_LICENSE';
  const isMemberSubmittingLicense = submitter.role === 'MEMBER' && isErc;

  const handleCopyTax = () => {
    navigator.clipboard.writeText(company.taxCode);
    setCopiedTax(true);
    toast.success(`Copied Tax ID: ${company.taxCode}`);
    setTimeout(() => setCopiedTax(false), 1800);
  };

  const handleCheckAll = () => {
    setCheckedTax(true);
    setCheckedRep(true);
    setCheckedSeal(true);
    setCheckedTaxStatus(true);
    toast.success('Confirmed all 4 legal compliance criteria');
  };

  const allChecksPassed = checkedTax && checkedRep && checkedSeal && checkedTaxStatus;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Navigation & Stepper */}
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href={ROUTES.ADMIN_VERIFICATION_BUSINESS}
            className="dark:text-forest-400 dark:hover:text-forest-200 text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Verification Queue</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="dark:text-forest-50 text-on-surface text-lg font-bold sm:text-xl">
              Verification Dossier #{document.id}: {company.name}
            </h1>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                isErc
                  ? 'border border-purple-200/60 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                  : 'border border-blue-200/60 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
              }`}
            >
              {isErc ? 'License (ERC)' : 'Authorization (LOA)'}
            </span>

            {/* SLA indicator */}
            {document.reviewStatus === 'PENDING_REVIEW' &&
              (isSlaOverdue ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-rose-200/70 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  SLA Overdue ({waitingHours}h)
                </span>
              ) : (
                <span className="dark:text-forest-400 text-on-surface-variant text-xs font-medium">
                  Waiting {waitingHours}h
                </span>
              ))}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.ADMIN_VERIFICATION_BUSINESS}
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Queue</span>
          </Link>
        </div>
      </div>

      {/* Main Studio Balanced 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Sandboxed Inline Document Viewer */}
        <div>
          <AdminBusinessDocumentViewer
            document={document}
            companyName={company.name}
            taxCode={company.taxCode}
            submitterName={submitter.fullName}
            sampleScanUrl={sampleScanUrl}
            totalPages={totalPages}
          />
        </div>

        {/* Right Column: Actions & Fact Cross-Check Sheet */}
        <div className="space-y-5">
          {/* Decision Hub */}
          <AdminBusinessVerificationActions document={document} onActionComplete={onRefresh} />

          {/* Governance Role Warning if Member submitted Business License */}
          {isMemberSubmittingLicense && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1 text-xs">
                  <p className="text-on-surface font-semibold dark:text-amber-100">
                    Governance Notice: Member submitted Company License
                  </p>
                  <p className="text-on-surface-variant leading-relaxed dark:text-amber-200/90">
                    The submitter holds a <strong>Member</strong> role but uploaded the company&apos;s Enterprise
                    Registration Certificate (ERC). By policy, members must submit a{' '}
                    <strong>Letter of Authorization (LOA)</strong> signed by the authorized legal representative.
                  </p>
                  <p className="font-medium text-amber-800 dark:text-amber-300">
                    Recommendation: Select &quot;Request Info&quot; to guide the recruiter to submit an LOA.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Company Legal Facts Sheet */}
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 space-y-3.5 rounded-2xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant flex items-center justify-between border-b pb-3">
              <div className="dark:text-forest-100 text-on-surface flex items-center gap-2 text-xs font-semibold">
                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Company Legal Facts</span>
              </div>
              <a
                href="https://dangkykinhdoanh.gov.vn/vn/Pages/Trangchu.aspx"
                target="_blank"
                rel="noreferrer"
                className="text-label-sm inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                title="Lookup on National Business Portal"
              >
                <span>dangkykinhdoanh.gov.vn</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="dark:text-forest-400 text-on-surface-variant shrink-0">Company Name:</span>
                <span className="dark:text-forest-100 text-on-surface text-right font-semibold">{company.name}</span>
              </div>

              {company.tradingName && (
                <div className="flex items-start justify-between gap-4">
                  <span className="dark:text-forest-400 text-on-surface-variant shrink-0">Trading Name:</span>
                  <span className="dark:text-forest-200 text-on-surface text-right">{company.tradingName}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-on-surface-variant">Tax ID (Mã số thuế):</span>
                <div className="flex items-center gap-1.5">
                  <span className="dark:text-forest-100 text-on-surface font-mono font-semibold">
                    {company.taxCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTax}
                    className="dark:hover:text-forest-200 text-outline hover:text-on-surface rounded p-0.5"
                    title="Copy Tax ID"
                  >
                    {copiedTax ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-on-surface-variant">Business Entity:</span>
                <span className="dark:text-forest-200 text-on-surface">
                  {company.businessType === 'ENTERPRISE' ? 'Enterprise' : 'Household Business'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="dark:text-forest-400 text-on-surface-variant shrink-0">Headquarters Address:</span>
                <span className="dark:text-forest-300 text-on-surface text-right">{company.address}</span>
              </div>

              {company.website && (
                <div className="flex items-center justify-between">
                  <span className="dark:text-forest-400 text-on-surface-variant">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>

            {/* Compliance Checklist */}
            <div className="dark:border-forest-800 dark:bg-forest-950/40 border-outline-variant bg-surface-container-low/60 rounded-xl border p-3.5">
              <div className="flex items-center justify-between pb-2.5">
                <span className="dark:text-forest-200 text-on-surface text-xs font-semibold">
                  Compliance Audit Checklist
                </span>
                <button
                  type="button"
                  onClick={handleCheckAll}
                  className="text-label-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Check all
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedTax}
                    onChange={(e) => setCheckedTax(e.target.checked)}
                    className="border-outline h-3.5 w-3.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-on-surface">
                    Tax ID matches National Business Registry 100%
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedRep}
                    onChange={(e) => setCheckedRep(e.target.checked)}
                    className="border-outline h-3.5 w-3.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-on-surface">
                    Signatory possesses legal authority (Legal rep or holds valid LOA)
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedSeal}
                    onChange={(e) => setCheckedSeal(e.target.checked)}
                    className="border-outline h-3.5 w-3.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-on-surface">
                    Round seal and physical signature intact without digital alteration
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedTaxStatus}
                    onChange={(e) => setCheckedTaxStatus(e.target.checked)}
                    className="border-outline h-3.5 w-3.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-on-surface">
                    Tax compliance status: Active with National Tax Authority
                  </span>
                </label>
              </div>

              {allChecksPassed && (
                <div className="text-label-sm mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-100/70 px-2.5 py-1.5 font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>All 4 compliance criteria verified!</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Submitter & Governance */}
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant flex items-center justify-between border-b pb-3">
              <div className="dark:text-forest-100 text-on-surface flex items-center gap-2 text-xs font-semibold">
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Submitter & Access Rights</span>
              </div>
              <span
                className={`text-label-sm rounded px-2 py-0.5 font-medium ${
                  submitter.role === 'OWNER'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-surface-container-high text-on-surface'
                }`}
              >
                {submitter.role === 'OWNER' ? 'Owner' : 'Member'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-on-surface-variant">Full Name:</span>
                <span className="dark:text-forest-100 text-on-surface font-semibold">{submitter.fullName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-on-surface-variant">Email:</span>
                <span className="dark:text-forest-200 text-on-surface-variant">{submitter.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-on-surface-variant">Phone Verification:</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Phone className="h-3 w-3" />
                  <span>{submitter.phoneVerified ? 'Verified via OTP' : 'Unverified'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-on-surface-variant">Recruitment Publishing Rights:</span>
                <span
                  className={`text-label-sm rounded px-2 py-0.5 font-medium ${
                    submitter.canPublish
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'dark:bg-forest-800 dark:text-forest-400 bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {submitter.canPublish ? 'Authorized to Publish' : 'Publishing Restricted'}
                </span>
              </div>

              {members && members.length > 1 && (
                <div className="dark:border-forest-800 border-outline-variant border-t pt-2.5">
                  <p className="dark:text-forest-300 text-label-sm text-on-surface pb-1.5 font-semibold">
                    Other Company Members ({members.length - 1}):
                  </p>
                  <div className="space-y-1">
                    {members
                      .filter((m) => m.userId !== submitter.userId)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="dark:bg-forest-950/60 bg-surface-container-low text-label-sm flex items-center justify-between rounded-lg px-2.5 py-1"
                        >
                          <span className="dark:text-forest-200 text-on-surface">
                            {m.fullName} ({m.email})
                          </span>
                          <span className="text-on-surface-variant">{m.role}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Audit Trail Timeline */}
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 dark:text-forest-100 border-outline-variant text-on-surface flex items-center gap-2 border-b pb-3 text-xs font-semibold">
              <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Audit Trail & History</span>
            </div>

            <div className="dark:before:bg-forest-800 before:bg-surface-container-high relative space-y-3.5 pt-1 pl-5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-px">
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => {
                  let dotColor = 'bg-slate-400';
                  let actionBadge = 'bg-surface-container-high text-on-surface';

                  if (log.action === 'APPROVED') {
                    dotColor = 'bg-emerald-500';
                    actionBadge = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                  } else if (log.action === 'REJECTED') {
                    dotColor = 'bg-rose-500';
                    actionBadge = 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                  } else if (log.action === 'INFO_REQUESTED') {
                    dotColor = 'bg-sky-500';
                    actionBadge = 'bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300';
                  } else if (log.action === 'REVOKED') {
                    dotColor = 'bg-orange-500';
                    actionBadge = 'bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
                  }

                  return (
                    <div key={log.id} className="relative space-y-1 text-xs">
                      {/* Dot */}
                      <span
                        className={`dark:border-forest-900 absolute top-1.5 -left-[19px] h-2 w-2 rounded-full border border-white ${dotColor}`}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className={`py-0.2 text-label-sm rounded px-1.5 font-semibold ${actionBadge}`}>
                          {log.action}
                        </span>
                        <span className="dark:text-forest-500 text-label-sm text-outline">
                          {new Date(log.timestamp).toLocaleString('en-US')}
                        </span>
                      </div>

                      <p className="dark:text-forest-100 text-on-surface font-semibold">
                        {log.actorName} <span className="text-outline font-normal">({log.actorRole})</span>
                      </p>

                      {log.reason && (
                        <p className="dark:text-forest-300 text-on-surface-variant">
                          <strong>Reason:</strong> {log.reason}
                        </p>
                      )}

                      {log.notes && (
                        <p className="dark:text-forest-400 dark:bg-forest-950/60 bg-surface-container-low text-label-sm text-on-surface-variant rounded-lg p-2 italic">
                          &ldquo;{log.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="dark:text-forest-500 text-outline text-xs">No audit history recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

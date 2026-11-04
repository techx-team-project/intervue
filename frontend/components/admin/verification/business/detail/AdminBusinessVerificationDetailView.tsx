'use client';

import { ROUTES } from '@/constants/routes';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
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
import { useMockVerificationStore } from '../useMockVerificationStore';
import { AdminBusinessDocumentViewer } from './AdminBusinessDocumentViewer';
import { AdminBusinessVerificationActions } from './AdminBusinessVerificationActions';

interface AdminBusinessVerificationDetailViewProps {
  dossierId?: number;
  initialDetail?: ExtendedVerificationDetail;
  liveDetail?: AdminBusinessVerificationDetailResource;
  onRefresh?: () => void;
}

export function AdminBusinessVerificationDetailView({
  dossierId,
  initialDetail,
  liveDetail,
  onRefresh,
}: AdminBusinessVerificationDetailViewProps) {
  const { dossiers } = useMockVerificationStore();

  const currentDossier = useMemo(() => {
    if (liveDetail) {
      const { document, company, submitter, members } = liveDetail;
      const submittedAtDate = new Date(document.submittedAt);
      const waitingHours = Math.max(0, Math.round((Date.now() - submittedAtDate.getTime()) / (1000 * 60 * 60)));
      const isSlaOverdue = waitingHours > 24 && document.reviewStatus === 'PENDING_REVIEW';
      const totalPages = document.identityStoragePublicId ? 2 : 1;
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
    if (dossierId) {
      return dossiers.find((d) => d.document.id === dossierId) || null;
    }
    return initialDetail || dossiers[0] || null;
  }, [liveDetail, dossiers, dossierId, initialDetail]);

  const [copiedTax, setCopiedTax] = useState(false);

  // Compliance checklist interactive states
  const [checkedTax, setCheckedTax] = useState(false);
  const [checkedRep, setCheckedRep] = useState(false);
  const [checkedSeal, setCheckedSeal] = useState(false);
  const [checkedTaxStatus, setCheckedTaxStatus] = useState(false);

  if (!currentDossier) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
        <p className="dark:text-forest-200 text-sm font-semibold text-slate-700">Verification dossier not found.</p>
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

  // Next / Previous navigation calculation
  const currentIndex = dossiers.findIndex((d) => d.document.id === document.id);
  const prevDossier = currentIndex > 0 ? dossiers[currentIndex - 1] : null;
  const nextDossier = currentIndex < dossiers.length - 1 ? dossiers[currentIndex + 1] : null;

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
      <div className="dark:border-forest-800 dark:bg-forest-900 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href={ROUTES.ADMIN_VERIFICATION_BUSINESS}
            className="dark:text-forest-400 dark:hover:text-forest-200 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Verification Queue</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="dark:text-forest-50 text-lg font-bold text-slate-900 sm:text-xl">
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
                <span className="dark:text-forest-400 text-xs font-medium text-slate-500">Waiting {waitingHours}h</span>
              ))}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-2">
          {prevDossier ? (
            <Link
              href={`${ROUTES.ADMIN_VERIFICATION_BUSINESS}/${prevDossier.document.id}`}
              className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              title={`Previous: #${prevDossier.document.id} (${prevDossier.company.name})`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <button
              disabled
              className="dark:border-forest-800 dark:text-forest-700 rounded-lg border border-slate-100 p-2 text-slate-300 opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <span className="dark:text-forest-400 text-xs font-medium text-slate-500">
            Dossier {currentIndex + 1} / {dossiers.length}
          </span>

          {nextDossier ? (
            <Link
              href={`${ROUTES.ADMIN_VERIFICATION_BUSINESS}/${nextDossier.document.id}`}
              className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              title={`Next: #${nextDossier.document.id} (${nextDossier.company.name})`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              disabled
              className="dark:border-forest-800 dark:text-forest-700 rounded-lg border border-slate-100 p-2 text-slate-300 opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
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
                  <p className="font-semibold text-slate-900 dark:text-amber-100">
                    Governance Notice: Member submitted Company License
                  </p>
                  <p className="leading-relaxed text-slate-600 dark:text-amber-200/90">
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
          <div className="dark:border-forest-800 dark:bg-forest-900 space-y-3.5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="dark:text-forest-100 flex items-center gap-2 text-xs font-semibold text-slate-900">
                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Company Legal Facts</span>
              </div>
              <a
                href="https://dangkykinhdoanh.gov.vn/vn/Pages/Trangchu.aspx"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                title="Lookup on National Business Portal"
              >
                <span>dangkykinhdoanh.gov.vn</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="dark:text-forest-400 shrink-0 text-slate-500">Company Name:</span>
                <span className="dark:text-forest-100 text-right font-semibold text-slate-900">{company.name}</span>
              </div>

              {company.tradingName && (
                <div className="flex items-start justify-between gap-4">
                  <span className="dark:text-forest-400 shrink-0 text-slate-500">Trading Name:</span>
                  <span className="dark:text-forest-200 text-right text-slate-700">{company.tradingName}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-slate-500">Tax ID (Mã số thuế):</span>
                <div className="flex items-center gap-1.5">
                  <span className="dark:text-forest-100 font-mono font-semibold text-slate-900">{company.taxCode}</span>
                  <button
                    type="button"
                    onClick={handleCopyTax}
                    className="dark:hover:text-forest-200 rounded p-0.5 text-slate-400 hover:text-slate-700"
                    title="Copy Tax ID"
                  >
                    {copiedTax ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-slate-500">Business Entity:</span>
                <span className="dark:text-forest-200 text-slate-700">
                  {company.businessType === 'ENTERPRISE' ? 'Enterprise' : 'Household Business'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="dark:text-forest-400 shrink-0 text-slate-500">Headquarters Address:</span>
                <span className="dark:text-forest-300 text-right text-slate-700">{company.address}</span>
              </div>

              {company.website && (
                <div className="flex items-center justify-between">
                  <span className="dark:text-forest-400 text-slate-500">Website:</span>
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
            <div className="dark:border-forest-800 dark:bg-forest-950/40 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <div className="flex items-center justify-between pb-2.5">
                <span className="dark:text-forest-200 text-xs font-semibold text-slate-800">
                  Compliance Audit Checklist
                </span>
                <button
                  type="button"
                  onClick={handleCheckAll}
                  className="text-[11px] font-medium text-emerald-600 hover:underline dark:text-emerald-400"
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
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-slate-700">
                    Tax ID matches National Business Registry 100%
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedRep}
                    onChange={(e) => setCheckedRep(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-slate-700">
                    Signatory possesses legal authority (Legal rep or holds valid LOA)
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedSeal}
                    onChange={(e) => setCheckedSeal(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-slate-700">
                    Round seal and physical signature intact without digital alteration
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={checkedTaxStatus}
                    onChange={(e) => setCheckedTaxStatus(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="dark:text-forest-300 text-slate-700">
                    Tax compliance status: Active with National Tax Authority
                  </span>
                </label>
              </div>

              {allChecksPassed && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-100/70 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>All 4 compliance criteria verified!</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Submitter & Governance */}
          <div className="dark:border-forest-800 dark:bg-forest-900 space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="dark:text-forest-100 flex items-center gap-2 text-xs font-semibold text-slate-900">
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Submitter & Access Rights</span>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                  submitter.role === 'OWNER'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-700'
                }`}
              >
                {submitter.role === 'OWNER' ? 'Owner' : 'Member'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-slate-500">Full Name:</span>
                <span className="dark:text-forest-100 font-semibold text-slate-800">{submitter.fullName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-slate-500">Email:</span>
                <span className="dark:text-forest-200 text-slate-600">{submitter.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-slate-500">Phone Verification:</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Phone className="h-3 w-3" />
                  <span>{submitter.phoneVerified ? 'Verified via OTP' : 'Unverified'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-forest-400 text-slate-500">Recruitment Publishing Rights:</span>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                    submitter.canPublish
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'dark:bg-forest-800 dark:text-forest-400 bg-slate-100 text-slate-600'
                  }`}
                >
                  {submitter.canPublish ? 'Authorized to Publish' : 'Publishing Restricted'}
                </span>
              </div>

              {members && members.length > 1 && (
                <div className="dark:border-forest-800 border-t border-slate-100 pt-2.5">
                  <p className="dark:text-forest-300 pb-1.5 text-[11px] font-semibold text-slate-700">
                    Other Company Members ({members.length - 1}):
                  </p>
                  <div className="space-y-1">
                    {members
                      .filter((m) => m.userId !== submitter.userId)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="dark:bg-forest-950/60 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1 text-[11px]"
                        >
                          <span className="dark:text-forest-200 text-slate-700">
                            {m.fullName} ({m.email})
                          </span>
                          <span className="text-slate-500">{m.role}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Audit Trail Timeline */}
          <div className="dark:border-forest-800 dark:bg-forest-900 space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 dark:text-forest-100 flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold text-slate-900">
              <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Audit Trail & History</span>
            </div>

            <div className="dark:before:bg-forest-800 relative space-y-3.5 pt-1 pl-5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-px before:bg-slate-200">
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => {
                  let dotColor = 'bg-slate-400';
                  let actionBadge = 'bg-slate-100 text-slate-700';

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
                        <span className={`py-0.2 rounded px-1.5 text-[10px] font-semibold ${actionBadge}`}>
                          {log.action}
                        </span>
                        <span className="dark:text-forest-500 text-[10.5px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString('en-US')}
                        </span>
                      </div>

                      <p className="dark:text-forest-100 font-semibold text-slate-800">
                        {log.actorName} <span className="font-normal text-slate-400">({log.actorRole})</span>
                      </p>

                      {log.reason && (
                        <p className="dark:text-forest-300 text-slate-600">
                          <strong>Reason:</strong> {log.reason}
                        </p>
                      )}

                      {log.notes && (
                        <p className="dark:text-forest-400 dark:bg-forest-950/60 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-500 italic">
                          &ldquo;{log.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="dark:text-forest-500 text-xs text-slate-400">No audit history recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

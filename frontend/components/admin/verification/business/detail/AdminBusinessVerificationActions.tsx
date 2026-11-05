'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { isApiError } from '@/lib/api-error';
import type { BusinessDocumentResource } from '@/types/recruiter-company';
import { AlertCircle, CheckCircle2, Clock, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminBusinessVerificationActionsProps {
  document: BusinessDocumentResource;
  onActionComplete?: () => void;
}

const REJECT_PRESETS = [
  'Tax ID does not match records on National Business Registration Portal',
  'Signatory lacks legal authority under corporate charter or articles of incorporation',
  'Member account submitted ERC; Letter of Authorization (LOA) is required for non-owner members',
  'Document scan is illegible, cropped, or shows signs of digital manipulation',
  'Letter of Authorization (LOA) is expired or lacks explicit recruitment authorization',
  'Enterprise is currently suspended or dissolved according to Tax Authority records',
];

const REQUEST_INFO_PRESETS = [
  'Document scan has excessive glare over seal/signature; please provide a high-resolution PDF scan',
  'Please attach two-sided National Citizen ID (CCCD) of the authorized signatory',
  'Please provide corporate appointment decision confirming recruiter appointment',
  'Letter of Authorization requires official company stamp across pages and legal rep signature',
];

const REVOKE_PRESETS = [
  'Company submitted official revocation of recruitment authorization for this user',
  'Severe violation of job posting policy or fraudulent recruitment activity detected',
  'Enterprise business registration was revoked by Department of Planning & Investment',
  'Authorization period has expired without submitted renewal documentation',
];

export function AdminBusinessVerificationActions({
  document,
  onActionComplete,
}: AdminBusinessVerificationActionsProps) {
  const isErc = document.documentType === 'BUSINESS_LICENSE';
  const isApproved = document.reviewStatus === 'APPROVED';
  const isRejected = document.reviewStatus === 'REJECTED';

  // Modal dialog states
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveExpiry, setApproveExpiry] = useState<string>('');
  const [selectedPresetYears, setSelectedPresetYears] = useState<number | null>(1);

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>(REJECT_PRESETS[0]);
  const [rejectDetail, setRejectDetail] = useState<string>('');

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestReason, setRequestReason] = useState<string>(REQUEST_INFO_PRESETS[0]);
  const [requestDetail, setRequestDetail] = useState<string>('');

  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState<string>(REVOKE_PRESETS[0]);
  const [revokeDetail, setRevokeDetail] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Approve
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await adminBusinessVerificationApi.approve(document.id, {
        expiresAt: approveExpiry ? new Date(approveExpiry).toISOString() : undefined,
      });
      toast.success('Dossier approved successfully! Corporate publishing permissions have been granted.');
      setIsApproveOpen(false);
      onActionComplete?.();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Approval failed');
      } else {
        toast.error('Failed to approve document');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick preset helper for Expiry Date
  const setExpiryInYears = (years: number) => {
    setSelectedPresetYears(years);
    const d = new Date('2026-11-04T00:00:00Z');
    d.setFullYear(d.getFullYear() + years);
    setApproveExpiry(d.toISOString().split('T')[0]);
  };

  // Handle Reject
  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const finalReason = rejectDetail ? `${rejectReason}. Notes: ${rejectDetail}` : rejectReason;
      await adminBusinessVerificationApi.reject(document.id, { reason: finalReason });
      toast.error('Dossier rejected. Notification dispatched to recruiter.');
      setIsRejectOpen(false);
      onActionComplete?.();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Rejection failed');
      } else {
        toast.error('Failed to reject document');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Request More Info
  const handleRequestMoreInfo = async () => {
    setIsSubmitting(true);
    try {
      const finalReason = requestDetail ? `${requestReason}. Guidance: ${requestDetail}` : requestReason;
      await adminBusinessVerificationApi.requestMoreInformation(document.id, { reason: finalReason });
      toast.info('Additional information requested from recruiter.');
      setIsRequestOpen(false);
      onActionComplete?.();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Request info failed');
      } else {
        toast.error('Failed to request additional documents');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Revoke
  const handleRevoke = async () => {
    setIsSubmitting(true);
    try {
      const finalReason = revokeDetail ? `${revokeReason}. Details: ${revokeDetail}` : revokeReason;
      await adminBusinessVerificationApi.revoke(document.id, { reason: finalReason });
      toast.warning('Publishing rights revoked. Active job posts suspended.');
      setIsRevokeOpen(false);
      onActionComplete?.();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Revocation failed');
      } else {
        toast.error('Failed to revoke document approval');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div>
        <h3 className="dark:text-forest-50 text-sm font-semibold text-slate-900">Compliance Decision Hub</h3>
        <p className="dark:text-forest-400 mt-0.5 text-xs text-slate-500">
          Review document validity and select the appropriate compliance decision.
        </p>
      </div>

      {/* Primary Action Flow */}
      {isApproved ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-0.5">
              <p className="font-semibold">Dossier has been approved</p>
              <p className="text-emerald-800/80 dark:text-emerald-300/80">
                Enterprise currently holds recruitment publishing authorization.
                {document.expiresAt && ` Valid through: ${new Date(document.expiresAt).toLocaleDateString('en-US')}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setIsRevokeOpen(true)}
              className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-700"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Revoke Publishing Rights</span>
            </button>
          </div>
        </div>
      ) : isRejected ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="space-y-0.5">
              <p className="font-semibold">Dossier has been rejected</p>
              <p className="text-rose-800/80 dark:text-rose-300/80">
                {document.reviewReason || 'Did not fulfill regulatory requirements.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (isErc) setExpiryInYears(5);
                else setExpiryInYears(1);
                setIsApproveOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Re-evaluate & Approve</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main Approve Action */}
          <button
            type="button"
            onClick={() => {
              if (isErc) setExpiryInYears(5);
              else setExpiryInYears(1);
              setIsApproveOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-98"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Approve & Grant Rights</span>
          </button>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsRequestOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/60 py-2 text-xs font-semibold text-sky-800 transition hover:bg-sky-100/70 active:scale-98 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Request Info</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRejectOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100/70 active:scale-98 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Reject Dossier</span>
            </button>
          </div>
        </div>
      )}

      {/* APPROVE MODAL */}
      <Modal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        title="Confirm Business Verification Approval"
        description="Upon approval, the company and authorized recruiter will be granted recruitment publishing permissions on InterVue."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Validity duration for {isErc ? 'Enterprise License (ERC)' : 'Letter of Authorization (LOA)'}:
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setExpiryInYears(1)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  selectedPresetYears === 1
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                1 Year (Recommended for LOA)
              </button>
              <button
                type="button"
                onClick={() => setExpiryInYears(2)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  selectedPresetYears === 2
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                2 Years
              </button>
              <button
                type="button"
                onClick={() => setExpiryInYears(5)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  selectedPresetYears === 5
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                5 Years (Recommended for ERC)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPresetYears(null);
                  setApproveExpiry('');
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  selectedPresetYears === null && !approveExpiry
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'dark:border-forest-700 dark:bg-forest-800 dark:text-forest-300 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Indefinite
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="dark:text-forest-400 text-xs text-slate-500">Or specific date:</span>
              <input
                type="date"
                value={approveExpiry}
                onChange={(e) => {
                  setApproveExpiry(e.target.value);
                  setSelectedPresetYears(null);
                }}
                className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              Confirmed: Legal representative and Tax ID match National Business Registry records. Document contains
              valid signature and stamp.
            </span>
          </div>

          <div className="dark:border-forest-800 flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsApproveOpen(false)}
              className="dark:border-forest-700 dark:text-forest-300 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleApprove}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Approving...' : 'Confirm Approval'}
            </button>
          </div>
        </div>
      </Modal>

      {/* REQUEST MORE INFO MODAL */}
      <Modal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        title="Request Additional Information"
        description="Notifications and instructions will be sent directly to the submitter's email address."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Select request reason:
            </label>
            <select
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
            >
              {REQUEST_INFO_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Detailed instructions for recruiter (optional):
            </label>
            <Textarea
              value={requestDetail}
              onChange={(e) => setRequestDetail(e.target.value)}
              placeholder="Enter specific instructions to help the recruiter prepare the documents accurately..."
              rows={3}
              className="mt-1.5 text-xs"
            />
          </div>

          <div className="dark:border-forest-800 flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsRequestOpen(false)}
              className="dark:border-forest-700 dark:text-forest-300 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleRequestMoreInfo}
              className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Business Verification Dossier"
        description="Please provide a clear legal reason. Rejection prevents job posting authorization for this account."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Legal basis for rejection:
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none"
            >
              {REJECT_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Violation details / Audit findings:
            </label>
            <Textarea
              value={rejectDetail}
              onChange={(e) => setRejectDetail(e.target.value)}
              placeholder="e.g. Tax ID verification on National Portal indicates company was dissolved in 08/2026..."
              rows={3}
              className="mt-1.5 text-xs"
            />
          </div>

          <div className="dark:border-forest-800 flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsRejectOpen(false)}
              className="dark:border-forest-700 dark:text-forest-300 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleReject}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>

      {/* REVOKE MODAL */}
      <Modal
        isOpen={isRevokeOpen}
        onClose={() => setIsRevokeOpen(false)}
        title="Revoke Recruitment Publishing Rights"
        description="This action will immediately suspend all active job postings for this enterprise on InterVue."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Reason for revocation:
            </label>
            <select
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none"
            >
              {REVOKE_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="dark:text-forest-200 block text-xs font-semibold text-slate-700">
              Additional notes (official dispatch / violation reference):
            </label>
            <Textarea
              value={revokeDetail}
              onChange={(e) => setRevokeDetail(e.target.value)}
              placeholder="Enter official dispatch number or violation reference..."
              rows={3}
              className="mt-1.5 text-xs"
            />
          </div>

          <div className="dark:border-forest-800 flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsRevokeOpen(false)}
              className="dark:border-forest-700 dark:text-forest-300 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleRevoke}
              className="dark:bg-forest-700 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-black active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Revoking...' : 'Confirm Revocation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { isApiError } from '@/lib/api-error';
import type { AdminBusinessVerificationDetailResource } from '@/types/recruiter-company';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminBusinessVerificationActionsProps {
  detail: AdminBusinessVerificationDetailResource;
  onUpdated: (fresh: AdminBusinessVerificationDetailResource) => void;
}

const REJECT_PRESETS = [
  'Tax ID does not match the national business registration database',
  'Document scan is blurry, cropped, or illegible',
  'Signatory does not have legal representative authority',
  'Certificate or letter has expired',
  'Member is not authorized to submit Enterprise Registration Certificate',
];

const REQUEST_INFO_PRESETS = [
  'Please provide a clearer, full-page scan of the business certificate',
  'Please attach citizen ID card copy of the authorized recruiter',
  'Please provide the corporate appointment decision letter',
  'Please ensure the document contains the official company seal and signature',
];

export function AdminBusinessVerificationActions({ detail, onUpdated }: AdminBusinessVerificationActionsProps) {
  const { document } = detail;

  // Dialog states
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveExpiry, setApproveExpiry] = useState<string>('');
  const [isApproving, setIsApproving] = useState(false);

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>(REJECT_PRESETS[0]);
  const [rejectDetail, setRejectDetail] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState(false);

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestReason, setRequestReason] = useState<string>(REQUEST_INFO_PRESETS[0]);
  const [requestDetail, setRequestDetail] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState(false);

  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState<string>('Violation of platform compliance policy');
  const [isRevoking, setIsRevoking] = useState(false);

  // Handle Approve
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const payload = approveExpiry ? { expiresAt: new Date(approveExpiry).toISOString() } : {};
      const updated = await adminBusinessVerificationApi.approve(document.id, payload);
      toast.success('Document approved successfully!');
      setIsApproveOpen(false);
      onUpdated(updated);
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.error('Failed to approve document.');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    const finalReason = rejectDetail ? `${rejectReason}: ${rejectDetail}` : rejectReason;
    setIsRejecting(true);
    try {
      const updated = await adminBusinessVerificationApi.reject(document.id, { reason: finalReason });
      toast.success('Document rejected.');
      setIsRejectOpen(false);
      onUpdated(updated);
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.error('Failed to reject document.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle Request More Info
  const handleRequestMoreInfo = async () => {
    const finalReason = requestDetail ? `${requestReason}: ${requestDetail}` : requestReason;
    setIsRequesting(true);
    try {
      const updated = await adminBusinessVerificationApi.requestMoreInformation(document.id, {
        reason: finalReason,
      });
      toast.success('Additional documents requested from applicant.');
      setIsRequestOpen(false);
      onUpdated(updated);
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.error('Failed to request information.');
    } finally {
      setIsRequesting(false);
    }
  };

  // Handle Revoke
  const handleRevoke = async () => {
    if (!revokeReason.trim()) {
      toast.error('Revocation reason is required.');
      return;
    }
    setIsRevoking(true);
    try {
      const updated = await adminBusinessVerificationApi.revoke(document.id, { reason: revokeReason });
      toast.success('Document approval revoked and publishing rights suspended.');
      setIsRevokeOpen(false);
      onUpdated(updated);
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.error('Failed to revoke document.');
    } finally {
      setIsRevoking(false);
    }
  };

  const isApproved = document.reviewStatus === 'APPROVED';

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <h3 className="dark:text-forest-200 text-xs font-bold tracking-wider text-slate-700 uppercase">
        Compliance Decision Hub
      </h3>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {/* Approve Button */}
        <button
          type="button"
          onClick={() => setIsApproveOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Approve</span>
        </button>

        {/* Request More Info Button */}
        <button
          type="button"
          onClick={() => setIsRequestOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2.5 text-xs font-bold text-sky-800 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
        >
          <Clock className="h-4 w-4" />
          <span>Need Info</span>
        </button>

        {/* Reject Button */}
        <button
          type="button"
          onClick={() => setIsRejectOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
        >
          <AlertCircle className="h-4 w-4" />
          <span>Reject</span>
        </button>

        {/* Revoke Button (only visible if approved) */}
        {isApproved ? (
          <button
            type="button"
            onClick={() => setIsRevokeOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Revoke</span>
          </button>
        ) : null}
      </div>

      {/* APPROVE MODAL */}
      <Modal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        title="Approve Business Verification"
        description="Grant verified employer status and publishing authorization."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsApproveOpen(false)}
              className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={isApproving}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {isApproving ? 'Approving...' : 'Confirm Approval'}
            </button>
          </div>
        }
      >
        <div className="dark:text-forest-200 space-y-4 py-2 text-xs text-slate-700">
          <p>
            You are approving <strong>{document.documentType}</strong> for <strong>{detail.company.name}</strong>.
          </p>

          <div className="dark:border-forest-800 dark:bg-forest-950 space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <label className="dark:text-forest-100 block text-xs font-bold text-slate-800">
              Authorization Expiry Date (Optional)
            </label>
            <p className="dark:text-forest-400 text-[11px] text-slate-500">
              Recommended for Letters of Authorization. Leave blank if valid indefinitely.
            </p>
            <input
              type="date"
              value={approveExpiry}
              onChange={(e) => setApproveExpiry(e.target.value)}
              className="dark:border-forest-700 dark:bg-forest-900 dark:text-forest-100 mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() + 1);
                  setApproveExpiry(d.toISOString().slice(0, 10));
                }}
                className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                +1 Year
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() + 2);
                  setApproveExpiry(d.toISOString().slice(0, 10));
                }}
                className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                +2 Years
              </button>
              <button
                type="button"
                onClick={() => setApproveExpiry('')}
                className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-400 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
              >
                No Expiry
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Verification Document"
        description="The rejection reason is dispatched to the applicant and logged in audit trails."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRejectOpen(false)}
              className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isRejecting}
              className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50"
            >
              {isRejecting ? 'Rejecting...' : 'Reject Document'}
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="dark:text-forest-200 text-xs font-bold text-slate-700">Standard Reason</label>
            <div className="space-y-1.5">
              {REJECT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRejectReason(preset)}
                  className={`w-full rounded-xl border p-2.5 text-left text-xs transition ${
                    rejectReason === preset
                      ? 'border-rose-500 bg-rose-50 font-bold text-rose-900 dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-200'
                      : 'dark:border-forest-700 dark:bg-forest-900 dark:text-forest-300 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="dark:text-forest-200 text-xs font-bold text-slate-700">
              Specific Instructions for Applicant <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              rows={3}
              value={rejectDetail}
              onChange={(e) => setRejectDetail(e.target.value)}
              placeholder="Explain what steps the user needs to correct..."
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 mt-1"
            />
          </div>
        </div>
      </Modal>

      {/* REQUEST MORE INFO MODAL */}
      <Modal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        title="Request Additional Information"
        description="Notify applicant to provide supplementary documentation."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRequestOpen(false)}
              className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRequestMoreInfo}
              disabled={isRequesting}
              className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-sky-700 disabled:opacity-50"
            >
              {isRequesting ? 'Requesting...' : 'Send Request'}
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="dark:text-forest-200 text-xs font-bold text-slate-700">Information Needed</label>
            <div className="space-y-1.5">
              {REQUEST_INFO_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRequestReason(preset)}
                  className={`w-full rounded-xl border p-2.5 text-left text-xs transition ${
                    requestReason === preset
                      ? 'border-sky-500 bg-sky-50 font-bold text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200'
                      : 'dark:border-forest-700 dark:bg-forest-900 dark:text-forest-300 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="dark:text-forest-200 text-xs font-bold text-slate-700">
              Guidance Note <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              rows={3}
              value={requestDetail}
              onChange={(e) => setRequestDetail(e.target.value)}
              placeholder="Specify requirements..."
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 mt-1"
            />
          </div>
        </div>
      </Modal>

      {/* REVOKE MODAL */}
      <Modal
        isOpen={isRevokeOpen}
        onClose={() => setIsRevokeOpen(false)}
        title="Revoke Verification Approval"
        description="Suspends enterprise publishing rights and emits PublishRightLostEvent."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRevokeOpen(false)}
              className="dark:border-forest-700 dark:text-forest-200 dark:hover:bg-forest-800 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRevoke}
              disabled={isRevoking}
              className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50"
            >
              {isRevoking ? 'Revoking...' : 'Confirm Revocation'}
            </button>
          </div>
        }
      >
        <div className="dark:text-forest-200 space-y-3 py-2 text-xs text-slate-700">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
            <p className="font-bold">Cautionary Impact Notice:</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              <li>The recruiter&apos;s publishing rights will be immediately suspended (`canPublish = false`).</li>
              <li>Active job campaigns may be halted and public vacancy listings unlisted.</li>
            </ul>
          </div>

          <div>
            <label className="dark:text-forest-200 text-xs font-bold text-slate-700">
              Reason for Revocation <span className="text-rose-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="State the compliance violation..."
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 mt-1"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

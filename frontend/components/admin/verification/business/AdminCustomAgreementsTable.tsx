'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import Spinner from '@/components/common/Spinner';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { isApiError } from '@/lib/api-error';
import type { AdminCompanyAgreementResource, AgreementStatus } from '@/types/recruiter-company';
import { formatDate } from '@/utils/datetime';
import {
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  RotateCcw,
  RotateCw,
  Search,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const REJECT_AGREEMENT_PRESETS = [
  'Custom agreement does not meet minimum statutory standards under Decree 13/2023/ND-CP',
  'Document lacks official signature of Legal Representative or corporate seal',
  'Document scan is illegible, corrupted, or has cropped text sections',
  'Enterprise details in the agreement do not match official corporate registration records',
  'Agreement clauses improperly waive candidate rights or restrict candidate statutory access',
];

export function AdminCustomAgreementsTable() {
  const [agreements, setAgreements] = useState<AdminCompanyAgreementResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | AgreementStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const pageSize = 10;

  // Document Viewer Lightbox Modal state
  const [viewingAgreement, setViewingAgreement] = useState<AdminCompanyAgreementResource | null>(null);
  const [docBlobUrl, setDocBlobUrl] = useState<string | null>(null);
  const [docBlobType, setDocBlobType] = useState<'pdf' | 'image' | 'unknown'>('unknown');
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reject Modal state
  const [rejectingAgreement, setRejectingAgreement] = useState<AdminCompanyAgreementResource | null>(null);
  const [rejectReason, setRejectReason] = useState<string>(REJECT_AGREEMENT_PRESETS[0]);
  const [rejectDetail, setRejectDetail] = useState<string>('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Approve Modal state
  const [approvingAgreement, setApprovingAgreement] = useState<AdminCompanyAgreementResource | null>(null);
  const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);

  // Fetch agreements via effect
  useEffect(() => {
    let active = true;
    adminBusinessVerificationApi
      .searchAgreements(statusFilter === 'ALL' ? undefined : statusFilter, 0, 100)
      .then((pageData) => {
        if (active) {
          setAgreements(pageData?.items || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          if (isApiError(err)) {
            toast.error(err.message || 'Failed to load custom agreements');
          } else {
            toast.error('Failed to load custom agreements');
          }
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [statusFilter, reloadKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  };

  // Open Document Viewer
  const handleOpenDocViewer = async (agreement: AdminCompanyAgreementResource) => {
    setViewingAgreement(agreement);
    setIsLoadingDoc(true);
    setZoom(1);
    setRotation(0);
    try {
      const blob = await adminBusinessVerificationApi.viewAgreementBlob(agreement.id);
      const url = URL.createObjectURL(blob);
      setDocBlobUrl(url);
      if (blob.type.includes('pdf')) {
        setDocBlobType('pdf');
      } else if (blob.type.includes('image')) {
        setDocBlobType('image');
      } else {
        setDocBlobType('pdf');
      }
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Cannot load agreement document');
      } else {
        toast.error('Failed to retrieve agreement document');
      }
      setViewingAgreement(null);
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleCloseDocViewer = () => {
    if (docBlobUrl) {
      URL.revokeObjectURL(docBlobUrl);
      setDocBlobUrl(null);
    }
    setViewingAgreement(null);
  };

  // Handle Approve
  const handleApprove = async () => {
    if (!approvingAgreement) return;
    setIsSubmittingApprove(true);
    try {
      await adminBusinessVerificationApi.approveAgreement(approvingAgreement.id);
      toast.success(
        `Custom agreement for "${approvingAgreement.companyName}" has been approved! Candidate processing privileges are now active.`,
      );
      setApprovingAgreement(null);
      if (viewingAgreement?.id === approvingAgreement.id) {
        handleCloseDocViewer();
      }
      handleRefresh();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Approval failed');
      } else {
        toast.error('Failed to approve custom agreement');
      }
    } finally {
      setIsSubmittingApprove(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    if (!rejectingAgreement) return;
    setIsSubmittingReject(true);
    try {
      const fullReason = rejectDetail.trim() ? `${rejectReason}. Note: ${rejectDetail.trim()}` : rejectReason;
      await adminBusinessVerificationApi.rejectAgreement(rejectingAgreement.id, { reason: fullReason });
      toast.success(`Custom agreement for "${rejectingAgreement.companyName}" has been rejected.`);
      setRejectingAgreement(null);
      setRejectDetail('');
      if (viewingAgreement?.id === rejectingAgreement.id) {
        handleCloseDocViewer();
      }
      handleRefresh();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Rejection failed');
      } else {
        toast.error('Failed to reject custom agreement');
      }
    } finally {
      setIsSubmittingReject(false);
    }
  };

  // Filter and pagination
  const filtered = useMemo(() => {
    return agreements.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const kw = searchTerm.trim().toLowerCase();
        const matchCompany = item.companyName?.toLowerCase().includes(kw);
        const matchTax = item.companyTaxCode?.toLowerCase().includes(kw);
        const matchSubmitter =
          item.signedByName?.toLowerCase().includes(kw) || item.signedByEmail?.toLowerCase().includes(kw);
        return matchCompany || matchTax || matchSubmitter;
      }
      return true;
    });
  }, [agreements, statusFilter, searchTerm]);

  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Control Bar: Search + Status Pills + Refresh */}
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 flex flex-col gap-3 rounded-2xl border bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="dark:text-forest-400 text-outline pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Search by company name, tax ID, or submitter email..."
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-100 dark:placeholder-forest-400 border-outline-variant bg-surface-container-low/60 text-on-surface w-full rounded-xl border py-2 pr-4 pl-10 text-xs placeholder-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Status Pills */}
          {(['ALL', 'PENDING_REVIEW', 'ACCEPTED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(0);
              }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'dark:bg-forest-800 dark:text-forest-300 dark:hover:bg-forest-700 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {st === 'ALL'
                ? 'All Status'
                : st === 'PENDING_REVIEW'
                  ? 'Pending Review'
                  : st === 'ACCEPTED'
                    ? 'Approved'
                    : 'Rejected'}
            </button>
          ))}

          <button
            type="button"
            onClick={handleRefresh}
            className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex items-center gap-1 rounded-lg border bg-white px-2.5 py-1.5 text-xs font-semibold shadow-2xs"
            title="Refresh agreements"
          >
            <RotateCcw className="text-on-surface-variant h-3.5 w-3.5" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 overflow-hidden rounded-2xl border bg-white shadow-2xs">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Spinner />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
              <FileText className="h-6 w-6" />
            </div>
            <h4 className="text-on-surface mt-3 text-sm font-bold">No Custom Agreements Found</h4>
            <p className="text-on-surface-variant mt-1 max-w-sm text-xs">
              {searchTerm || statusFilter !== 'ALL'
                ? 'No agreements match your current search and filter criteria.'
                : 'Enterprises that upload custom candidate data processing agreements will appear here for compliance review.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="dark:border-forest-800 dark:bg-forest-950/40 border-outline-variant bg-surface-container-low text-label-sm text-on-surface-variant border-b font-bold tracking-wider uppercase">
                <tr>
                  <th className="px-4 py-3.5">Company Details</th>
                  <th className="px-4 py-3.5">Submitter</th>
                  <th className="px-4 py-3.5">Agreement Type</th>
                  <th className="px-4 py-3.5">Submitted Date</th>
                  <th className="px-4 py-3.5">Review Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="dark:divide-forest-800/60 divide-outline-variant divide-y">
                {paginated.map((agreement) => {
                  const isPending = agreement.status === 'PENDING_REVIEW';
                  const isApproved = agreement.status === 'ACCEPTED';

                  return (
                    <tr
                      key={agreement.id}
                      className="dark:hover:bg-forest-800/40 hover:bg-surface-container-low/70 transition"
                    >
                      {/* Company Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-on-surface max-w-[220px] truncate font-bold">{agreement.companyName}</p>
                            <p className="text-label-sm text-on-surface-variant font-mono">
                              Tax: {agreement.companyTaxCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Submitter */}
                      <td className="px-4 py-3.5">
                        <p className="text-on-surface font-semibold">
                          {agreement.signedByName || `User #${agreement.signedByUserId}`}
                        </p>
                        <p className="text-label-sm text-on-surface-variant max-w-[180px] truncate">
                          {agreement.signedByEmail || '—'}
                        </p>
                      </td>

                      {/* Agreement Type */}
                      <td className="px-4 py-3.5">
                        <span className="text-on-surface font-semibold">
                          {agreement.agreementType === 'CANDIDATE_DATA'
                            ? 'Candidate Data Agreement'
                            : 'Platform Service Agreement'}
                        </span>
                        <p className="text-label-sm text-on-surface-variant">
                          Scope: {agreement.scope} • Mode: {agreement.acceptanceMode}
                        </p>
                      </td>

                      {/* Submitted Date */}
                      <td className="text-on-surface-variant px-4 py-3.5 whitespace-nowrap">
                        {formatDate(agreement.acceptedAt)}
                      </td>

                      {/* Review Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                            <Clock className="h-3 w-3" /> Pending Review
                          </span>
                        ) : isApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Document */}
                          <button
                            type="button"
                            onClick={() => handleOpenDocViewer(agreement)}
                            className="border-outline-variant text-on-surface hover:border-primary hover:text-primary inline-flex items-center gap-1 rounded-lg border bg-white px-2.5 py-1 text-xs font-semibold shadow-2xs transition"
                            title="Preview custom agreement document"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </button>

                          {/* Quick Approve / Reject if Pending */}
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => setApprovingAgreement(agreement)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
                                title="Approve custom agreement"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setRejectingAgreement(agreement)}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition hover:bg-rose-700"
                                title="Reject custom agreement"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="dark:border-forest-800 dark:bg-forest-950/40 border-outline-variant text-on-surface-variant flex items-center justify-between border-t px-4 py-3 text-xs">
            <div>
              Showing <span className="text-on-surface font-bold">{currentPage * pageSize + 1}</span> to{' '}
              <span className="text-on-surface font-bold">{Math.min((currentPage + 1) * pageSize, totalItems)}</span> of{' '}
              <span className="text-on-surface font-bold">{totalItems}</span> custom agreements
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="border-outline-variant text-on-surface hover:bg-surface-container-low rounded-md border bg-white px-2.5 py-1 font-semibold shadow-2xs disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-on-surface-variant">
                Page {currentPage + 1} of {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={currentPage >= pageCount - 1}
                className="border-outline-variant text-on-surface hover:bg-surface-container-low rounded-md border bg-white px-2.5 py-1 font-semibold shadow-2xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. DOCUMENT VIEWER LIGHTBOX MODAL                        */}
      {/* ======================================================== */}
      {viewingAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="border-outline-variant shadow-elevation-2 relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-white">
            {/* Header */}
            <div className="border-outline-variant flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="text-primary flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-on-surface max-w-[420px] truncate text-sm font-bold">
                    Custom Agreement • {viewingAgreement.companyName}
                  </h3>
                  <p className="text-on-surface-variant text-xs">
                    Tax ID: {viewingAgreement.companyTaxCode} • Submitted on {formatDate(viewingAgreement.acceptedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {docBlobType === 'image' && (
                  <div className="border-outline-variant bg-surface-container-low flex items-center gap-1 rounded-lg border p-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                      className="text-on-surface-variant hover:bg-surface-container-high rounded p-1"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-label-sm text-on-surface px-1.5 font-semibold">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                      className="text-on-surface-variant hover:bg-surface-container-high rounded p-1"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="text-on-surface-variant hover:bg-surface-container-high rounded p-1"
                      title="Rotate 90°"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Quick actions inside viewer if pending */}
                {viewingAgreement.status === 'PENDING_REVIEW' && (
                  <div className="mr-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setApprovingAgreement(viewingAgreement)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingAgreement(viewingAgreement)}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-rose-700"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCloseDocViewer}
                  className="text-outline hover:bg-surface-container-high hover:text-on-surface rounded-xl p-2 transition"
                  aria-label="Close viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="bg-surface-container-high/90 relative flex min-h-[500px] flex-1 items-center justify-center overflow-auto p-4">
              {isLoadingDoc ? (
                <div className="flex flex-col items-center gap-3">
                  <Spinner />
                  <p className="text-on-surface-variant text-xs">Loading document from secure storage...</p>
                </div>
              ) : docBlobUrl ? (
                docBlobType === 'pdf' ? (
                  <iframe
                    src={docBlobUrl}
                    title="Custom Agreement Document"
                    className="h-full min-h-[550px] w-full rounded-xl border-0 shadow-xs"
                  />
                ) : (
                  <div className="flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={docBlobUrl}
                      alt="Custom Agreement"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.2s ease',
                      }}
                      className="shadow-elevation-1 max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                    />
                  </div>
                )
              ) : (
                <div className="text-on-surface-variant text-center text-xs">
                  <p>Cannot render preview for this document.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. APPROVE CONFIRMATION MODAL                            */}
      {/* ======================================================== */}
      {approvingAgreement && (
        <Modal
          isOpen={true}
          onClose={() => setApprovingAgreement(null)}
          title="Approve Custom Data Processing Agreement"
          description={`Confirm compliance approval for "${approvingAgreement.companyName}". Once approved, the company will be legally authorized to receive and process candidate CVs under Decree 13/2023/ND-CP.`}
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setApprovingAgreement(null)}
                disabled={isSubmittingApprove}
                className="border-outline text-on-surface hover:bg-surface-container-low rounded-lg border bg-white px-4 py-2 text-xs font-semibold shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmittingApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmittingApprove ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          }
        >
          <div className="border-outline-variant bg-surface-container-low space-y-3 rounded-lg border p-4 text-xs">
            <div className="text-on-surface grid grid-cols-2 gap-2">
              <div>
                <span className="text-on-surface-variant font-semibold">Enterprise:</span>
                <p className="text-on-surface font-bold">{approvingAgreement.companyName}</p>
              </div>
              <div>
                <span className="text-on-surface-variant font-semibold">Tax ID:</span>
                <p className="text-on-surface font-mono font-bold">{approvingAgreement.companyTaxCode}</p>
              </div>
              <div>
                <span className="text-on-surface-variant font-semibold">Signer / Submitter:</span>
                <p className="text-on-surface">{approvingAgreement.signedByName || '—'}</p>
              </div>
              <div>
                <span className="text-on-surface-variant font-semibold">Submitted Date:</span>
                <p className="text-on-surface">{formatDate(approvingAgreement.acceptedAt)}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* 3. REJECT MODAL WITH REASON PRESETS                     */}
      {/* ======================================================== */}
      {rejectingAgreement && (
        <Modal
          isOpen={true}
          onClose={() => setRejectingAgreement(null)}
          title="Reject Custom Data Processing Agreement"
          description={`Provide compliance feedback for "${rejectingAgreement.companyName}". The recruiter will receive this feedback and be requested to upload a corrected agreement.`}
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingAgreement(null)}
                disabled={isSubmittingReject}
                className="border-outline text-on-surface hover:bg-surface-container-low rounded-lg border bg-white px-4 py-2 text-xs font-semibold shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmittingReject}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-rose-700 disabled:opacity-50"
              >
                {isSubmittingReject ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Reason Presets */}
            <div className="space-y-2">
              <label className="text-on-surface block font-bold">Compliance Rejection Preset Reason</label>
              <div className="space-y-1.5">
                {REJECT_AGREEMENT_PRESETS.map((preset) => (
                  <label
                    key={preset}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition ${
                      rejectReason === preset
                        ? 'border-rose-400 bg-rose-50/50 font-semibold text-rose-950'
                        : 'border-outline-variant text-on-surface hover:bg-surface-container-low bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="agreement-reject-preset"
                      checked={rejectReason === preset}
                      onChange={() => setRejectReason(preset)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{preset}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1">
              <label className="text-on-surface block font-bold">Additional Officer Remarks (Optional)</label>
              <Textarea
                rows={3}
                value={rejectDetail}
                onChange={(e) => setRejectDetail(e.target.value)}
                placeholder="Specific guidance for the enterprise to correct their agreement..."
                className="w-full text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

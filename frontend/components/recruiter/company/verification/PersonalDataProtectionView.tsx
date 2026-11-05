'use client';

import { AccountSettingsLayout } from '../AccountSettingsLayout';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import { formatDate } from '@/utils/datetime';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  HelpCircle,
  RotateCw,
  UploadCloud,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

/* -------------------------------------------------------------------------- */
/*                    1. LOCAL FILE PREVIEW LIGHTBOX MODAL                   */
/* -------------------------------------------------------------------------- */

interface LocalFilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  isImage: boolean;
  isPdf: boolean;
}

function LocalFilePreviewModal({ isOpen, onClose, fileUrl, fileName, isImage, isPdf }: LocalFilePreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
              {isPdf ? <FileText className="h-5 w-5 text-rose-500" /> : <Eye className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="max-w-[420px] truncate text-sm font-bold text-slate-900">{fileName}</h3>
              <p className="text-xs text-slate-500">Document Preview (Before Submission)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 text-[11px] font-semibold text-slate-700">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200"
                  title="Rotate 90°"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="relative flex min-h-[460px] flex-1 items-center justify-center overflow-auto bg-slate-100/90 p-4">
          {isPdf ? (
            <iframe
              src={fileUrl}
              title={fileName}
              className="h-full min-h-[500px] w-full rounded-xl border-0 shadow-xs"
            />
          ) : isImage ? (
            <div className="flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt={fileName}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                }}
                className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500">
              <p>Cannot render preview for this file format directly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         2. MAIN VIEW COMPONENT                             */
/* -------------------------------------------------------------------------- */

export function PersonalDataProtectionView() {
  const { profile, handleAgreeCandidate, handleAgreePlatform, handleUploadCustomAgreement } = useCompanyVerification();

  // Section 1: Candidate Agreement State
  const candidateStatus = profile.candidateAgreement.status;
  const isCandidateAgreed = candidateStatus === 'APPROVED';
  const isCandidatePending = candidateStatus === 'IN_REVIEW';
  const isCandidateRejected = candidateStatus === 'REJECTED';
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [candidateMethod, setCandidateMethod] = useState<'STANDARD' | 'CUSTOM'>('STANDARD');

  const shouldShowUploadForm =
    (!isCandidatePending && !isCandidateAgreed) || isCandidateRejected || (isCandidateAgreed && showUpdateForm);

  const [candidateFile, setCandidateFile] = useState<File | null>(null);
  const [isCandidateAffirmed, setIsCandidateAffirmed] = useState(false);
  const [isSubmittingCandidate, setIsSubmittingCandidate] = useState(false);

  // Handle Standard Candidate Agreement Confirmation
  const handleConfirmStandardCandidateAgreement = async () => {
    setIsSubmittingCandidate(true);
    try {
      await handleAgreeCandidate();
      setShowUpdateForm(false);
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === 'AGREEMENT_ALREADY_ACCEPTED') {
          toast.success('Candidate data agreement has been recorded.');
          setShowUpdateForm(false);
        } else {
          toast.error(err.message || 'Could not confirm candidate data agreement.');
        }
      } else {
        toast.error('Failed to confirm agreement. Please try again.');
      }
    } finally {
      setIsSubmittingCandidate(false);
    }
  };

  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  // Local File Preview Modal state
  const [isLocalPreviewOpen, setIsLocalPreviewOpen] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>('');

  const handleOpenPreview = () => {
    if (!candidateFile) return;
    setLocalPreviewUrl(URL.createObjectURL(candidateFile));
    setIsLocalPreviewOpen(true);
  };

  const handleClosePreview = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl('');
    }
    setIsLocalPreviewOpen(false);
  };

  const isLocalPdf = candidateFile?.type === 'application/pdf' || candidateFile?.name.toLowerCase().endsWith('.pdf');
  const isLocalImage =
    candidateFile?.type.startsWith('image/') ||
    ['.jpg', '.jpeg', '.png'].some((ext) => candidateFile?.name.toLowerCase().endsWith(ext));

  // Section 2: Platform Agreement State
  const isPlatformAgreed = profile.platformAgreement.status === 'APPROVED';
  const [userToggledConsent, setUserToggledConsent] = useState<boolean | null>(null);
  const isPlatformConsentChecked = userToggledConsent ?? isPlatformAgreed;
  const [isSubmittingPlatform, setIsSubmittingPlatform] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // File Dropzone Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSelectFile(droppedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSelectFile(selected);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateAndSelectFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit. Please choose a smaller file.');
      return;
    }

    const ext = f.name.split('.').pop()?.toLowerCase();

    // Check for Word documents (.docx, .doc)
    if (['docx', 'doc'].includes(ext || '')) {
      toast.error(
        'Word documents (.docx, .doc) cannot be uploaded. Please export or scan your finalized agreement to PDF (recommended) or JPG/PNG before submitting.',
      );
      return;
    }

    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '')) {
      toast.error('Unsupported file format. Only PDF, JPG, and PNG files are accepted.');
      return;
    }

    setCandidateFile(f);
    toast.success(`Selected file: ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  // Section 1 Save Handler
  const handleSaveCandidateAgreement = async () => {
    if (!candidateFile) {
      toast.error('Please choose or drag your Candidate Data Processing Agreement document.');
      return;
    }
    if (!isCandidateAffirmed) {
      toast.error('Please check the affirmation box confirming this is a lawful legal document.');
      return;
    }

    setIsSubmittingCandidate(true);
    try {
      await handleUploadCustomAgreement('CANDIDATE_DATA', candidateFile);
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      setCandidateFile(null);
      setLocalPreviewUrl('');
      setIsCandidateAffirmed(false);
      setShowUpdateForm(false);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Could not upload candidate data agreement.');
      } else {
        toast.error('Failed to upload agreement. Please try again.');
      }
    } finally {
      setIsSubmittingCandidate(false);
    }
  };

  // Section 2 Confirm Handler
  const handleConfirmPlatformAgreement = async () => {
    if (isPlatformAgreed) {
      return;
    }
    if (!isPlatformConsentChecked) {
      toast.error('Please check the box to confirm your agreement with the terms.');
      return;
    }

    setIsSubmittingPlatform(true);
    try {
      await handleAgreePlatform();
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === 'AGREEMENT_ALREADY_ACCEPTED') {
          toast.success('Platform agreement has been recorded.');
        } else {
          toast.error(err.message || 'Could not accept platform agreement.');
        }
      } else {
        toast.error('Failed to confirm platform agreement.');
      }
    } finally {
      setIsSubmittingPlatform(false);
    }
  };

  return (
    <AccountSettingsLayout activeTab="agreements" pageTitle="Personal Data Protection">
      <div className="space-y-8">
        {/* ======================================================== */}
        {/* SECTION 1: Candidate - Employer Agreement                */}
        {/* ======================================================== */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-800 sm:text-base">
              Candidate - Recruiter Personal Data Processing Agreement
            </h2>
            <p className="text-xs text-slate-600">
              View purpose of use and upload guidelines{' '}
              <button
                type="button"
                onClick={() => setIsGuidelinesOpen(true)}
                className="font-semibold text-[#00b14f] hover:underline"
              >
                here
              </button>
            </p>
          </div>

          {/* Awaiting Review Status Box */}
          {isCandidatePending && (
            <div className="space-y-3 rounded-lg border border-amber-200/90 bg-amber-50/40 p-5 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">Awaiting Compliance Review</h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Your customized Candidate Data Processing Agreement has been submitted and is currently being
                    evaluated by compliance officers. Standard review turnaround is within 24 business hours.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-amber-200/60 pt-2 text-xs sm:grid-cols-3">
                {profile.candidateAgreement.agreedAt && (
                  <div>
                    <span className="font-semibold text-slate-700">Submitted On:</span>
                    <p className="text-slate-800">{formatDate(profile.candidateAgreement.agreedAt)}</p>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-slate-700">Reviewing Authority:</span>
                  <p className="text-slate-800">InterVue Trust &amp; Safety Compliance Team</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Estimated Turnaround (SLA):</span>
                  <p className="text-slate-800">Within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-amber-200/60 pt-2 text-xs">
                <span className="text-slate-500 italic">
                  Data processing privileges will be activated automatically once approved.
                </span>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#00b14f] hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Template (.docx)</span>
                </button>
              </div>
            </div>
          )}

          {/* Approved Status Box */}
          {isCandidateAgreed && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#00b14f]" />
                <div>
                  <p className="text-xs font-bold text-slate-900 sm:text-sm">
                    Candidate Agreement Active &amp; Approved
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Your custom agreement is officially recorded under Decree 13/2023/ND-CP.
                    {profile.candidateAgreement.agreedAt &&
                      ` Effective since ${formatDate(profile.candidateAgreement.agreedAt)}.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUpdateForm(!showUpdateForm)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              >
                {showUpdateForm ? 'Close Form' : 'Update Agreement'}
              </button>
            </div>
          )}

          {/* Rejected Status Box */}
          {isCandidateRejected && (
            <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/60 p-4 shadow-2xs">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div className="space-y-1 text-xs text-rose-950">
                <p className="font-bold">Custom Agreement Rejected</p>
                <p>
                  {profile.candidateAgreement.reviewReason
                    ? `Compliance remarks: "${profile.candidateAgreement.reviewReason}"`
                    : 'Your submitted document did not meet compliance requirements. Please adjust and re-upload.'}
                </p>
              </div>
            </div>
          )}

          {/* Method Selection & Form Container (Hidden when Awaiting Review or when Approved and not updating) */}
          {shouldShowUploadForm && (
            <div className="space-y-4">
              {/* Option Selector Radios */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
                    candidateMethod === 'STANDARD'
                      ? 'border-[#00b14f] bg-emerald-50/30 ring-1 ring-[#00b14f]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="candidate-agreement-method"
                    checked={candidateMethod === 'STANDARD'}
                    onChange={() => setCandidateMethod('STANDARD')}
                    className="mt-0.5 h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">Standard Agreement</span>
                      <span className="py-0.2 rounded bg-emerald-100 px-1.5 text-[10px] font-semibold text-[#00b14f]">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Use InterVue&apos;s standard terms under Decree 13/2023/ND-CP. Immediate activation, no upload
                      needed.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
                    candidateMethod === 'CUSTOM'
                      ? 'border-[#00b14f] bg-emerald-50/30 ring-1 ring-[#00b14f]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="candidate-agreement-method"
                    checked={candidateMethod === 'CUSTOM'}
                    onChange={() => setCandidateMethod('CUSTOM')}
                    className="mt-0.5 h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">Custom Enterprise Document</span>
                      <span className="py-0.2 rounded bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-600">
                        Review Required
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Upload your enterprise-specific agreement with legal representative signature or company seal.
                    </p>
                  </div>
                </label>
              </div>

              {/* Method 1: Standard Template Confirmation Card */}
              {candidateMethod === 'STANDARD' && (
                <div className="space-y-4 rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                      InterVue Standard Candidate Data Processing Terms
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      Pursuant to Decree No. 13/2023/ND-CP and Law on Personal Data Protection No. 91/2025/QH15, by
                      confirming this standard agreement, your Enterprise authorizes InterVue to present standard data
                      consent terms to candidates upon application. Your Enterprise agrees to handle candidate personal
                      information strictly for recruitment and screening purposes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/data-processing-agreement"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00b14f] hover:underline"
                    >
                      <span>Read full standard agreement text</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={handleConfirmStandardCandidateAgreement}
                      disabled={isSubmittingCandidate}
                      className="inline-flex items-center justify-center rounded-md bg-[#00b14f] px-7 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#009b45] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      {isSubmittingCandidate ? 'Activating...' : 'Confirm Standard Agreement'}
                    </button>
                  </div>
                </div>
              )}

              {/* Method 2: Custom Enterprise Document Upload Form */}
              {candidateMethod === 'CUSTOM' && (
                <div className="space-y-5 rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Agreement Document <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500">
                      Document demonstrating candidate consent for the Employer to collect, store, and process personal
                      data for recruitment purposes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Dropzone (8 cols) */}
                    <div className="space-y-2 lg:col-span-8">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleInputChange}
                        className="sr-only"
                      />

                      {candidateFile ? (
                        /* Selected File Box with Preview Button */
                        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs transition">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-[#00b14f]">
                              {isLocalPdf ? (
                                <FileText className="h-5 w-5 text-rose-500" />
                              ) : (
                                <FileCheck2 className="h-5 w-5 text-[#00b14f]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900">{candidateFile.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {(candidateFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={handleOpenPreview}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-[#00b14f] hover:text-[#00b14f]"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#00b14f]" />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
                                setCandidateFile(null);
                                setLocalPreviewUrl('');
                              }}
                              className="rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                              aria-label="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Empty Dropzone (Original Style with PDF/JPG/PNG formats) */
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-5 py-7 text-center transition ${
                            isDragOver
                              ? 'border-[#00b14f] bg-emerald-50/40'
                              : 'border-slate-300 bg-slate-50/30 hover:border-[#00b14f] hover:bg-emerald-50/20'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-800">Choose or drag file here</p>
                          <p className="text-[11px] text-slate-500">Maximum file size 5MB, format: pdf, jpg, png</p>

                          <button
                            type="button"
                            tabIndex={-1}
                            className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-[#00b14f] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            <span>Choose file</span>
                          </button>
                        </div>
                      )}

                      <p className="text-[11px] text-amber-700">
                        * Uploaded documents must show all pages and have no signs of modification, covering, or
                        cropping.
                      </p>
                    </div>

                    {/* Right Column: Template Box (4 cols) */}
                    <div className="flex flex-col items-center justify-start space-y-2 lg:col-span-4 lg:border-l lg:border-slate-100 lg:pl-6">
                      <p className="text-xs font-bold text-slate-700">Template Document</p>
                      <button
                        type="button"
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md border border-[#00b14f] bg-white px-4 py-2 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50 active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Template</span>
                      </button>
                    </div>
                  </div>

                  {/* Affirmation Checkbox */}
                  <div className="pt-2">
                    <label
                      htmlFor="candidate-affirmation-consent"
                      className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-700 select-none"
                    >
                      <input
                        id="candidate-affirmation-consent"
                        type="checkbox"
                        checked={isCandidateAffirmed}
                        disabled={isSubmittingCandidate}
                        onChange={(e) => setIsCandidateAffirmed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                      />
                      <span>
                        I affirm that this document is a lawful legal document of the enterprise and assume full
                        responsibility for the accuracy and validity of its content. InterVue serves solely as an
                        intermediary platform to store this document.
                      </span>
                    </label>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={handleSaveCandidateAgreement}
                      disabled={isSubmittingCandidate || !candidateFile || !isCandidateAffirmed}
                      className="inline-flex items-center justify-center rounded-md bg-[#00b14f] px-7 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#009b45] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      {isSubmittingCandidate ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: Platform - Recruiter Agreement (Original Style) */}
        {/* ======================================================== */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-800 sm:text-base">
              InterVue - Recruiter Personal Data Processing Agreement
            </h2>
          </div>

          {/* Form Card Container */}
          <div className="space-y-4 rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs">
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Pursuant to the Law on Personal Data Protection No. 91/2025/QH15 and Decree No. 13/2023/ND-CP, InterVue
              officially enforces the Personal Data Processing Agreement across the platform. This agreement clarifies
              the respective roles and legal obligations of your Enterprise and InterVue regarding candidate CVs
              transferred to your Organization Workspace. Please read carefully and confirm your consent to ensure
              lawful, transparent recruitment operations without interruption.
            </p>

            {isPlatformAgreed ? (
              /* Confirmed Status Box */
              <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00b14f]" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 sm:text-sm">
                      Platform Agreement Confirmed &amp; Active
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Your Enterprise has officially consented to the InterVue Personal Data Processing Agreement
                      {profile.platformAgreement.agreedAt && ` on ${formatDate(profile.platformAgreement.agreedAt)}`}.
                    </p>
                  </div>
                </div>

                <Link
                  href="/data-processing-agreement"
                  target="_blank"
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 sm:self-auto"
                >
                  <span>Review Terms</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              /* Unconfirmed Form */
              <>
                <div>
                  <Link
                    href="/data-processing-agreement"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00b14f] hover:underline"
                  >
                    <span>View full text of agreement</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="platform-agreement-consent"
                    className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-700 select-none sm:text-sm"
                  >
                    <input
                      id="platform-agreement-consent"
                      type="checkbox"
                      checked={Boolean(userToggledConsent)}
                      disabled={isSubmittingPlatform}
                      onChange={(e) => setUserToggledConsent(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                    />
                    <span>
                      Confirm agreement to the terms of the{' '}
                      <Link
                        href="/data-processing-agreement"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-[#00b14f] hover:underline"
                      >
                        Personal Data Processing Agreement
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={handleConfirmPlatformAgreement}
                    disabled={isSubmittingPlatform || !userToggledConsent}
                    className="inline-flex items-center justify-center rounded-md bg-[#00b14f] px-7 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#009b45] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    {isSubmittingPlatform ? 'Confirming...' : 'Confirm Agreement'}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Floating Bottom Navigation: Next Step (Original Style) */}
        <div className="fixed right-6 bottom-4 z-40">
          <Link
            href={ROUTES.RECRUITER_COMPANY}
            className="flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xs transition hover:scale-102 hover:bg-slate-900"
          >
            <span>Next: Company Profile</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b14f] text-white">
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: Download Word Template Disclaimer Modal         */}
      {/* ======================================================== */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Download Template Document</h3>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
              <p className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  This template agreement is provided for reference purposes only. You may choose to use this template
                  or upload a customized agreement drafted by your enterprise.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  The template is provided in Word format (.docx) so you can easily edit and fill in company details.
                  Before submitting, please export or scan your signed/stamped agreement to PDF (recommended) or
                  JPG/PNG.
                </span>
              </p>
              <p className="pt-2 text-xs font-semibold text-slate-800">
                After reviewing the above notice, click &ldquo;Download&rdquo; to save the Word template (.docx) to your
                device.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <a
                href="/templates/intervue-candidate-data-processing-agreement-template.docx"
                download="intervue-candidate-data-processing-agreement-template.docx"
                onClick={() => setIsTemplateModalOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#00b14f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#009b45]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Guidelines Modal                                */}
      {/* ======================================================== */}
      {isGuidelinesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#00b14f]" />
                <h3 className="text-base font-bold text-slate-900">
                  Data Processing Agreement Purpose &amp; Guidelines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGuidelinesOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="font-bold text-slate-800">1. Purpose of Candidate Agreement</h4>
                <p className="mt-1 text-xs text-slate-600">
                  Under Decree 13/2023/ND-CP and Law No. 91/2025/QH15, employers processing candidate personal data
                  (CVs, contact numbers, portfolios, references) must obtain explicit consent from the data subject for
                  recruitment purposes.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="font-bold text-slate-800">2. Document Requirements</h4>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                  <li>Accepted file formats: PDF (recommended), JPG, JPEG, PNG (maximum 5MB).</li>
                  <li>Word documents (.docx) must be exported or scanned to PDF after signing/stamping.</li>
                  <li>Must clearly state the Enterprise Name matching your official business registration.</li>
                  <li>Must contain clear scope: collection, storage, screening, and evaluation for recruitment.</li>
                  <li>All pages and text must be complete without obscured or cropped sections.</li>
                </ul>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-amber-900">
                <h4 className="font-bold text-amber-950">3. InterVue Platform Agreement</h4>
                <p className="mt-1 text-xs text-amber-800">
                  By confirming the Platform Agreement, your enterprise establishes a lawful data controller-processor
                  relationship with InterVue, safeguarding candidate CV pipelines transmitted to your hiring team.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsGuidelinesOpen(false)}
                className="rounded-md bg-[#00b14f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#009b45]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Preview Lightbox Modal */}
      <LocalFilePreviewModal
        isOpen={isLocalPreviewOpen}
        onClose={handleClosePreview}
        fileUrl={localPreviewUrl}
        fileName={candidateFile?.name || 'Selected_Agreement'}
        isImage={Boolean(isLocalImage)}
        isPdf={Boolean(isLocalPdf)}
      />
    </AccountSettingsLayout>
  );
}

export default PersonalDataProtectionView;

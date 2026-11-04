'use client';

import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import { ROUTES } from '@/constants/routes';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  UploadCloud,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

export function PersonalDataProtectionView() {
  const { profile, handleAgreePlatform, handleUploadCustomAgreement } = useCompanyVerification();

  // Section 1: Candidate Agreement State
  const isCandidateAgreed = profile.candidateAgreement.status === 'APPROVED';
  const isCandidatePending = profile.candidateAgreement.status === 'IN_REVIEW';
  const [candidateFile, setCandidateFile] = useState<File | null>(null);
  const [isCandidateAffirmed, setIsCandidateAffirmed] = useState(false);
  const [isSubmittingCandidate, setIsSubmittingCandidate] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

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
    if (!['docx', 'doc', 'pdf'].includes(ext || '')) {
      toast.error('Unsupported file format. Only DOCX, DOC, and PDF files are accepted.');
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
      setCandidateFile(null);
      setIsCandidateAffirmed(false);
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
    if (!isPlatformConsentChecked) {
      toast.error('Please check the box to confirm your agreement with the terms.');
      return;
    }

    setIsSubmittingPlatform(true);
    try {
      await handleAgreePlatform();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Could not accept platform agreement.');
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
        {/* SECTION 1: Candidate - Employer Agreement (TopCV Style) */}
        {/* ======================================================== */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                Candidate - Recruiter Personal Data Processing Agreement
              </h2>
              {isCandidateAgreed ? (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#00b14f]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Updated &amp; Approved
                </span>
              ) : isCandidatePending ? (
                <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  <Clock className="h-3.5 w-3.5" /> Awaiting Review
                </span>
              ) : (
                <span className="inline-flex items-center rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  Not Updated
                </span>
              )}
            </div>
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

          {/* Form Card Container */}
          <div className="space-y-5 rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Agreement Document <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Document demonstrating candidate consent for the Employer to collect, store, and process personal data
                for recruitment purposes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Dropzone (8 cols) */}
              <div className="space-y-2 lg:col-span-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.doc,.pdf"
                  onChange={handleInputChange}
                  className="sr-only"
                />

                {candidateFile ? (
                  /* Selected File Box */
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 transition">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-[#00b14f]">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900">{candidateFile.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {(candidateFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setCandidateFile(null)}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty Dropzone (TopCV Style) */
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
                    <p className="text-[11px] text-slate-500">Maximum file size 5MB, format: docx, doc, pdf</p>

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
                  * Uploaded documents must show all pages and have no signs of modification, covering, or cropping.
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
                  responsibility for the accuracy and validity of its content. InterVue serves solely as an intermediary
                  platform to store this document.
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
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: Platform - Employer Agreement (TopCV Style)  */}
        {/* ======================================================== */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-sm font-bold text-slate-800 sm:text-base">
              InterVue - Recruiter Personal Data Processing Agreement
            </h2>
            {isPlatformAgreed ? (
              <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#00b14f]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                Unconfirmed
              </span>
            )}
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
                  checked={isPlatformConsentChecked}
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
                disabled={isSubmittingPlatform || !isPlatformConsentChecked}
                className="inline-flex items-center justify-center rounded-md bg-[#00b14f] px-7 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#009b45] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {isSubmittingPlatform
                  ? 'Confirming...'
                  : isPlatformAgreed && isPlatformConsentChecked
                    ? 'Confirmed'
                    : 'Confirm Agreement'}
              </button>
            </div>
          </div>
        </section>

        {/* Floating / Sticky Bottom Navigation: Next Step (TopCV Style) */}
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
      {/* MODAL 1: Download Template Disclaimer (TopCV Style)     */}
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
                  The template and accompanying clauses are informational and do not substitute for formal legal
                  counsel. Before executing or publishing, please consult with qualified legal advisors or compliance
                  officers.
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
      {/* MODAL 2: Guidelines Modal (TopCV Style)                  */}
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
                  <li>Accepted file formats: DOCX, DOC, or PDF (maximum 5MB).</li>
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
    </AccountSettingsLayout>
  );
}

export default PersonalDataProtectionView;

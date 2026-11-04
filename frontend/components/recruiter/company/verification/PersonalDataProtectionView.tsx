'use client';

import FileDropInput from '@/components/ui/FileDropInput';
import {
  PLATFORM_DATA_AGREEMENT_PREVIEW,
  STANDARD_CANDIDATE_AGREEMENT_PREVIEW,
} from '@/constants/company-verification';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import { AlertTriangle, CheckCircle2, Clock, Download, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

export function PersonalDataProtectionView() {
  const { profile, handleAgreeCandidate, handleAgreePlatform, handleUploadCustomAgreement } = useCompanyVerification();

  // Section 1: Candidate Agreement State
  const isCandidateAgreed = profile.candidateAgreement.status === 'APPROVED';
  const isCandidatePending = profile.candidateAgreement.status === 'IN_REVIEW';
  const [candidateMode, setCandidateMode] = useState<'STANDARD' | 'CUSTOM'>('STANDARD');
  const [customCandidateFile, setCustomCandidateFile] = useState<File | null>(null);
  const [isSubmittingCandidate, setIsSubmittingCandidate] = useState(false);

  // Section 2: Platform Agreement State
  const isPlatformAgreed = profile.platformAgreement.status === 'APPROVED';
  const isPlatformPending = profile.platformAgreement.status === 'IN_REVIEW';
  const [isSubmittingPlatform, setIsSubmittingPlatform] = useState(false);

  // Modals / expanded view for agreement text
  const [showFullCandidateTerms, setShowFullCandidateTerms] = useState(false);
  const [showFullPlatformTerms, setShowFullPlatformTerms] = useState(false);

  const handleConfirmCandidateAgreement = async () => {
    if (candidateMode === 'STANDARD') {
      setIsSubmittingCandidate(true);
      try {
        await handleAgreeCandidate();
      } catch (err) {
        if (isApiError(err)) {
          toast.error(err.message || 'Could not accept candidate data agreement.');
        } else {
          toast.error('Failed to confirm agreement.');
        }
      } finally {
        setIsSubmittingCandidate(false);
      }
    } else {
      if (!customCandidateFile) {
        toast.error('Please select a custom agreement document before uploading.');
        return;
      }
      setIsSubmittingCandidate(true);
      try {
        await handleUploadCustomAgreement('CANDIDATE_DATA', customCandidateFile);
        setCustomCandidateFile(null);
      } catch (err) {
        if (isApiError(err)) {
          toast.error(err.message || 'Could not upload custom agreement.');
        } else {
          toast.error('Failed to upload custom agreement.');
        }
      } finally {
        setIsSubmittingCandidate(false);
      }
    }
  };

  const handleConfirmPlatformAgreement = async () => {
    setIsSubmittingPlatform(true);
    try {
      await handleAgreePlatform();
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Could not accept platform agreement.');
      } else {
        toast.error('Failed to confirm agreement.');
      }
    } finally {
      setIsSubmittingPlatform(false);
    }
  };

  const handleDownloadTemplate = (type: 'candidate' | 'platform') => {
    const text = type === 'candidate' ? STANDARD_CANDIDATE_AGREEMENT_PREVIEW : PLATFORM_DATA_AGREEMENT_PREVIEW;
    const fileName =
      type === 'candidate' ? 'InterVue_Candidate_Data_Agreement_Template.txt' : 'InterVue_Platform_Data_Agreement.txt';
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded ${fileName}`);
  };

  return (
    <AccountSettingsLayout activeTab="agreements" pageTitle="Personal Data Protection">
      <div className="space-y-6">
        {/* Anti-Deadlock Information Callout */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-emerald-950">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Decree 13/2023/ND-CP Compliance Model</p>
              <p className="text-xs leading-relaxed text-emerald-800">
                To guarantee lawful candidate CV processing, InterVue enforces a dual-layer data governance structure:
                corporate obligations signed on behalf of the company (inherited by all team members) and individual
                recruiter acknowledgments.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Candidate Data Processing Agreement */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">1. Candidate Data Processing Agreement</h2>
                {isCandidateAgreed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
                  </span>
                ) : isCandidatePending ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    <Clock className="h-3.5 w-3.5" /> Under Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Commitment to lawful processing of candidate profiles, CVs, and contact information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadTemplate('candidate')}
              className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Official Template</span>
            </button>
          </div>

          {/* Agreement Preview Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <pre className="max-h-48 overflow-y-auto font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
              {showFullCandidateTerms
                ? STANDARD_CANDIDATE_AGREEMENT_PREVIEW
                : `${STANDARD_CANDIDATE_AGREEMENT_PREVIEW.slice(0, 360)}...`}
            </pre>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFullCandidateTerms((prev) => !prev)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {showFullCandidateTerms ? 'Show less' : 'Read full agreement'}
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          {!isCandidateAgreed && (
            <div className="space-y-4">
              <div className="flex gap-4 border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setCandidateMode('STANDARD')}
                  className={`border-b-2 pb-2 text-xs font-bold transition ${
                    candidateMode === 'STANDARD'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Standard InterVue Template (Instant Activation)
                </button>
                <button
                  type="button"
                  onClick={() => setCandidateMode('CUSTOM')}
                  className={`border-b-2 pb-2 text-xs font-bold transition ${
                    candidateMode === 'CUSTOM'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Upload Custom Corporate Policy
                </button>
              </div>

              {candidateMode === 'STANDARD' ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 text-xs text-emerald-950">
                  <p className="font-semibold">
                    By confirming below, you and your organization agree to process all candidate records exclusively
                    for lawful recruitment objectives in strict adherence to Decree 13/2023/ND-CP.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <span className="font-bold">Notice:</span> Custom corporate agreements require manual review by
                        our compliance team. To avoid onboarding delays, we strongly recommend using the Standard
                        Template.
                      </div>
                    </div>
                  </div>

                  <FileDropInput
                    accept=".pdf,.png,.jpg,.jpeg"
                    helperText="Upload signed corporate data processing policy (PDF or images, max 5MB)."
                    onFileSelected={(file) => setCustomCandidateFile(file)}
                    selectedFileName={customCandidateFile?.name}
                  />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleConfirmCandidateAgreement}
                  disabled={isSubmittingCandidate}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingCandidate ? 'Saving...' : 'Accept Candidate Data Agreement'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Platform Data Service Agreement */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" id="platform">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">2. InterVue Platform Service Agreement</h2>
                {isPlatformAgreed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
                  </span>
                ) : isPlatformPending ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    <Clock className="h-3.5 w-3.5" /> Under Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Terms of platform service, data safeguards, and mutual employer obligations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadTemplate('platform')}
              className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Platform Terms</span>
            </button>
          </div>

          {/* Agreement Preview Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <pre className="max-h-48 overflow-y-auto font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
              {showFullPlatformTerms
                ? PLATFORM_DATA_AGREEMENT_PREVIEW
                : `${PLATFORM_DATA_AGREEMENT_PREVIEW.slice(0, 360)}...`}
            </pre>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFullPlatformTerms((prev) => !prev)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {showFullPlatformTerms ? 'Show less' : 'Read full agreement'}
              </button>
            </div>
          </div>

          {!isPlatformAgreed && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleConfirmPlatformAgreement}
                disabled={isSubmittingPlatform}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                {isSubmittingPlatform ? 'Saving...' : 'Accept Platform Service Agreement'}
              </button>
            </div>
          )}
        </div>
      </div>
    </AccountSettingsLayout>
  );
}

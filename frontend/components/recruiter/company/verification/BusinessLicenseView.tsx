'use client';

import FileDropInput from '@/components/ui/FileDropInput';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import type { BusinessDocumentType } from '@/types/recruiter-company';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

export function BusinessLicenseView() {
  const { profile, company, handleSubmitLicense } = useCompanyVerification();

  const isOwner = company?.myRole === 'OWNER';
  const isMember = company?.myRole === 'MEMBER';

  const [documentType, setDocumentType] = useState<BusinessDocumentType>(() => {
    if (isMember) return 'LETTER_OF_AUTHORIZATION';
    return profile.license.documentType || 'BUSINESS_LICENSE';
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelected = (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit. Please choose a smaller file.');
      return;
    }
    setSelectedFile(file);
    toast.success(`Selected file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error('Please select or drop a valid document file before saving.');
      return;
    }

    if (!company) {
      toast.error('You must link or create a company profile first.');
      return;
    }

    if (documentType === 'BUSINESS_LICENSE' && !isOwner) {
      toast.error('Only the company OWNER can submit the Enterprise Registration Certificate (ERC).');
      return;
    }

    setIsSubmitting(true);
    try {
      await handleSubmitLicense({
        documentType,
        file: selectedFile,
      });
      setSelectedFile(null);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message || 'Could not submit legal document.');
      } else {
        toast.error('Failed to submit document. Please check file format and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewStatus = profile.license.status;

  return (
    <AccountSettingsLayout activeTab="license" pageTitle="Business License & Authorization">
      <div className="space-y-6">
        {/* Status Callout Banner */}
        {reviewStatus === 'APPROVED' && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-950">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Document Verified & Approved</p>
              <p className="text-xs text-emerald-800">
                Your business legal document has been verified by the Compliance team. Enterprise publishing rights are
                active.
              </p>
              {profile.license.expiresAt && (
                <p className="text-xs font-semibold text-emerald-900">
                  Valid until: {new Date(profile.license.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {reviewStatus === 'PENDING_REVIEW' && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-amber-950">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Awaiting Compliance Review</p>
              <p className="text-xs text-amber-800">
                Your uploaded document &ldquo;{profile.license.fileName}&rdquo; was received and is currently under
                review by our Trust &amp; Safety team (typically within 24 business hours).
              </p>
            </div>
          </div>
        )}

        {reviewStatus === 'REJECTED' && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Document Rejected</p>
              <p className="text-xs text-rose-800">
                Compliance feedback: &ldquo;
                {profile.license.reviewReason || 'The submitted document does not meet verification requirements.'}
                &rdquo;
              </p>
              <p className="text-xs font-semibold text-rose-900">Please upload a corrected document below.</p>
            </div>
          </div>
        )}

        {reviewStatus === 'MORE_INFO_REQUIRED' && (
          <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50/80 p-5 text-sky-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Additional Information Required</p>
              <p className="text-xs text-sky-800">Compliance notice: &ldquo;{profile.license.reviewReason}&rdquo;</p>
              <p className="text-xs font-semibold text-sky-900">Please upload supplementary documentation below.</p>
            </div>
          </div>
        )}

        {reviewStatus === 'EXPIRED' && (
          <div className="flex items-start gap-3 rounded-2xl border border-slate-300 bg-slate-100 p-5 text-slate-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Authorization Expired</p>
              <p className="text-xs text-slate-600">
                Your previous Letter of Authorization has expired. Please submit a renewed letter to restore public job
                posting privileges.
              </p>
            </div>
          </div>
        )}

        {/* Main Document Upload Card */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Legal Representation Document</h2>
            <p className="text-xs text-slate-500">
              Submit your official Enterprise Registration Certificate (ERC) or Letter of Authorization (LOA) to unlock
              Level 3 Verified Enterprise privileges.
            </p>
          </div>

          {/* Document Type Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-wide text-slate-700 uppercase">Document Category</label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Option 1: BUSINESS_LICENSE */}
              <label
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition ${
                  documentType === 'BUSINESS_LICENSE'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : isMember
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="documentType"
                      value="BUSINESS_LICENSE"
                      disabled={isMember}
                      checked={documentType === 'BUSINESS_LICENSE'}
                      onChange={() => setDocumentType('BUSINESS_LICENSE')}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-slate-900">Enterprise Registration Certificate (ERC)</span>
                  </div>
                  {isMember && (
                    <span className="flex items-center gap-1 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                      <Lock className="h-3 w-3" /> Owner only
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Applicable to company creators and legal representatives. Requires an official business license issued
                  by the Department of Planning and Investment.
                </p>
              </label>

              {/* Option 2: LETTER_OF_AUTHORIZATION */}
              <label
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition ${
                  documentType === 'LETTER_OF_AUTHORIZATION'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="documentType"
                      value="LETTER_OF_AUTHORIZATION"
                      checked={documentType === 'LETTER_OF_AUTHORIZATION'}
                      onChange={() => setDocumentType('LETTER_OF_AUTHORIZATION')}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-slate-900">Letter of Authorization (LOA)</span>
                  </div>
                  {isMember && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Recommended for Members
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Applicable to HR specialists and recruiters authorized by the legal representative to post tech
                  positions on behalf of the company.
                </p>
              </label>
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-2">
            <FileDropInput
              label="Select Document File"
              accept=".pdf,.png,.jpg,.jpeg"
              helperText="Supported formats: PDF, PNG, JPG (maximum 5MB). Files are encrypted and scanned before compliance review."
              onFileSelected={handleFileSelected}
              selectedFileName={selectedFile?.name || profile.license.fileName}
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting || (!selectedFile && !profile.license.fileName)}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Upload & Submit for Review'}
            </button>
          </div>
        </div>

        {/* Legal Guidance Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-xs text-slate-600">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Legal Representation & Compliance Policy</p>
              <p className="leading-relaxed">
                InterVue strictly verifies corporate identities to protect candidate data and enterprise trademarks.
                Documents are stored in an encrypted vault and reviewed only by authorized platform compliance officers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AccountSettingsLayout>
  );
}

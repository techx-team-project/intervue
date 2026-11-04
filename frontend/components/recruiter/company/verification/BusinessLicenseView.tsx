'use client';

import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import { ROUTES } from '@/constants/routes';
import type { BusinessDocumentType } from '@/types/recruiter-company';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  HelpCircle,
  Lock,
  UploadCloud,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

interface DocumentDropzoneProps {
  label: string;
  required?: boolean;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
  acceptedFormatsText?: string;
  warningBullets: string[];
  illustrationSrc: string;
  illustrationAlt: string;
  illustrationCaption?: string;
  actionButton?: React.ReactNode;
}

function DocumentDropzone({
  label,
  required = true,
  file,
  onFileSelect,
  onFileRemove,
  disabled = false,
  acceptedFormatsText = 'Max file size 5MB, format: jpeg, jpg, png, pdf',
  warningBullets,
  illustrationSrc,
  illustrationAlt,
  illustrationCaption,
  actionButton,
}: DocumentDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSelect(droppedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSelect(selected);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateAndSelect = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit. Please choose a smaller file.');
      return;
    }
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext || '')) {
      toast.error('Unsupported file format. Only PDF, JPG, JPEG, and PNG are accepted.');
      return;
    }
    onFileSelect(f);
    toast.success(`Selected file: ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Dropzone + Warning Note */}
        <div className="space-y-3 lg:col-span-8">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            disabled={disabled}
            onChange={handleInputChange}
            className="sr-only"
          />

          {file ? (
            /* Selected File Box */
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-[#00b14f]">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">{file.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
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
                  onClick={onFileRemove}
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
              onClick={() => !disabled && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-5 py-7 text-center transition ${
                disabled
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50/70 opacity-60'
                  : isDragOver
                    ? 'cursor-pointer border-[#00b14f] bg-emerald-50/40'
                    : 'cursor-pointer border-slate-300 bg-slate-50/30 hover:border-[#00b14f] hover:bg-emerald-50/20'
              }`}
            >
              <p className="text-xs font-bold text-slate-800">Choose or drag file here</p>
              <p className="text-[11px] text-slate-500">{acceptedFormatsText}</p>

              <button
                type="button"
                tabIndex={-1}
                disabled={disabled}
                className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-[#00b14f] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Choose file</span>
              </button>
            </div>
          )}

          {/* Warning Note Box */}
          <div className="rounded-lg border border-amber-200/90 bg-amber-50/60 p-3.5 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="space-y-1 text-[11px] leading-relaxed">
                {warningBullets.map((bullet, idx) => (
                  <p key={idx} className="flex items-start gap-1">
                    <span className="font-bold">•</span>
                    <span>{bullet}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Illustration Thumbnail (Minh họa - Static TopCV Style) */}
        <div className="flex flex-col items-center justify-start space-y-2 lg:col-span-4">
          <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Illustration</p>

          <div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white p-2 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={illustrationSrc} alt={illustrationAlt} className="h-36 w-auto max-w-[200px] object-contain" />
          </div>

          {illustrationCaption && <p className="text-center text-[10px] text-slate-500">{illustrationCaption}</p>}

          {actionButton && <div className="pt-1">{actionButton}</div>}
        </div>
      </div>
    </div>
  );
}

export function BusinessLicenseView() {
  const { profile, company, handleSubmitLicense } = useCompanyVerification();

  const isOwner = company?.myRole === 'OWNER';
  const isMember = company?.myRole === 'MEMBER';

  const [documentType, setDocumentType] = useState<BusinessDocumentType>(() => {
    if (isMember) return 'LETTER_OF_AUTHORIZATION';
    return profile.license.documentType || 'BUSINESS_LICENSE';
  });

  // Files state
  const [ercFile, setErcFile] = useState<File | null>(null);
  const [loaFile, setLoaFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const handleSave = async () => {
    if (!company) {
      toast.error('You must link or create a company profile first before submitting documents.');
      return;
    }

    if (documentType === 'BUSINESS_LICENSE') {
      if (!isOwner) {
        toast.error('Only the company OWNER can submit the Enterprise Registration Certificate (ERC).');
        return;
      }
      if (!ercFile && !profile.license.fileName) {
        toast.error('Please choose your Enterprise Registration Certificate file before saving.');
        return;
      }

      if (!ercFile) {
        toast.info('Your previously uploaded certificate is already under review or approved.');
        return;
      }

      setIsSubmitting(true);
      try {
        await handleSubmitLicense({
          documentType: 'BUSINESS_LICENSE',
          file: ercFile,
        });
        setErcFile(null);
      } catch (err) {
        if (isApiError(err)) {
          toast.error(err.message || 'Could not submit legal document.');
        } else {
          toast.error('Failed to submit document. Please check file format and try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LETTER_OF_AUTHORIZATION
      if (!loaFile && !profile.license.fileName) {
        toast.error('Please choose your Letter of Authorization (LOA) file before saving.');
        return;
      }

      if (!idCardFile) {
        toast.warning(
          'Please remember to also attach your Citizen ID Card (CCCD) so our compliance team can verify your identity.',
        );
      }

      const fileToSubmit = loaFile;
      if (!fileToSubmit) {
        toast.info('Your previously submitted authorization document is currently registered.');
        return;
      }

      setIsSubmitting(true);
      try {
        await handleSubmitLicense({
          documentType: 'LETTER_OF_AUTHORIZATION',
          file: fileToSubmit,
        });
        setLoaFile(null);
        setIdCardFile(null);
      } catch (err) {
        if (isApiError(err)) {
          toast.error(err.message || 'Could not submit authorization document.');
        } else {
          toast.error('Failed to submit authorization document. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const reviewStatus = profile.license.status;

  return (
    <AccountSettingsLayout activeTab="license" pageTitle="Business License & Authorization">
      <div className="space-y-6">
        {/* Status Callout Banner (TopCV Style) */}
        {reviewStatus === 'APPROVED' && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00b14f]" />
            <div className="space-y-1">
              <p className="text-xs font-bold sm:text-sm">Document Verified &amp; Approved</p>
              <p className="text-xs text-emerald-800">
                Your business legal document has been verified by the InterVue Compliance team. Enterprise job
                publishing privileges are active.
              </p>
              {profile.license.expiresAt && (
                <p className="text-[11px] font-semibold text-emerald-900">
                  Valid until: {new Date(profile.license.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {reviewStatus === 'PENDING_REVIEW' && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-amber-950">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="text-xs font-bold sm:text-sm">Awaiting Compliance Review</p>
              <p className="text-xs text-amber-800">
                Your uploaded document &ldquo;{profile.license.fileName}&rdquo; was received and is currently under
                review by our Trust &amp; Safety team (typically processed within 24 business hours).
              </p>
            </div>
          </div>
        )}

        {reviewStatus === 'REJECTED' && (
          <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/80 p-4 text-rose-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="space-y-1">
              <p className="text-xs font-bold sm:text-sm">Document Rejected</p>
              <p className="text-xs text-rose-800">
                Compliance feedback: &ldquo;
                {profile.license.reviewReason || 'The submitted document does not meet verification requirements.'}
                &rdquo;
              </p>
              <p className="text-xs font-semibold text-rose-900">
                Please review guidelines and upload a corrected document below.
              </p>
            </div>
          </div>
        )}

        {reviewStatus === 'MORE_INFO_REQUIRED' && (
          <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50/80 p-4 text-sky-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <div className="space-y-1">
              <p className="text-xs font-bold sm:text-sm">Additional Information Required</p>
              <p className="text-xs text-sky-800">Compliance notice: &ldquo;{profile.license.reviewReason}&rdquo;</p>
              <p className="text-xs font-semibold text-sky-900">Please upload supplementary documentation below.</p>
            </div>
          </div>
        )}

        {reviewStatus === 'EXPIRED' && (
          <div className="flex items-start gap-3 rounded-lg border border-slate-300 bg-slate-100 p-4 text-slate-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
            <div className="space-y-1">
              <p className="text-xs font-bold sm:text-sm">Authorization Expired</p>
              <p className="text-xs text-slate-600">
                Your previous Letter of Authorization has expired. Please submit a renewed authorization letter to
                restore verified recruitment privileges.
              </p>
            </div>
          </div>
        )}

        {/* Main Document Panel (TopCV Style) */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-800">Business Registration &amp; Authorization Details</h2>
            <p className="text-xs text-slate-600">
              Please select your preferred verification method, view upload guidelines{' '}
              <button
                type="button"
                onClick={() => setIsGuidelinesOpen(true)}
                className="font-semibold text-[#00b14f] hover:underline"
              >
                here
              </button>
            </p>
          </div>

          {/* Form with Radio Options (TopCV Structure) */}
          <div className="space-y-6">
            {/* OPTION 1: Enterprise Registration Certificate (ERC) */}
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-2.5 select-none ${
                  isMember ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                <input
                  type="radio"
                  name="verificationMethod"
                  value="BUSINESS_LICENSE"
                  disabled={isMember}
                  checked={documentType === 'BUSINESS_LICENSE'}
                  onChange={() => setDocumentType('BUSINESS_LICENSE')}
                  className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                />
                <span className="text-sm font-bold text-slate-900">
                  Enterprise Registration Certificate or equivalent (ERC)
                </span>
                {isMember && (
                  <span className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    <Lock className="h-3 w-3" /> Owner only
                  </span>
                )}
              </label>

              {documentType === 'BUSINESS_LICENSE' && (
                <div className="ml-6 space-y-4 rounded-lg border border-slate-200/90 bg-slate-50/20 p-5">
                  <DocumentDropzone
                    label="Certificate Document"
                    required
                    file={ercFile}
                    onFileSelect={setErcFile}
                    onFileRemove={() => setErcFile(null)}
                    disabled={isSubmitting || isMember}
                    warningBullets={[
                      'Uploaded documents must show all pages and have no signs of modification, covering, or cropping.',
                      'Please upload an Enterprise Registration Certificate whose information matches company data on the General Department of Taxation portal.',
                    ]}
                    illustrationSrc="/images/recruiter/illustration-erc.png"
                    illustrationAlt="Sample Enterprise Registration Certificate"
                    illustrationCaption="Sample 2-page ERC with official DPI red seal"
                  />
                </div>
              )}
            </div>

            {/* OPTION 2: Letter of Authorization & Identity Documents */}
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="LETTER_OF_AUTHORIZATION"
                  checked={documentType === 'LETTER_OF_AUTHORIZATION'}
                  onChange={() => setDocumentType('LETTER_OF_AUTHORIZATION')}
                  className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                />
                <span className="text-sm font-bold text-slate-900">
                  Letter of Authorization &amp; Identity Documents
                </span>
                {isMember && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Recommended for Recruiters
                  </span>
                )}
              </label>

              {documentType === 'LETTER_OF_AUTHORIZATION' && (
                <div className="ml-6 space-y-6 rounded-lg border border-slate-200/90 bg-slate-50/20 p-5">
                  {/* Sub-box 1: Letter of Authorization */}
                  <DocumentDropzone
                    label="Letter of Authorization"
                    required
                    file={loaFile}
                    onFileSelect={setLoaFile}
                    onFileRemove={() => setLoaFile(null)}
                    disabled={isSubmitting}
                    warningBullets={[
                      'Uploaded documents must show all pages and have no signs of modification, covering, or cropping.',
                      'Please upload an Authorization Letter with company information matching official enterprise data on the General Department of Taxation portal.',
                    ]}
                    illustrationSrc="/images/recruiter/illustration-loa.png"
                    illustrationAlt="Sample Letter of Authorization"
                    illustrationCaption="Official Letter of Authorization signed & stamped by Legal Representative"
                    actionButton={
                      <a
                        href="/templates/intervue-authorization-letter-template.docx"
                        download="intervue-authorization-letter-template.docx"
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#00b14f] bg-white px-3 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50 active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Authorization Template</span>
                      </a>
                    }
                  />

                  <div className="border-t border-slate-200/80 pt-5">
                    {/* Sub-box 2: Identity Document (CCCD / Passport) */}
                    <DocumentDropzone
                      label="Identity Document (Citizen ID / Passport)"
                      required
                      file={idCardFile}
                      onFileSelect={setIdCardFile}
                      onFileRemove={() => setIdCardFile(null)}
                      disabled={isSubmitting}
                      warningBullets={[
                        'Uploaded documents must show both front and back of your Citizen Identity Card (CCCD) or Passport photo page.',
                        'The full name and ID number must strictly match the authorized person specified in the Letter of Authorization above.',
                      ]}
                      illustrationSrc="/images/recruiter/illustration-id-card.png"
                      illustrationAlt="Sample Citizen Identity Card"
                      illustrationCaption="Front and Back of Chip-based Citizen Identity Card (CCCD)"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer: Save Button (TopCV Style) */}
          <div className="flex items-center justify-end border-t border-slate-200/80 pt-5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-[#00b14f] px-7 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#009b45] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Floating / Sticky Bottom Navigation: Next Step (TopCV Style) */}
        <div className="fixed right-6 bottom-4 z-40">
          <Link
            href={ROUTES.RECRUITER_COMPANY_PHONE_VERIFY}
            className="flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xs transition hover:scale-102 hover:bg-slate-900"
          >
            <span>Next: Phone Verification</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b14f] text-white">
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* Guidelines Modal */}
      {isGuidelinesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#00b14f]" />
                <h3 className="text-base font-bold text-slate-900">Legal Document Upload Guidelines</h3>
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
                <h4 className="font-bold text-slate-800">1. Enterprise Registration Certificate (ERC / Giấy ĐKKD)</h4>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                  <li>Applicable to enterprise founders and legal representatives.</li>
                  <li>
                    Document must display all pages, all 4 corners visible, and clear red seal of the Department of
                    Planning &amp; Investment.
                  </li>
                  <li>
                    Company Name, Tax Code, and Headquarter Address must match the National Business Registration
                    Portal.
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="font-bold text-slate-800">2. Letter of Authorization (LOA) &amp; Identity Document</h4>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                  <li>Applicable to authorized HR specialists, team leads, or recruiters.</li>
                  <li>Download and complete the official InterVue Letter of Authorization template.</li>
                  <li>
                    Must be signed by the Legal Representative or authorized director with the enterprise legal round
                    seal.
                  </li>
                  <li>
                    Must attach clear photos/scans of both the front and back of the authorized person&apos;s Citizen ID
                    Card (CCCD).
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-amber-900">
                <h4 className="font-bold text-amber-950">3. Common Rejection Reasons to Avoid</h4>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-800">
                  <li>Cropped edges, obscured text, blurry photos, or photocopies without notarization stamp.</li>
                  <li>Expired Citizen ID Card or expired authorization validity.</li>
                  <li>Mismatched Tax Code or mismatched authorized representative name.</li>
                </ul>
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

export default BusinessLicenseView;

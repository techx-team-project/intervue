'use client';

import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import type { BusinessDocumentResource, BusinessDocumentType } from '@/types/recruiter-company';
import { formatDate } from '@/utils/datetime';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileText,
  HelpCircle,
  History,
  RotateCw,
  ShieldCheck,
  UploadCloud,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from '../AccountSettingsLayout';

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
              <p className="text-xs text-slate-500">Local Document Preview (Before Submission)</p>
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
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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
/*                       2. SERVER DOCUMENT PREVIEW MODAL                     */
/* -------------------------------------------------------------------------- */

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: number;
  fileName: string;
  target?: 'main' | 'identity' | 'identity-back';
}

function DocumentPreviewModal({ isOpen, onClose, documentId, fileName, target = 'main' }: DocumentPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blobType, setBlobType] = useState<'image' | 'pdf' | 'unknown'>('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;

    const fetcher =
      target === 'identity-back'
        ? recruiterCompanyApi.viewIdentityBackBlob(documentId)
        : target === 'identity'
          ? recruiterCompanyApi.viewIdentityBlob(documentId)
          : recruiterCompanyApi.viewDocumentBlob(documentId);

    fetcher
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
        const type = blob.type.toLowerCase();
        if (type.includes('pdf')) setBlobType('pdf');
        else if (type.includes('image')) setBlobType('image');
        else setBlobType('unknown');
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setBlobUrl(null);
        setBlobType('unknown');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [documentId, target]);

  if (!isOpen) return null;

  const targetLabel =
    target === 'identity-back'
      ? 'Citizen ID Card (Back Side / Mặt sau)'
      : target === 'identity'
        ? 'Citizen ID Card (Front Side / Mặt trước)'
        : 'Legal Verification Document';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{fileName}</h3>
              <p className="text-xs text-slate-500">{targetLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {blobType === 'image' && (
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
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="relative flex min-h-[460px] flex-1 items-center justify-center overflow-auto bg-slate-100/80 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-500">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <span>Loading document stream...</span>
            </div>
          ) : blobUrl ? (
            blobType === 'pdf' ? (
              <iframe
                src={blobUrl}
                title={fileName}
                className="h-full min-h-[500px] w-full rounded-xl border-0 shadow-xs"
              />
            ) : blobType === 'image' ? (
              <div className="flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blobUrl}
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
                <p>This document cannot be previewed directly.</p>
                <a
                  href={blobUrl}
                  download={fileName}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#00b14f] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Download file
                </a>
              </div>
            )
          ) : (
            <p className="text-xs text-slate-500">Failed to load preview for this file.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                  3. LOA PREPARATION GUIDE MODAL                            */
/* -------------------------------------------------------------------------- */

interface LoaPreparationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LoaPreparationGuideModal({ isOpen, onClose }: LoaPreparationGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-[#00b14f]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">How to Prepare Letter of Authorization (LOA)</h3>
              <p className="text-xs text-slate-500">Standard 3-step legal onboarding procedure for InterVue</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto p-6 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-2xs">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">Download Template &amp; Fill Information</h4>
              <p className="text-xs text-slate-600">
                Download the official InterVue Letter of Authorization template (`.docx`). Fill in full enterprise
                details (Company Name, Tax Code, Headquarter Address) and the authorized recruiter&apos;s personal
                information in Microsoft Word.
              </p>
              <div className="pt-1.5">
                <a
                  href="/templates/intervue-authorization-letter-template.docx"
                  download="intervue-authorization-letter-template.docx"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#00b14f] bg-white px-3 py-1.5 text-xs font-bold text-[#00b14f] shadow-2xs hover:bg-emerald-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Template (.docx)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-2xs">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">Sign &amp; Apply Official Enterprise Red Seal</h4>
              <p className="text-xs text-slate-600">
                <strong>Print out the document on paper.</strong> The company Legal Representative (Director / CEO) must
                sign with full name, and the enterprise must stamp its official legal round red seal (dấu tròn pháp nhân
                mộc đỏ) across the signature.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-2xs">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">Scan &amp; Upload with Citizen ID (CCCD) Both Sides</h4>
              <p className="text-xs text-slate-600">
                Scan or photograph the stamped Letter of Authorization clearly as a PDF or high-resolution image (JPG,
                PNG). Also attach clear photos of <strong>both Front and Back sides</strong> of the authorized
                recruiter&apos;s Citizen Identity Card (CCCD) or Passport.
              </p>
            </div>
          </div>

          {/* Warning / Tips */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
            <h4 className="font-bold text-amber-950">Important Legal Compliance Rules:</h4>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-amber-800">
              <li>
                Do not upload unsigned or unsealed draft files (`.docx` files are not accepted for legal validation).
              </li>
              <li>
                The authorized person&apos;s full name and ID number must strictly match the attached Citizen ID Card
                (CCCD).
              </li>
              <li>Photos must be sharp, with all 4 corners visible, without glare, shadows, or cropped edges.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#00b14f] px-5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#009b45]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          4. DOCUMENT DROPZONE COMPONENT                    */
/* -------------------------------------------------------------------------- */

interface DocumentDropzoneProps {
  label: string;
  required?: boolean;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
  acceptedFormatsText?: string;
  warningBullets?: string[];
  illustrationSrc?: string;
  illustrationAlt?: string;
  illustrationCaption?: string;
  actionButton?: React.ReactNode;
  compact?: boolean;
}

function DocumentDropzone({
  label,
  required = true,
  file,
  onFileSelect,
  onFileRemove,
  disabled = false,
  acceptedFormatsText = 'Max 5MB (PDF, JPG, JPEG, PNG)',
  warningBullets,
  illustrationSrc,
  illustrationAlt,
  illustrationCaption,
  actionButton,
  compact = false,
}: DocumentDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Local preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLocalPreviewOpen, setIsLocalPreviewOpen] = useState(false);

  const ext = file?.name.split('.').pop()?.toLowerCase() || '';
  const isImage = Boolean(file && (file.type.startsWith('image/') || ['png', 'jpg', 'jpeg'].includes(ext)));
  const isPdf = Boolean(file && (file.type === 'application/pdf' || ext === 'pdf'));

  useEffect(() => {
    if (!file) return;

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled && typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    return () => {
      cancelled = true;
    };
  }, [file]);

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
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className={compact ? 'space-y-2' : 'grid grid-cols-1 gap-6 lg:grid-cols-12'}>
        {/* Left Column: Dropzone + Warning Note */}
        <div className={compact ? 'space-y-2' : 'space-y-3 lg:col-span-8'}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            disabled={disabled}
            onChange={handleInputChange}
            className="sr-only"
          />

          {file ? (
            /* Selected File Box with Image Thumbnail & Zoom */
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 transition">
              <div className="flex min-w-0 items-center gap-3">
                {/* Thumbnail / File Icon */}
                {isImage && previewUrl ? (
                  <div
                    onClick={() => setIsLocalPreviewOpen(true)}
                    className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-emerald-300 bg-white shadow-2xs"
                    title="Click to preview full image"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 opacity-0 transition group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
                    {isPdf ? <FileText className="h-6 w-6 text-rose-500" /> : <FileCheck2 className="h-6 w-6" />}
                  </div>
                )}

                {/* File Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-bold text-slate-900">{file.name}</p>
                    {isPdf && (
                      <span className="py-0.2 rounded bg-rose-100 px-1.5 text-[9px] font-bold text-rose-700">PDF</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex shrink-0 items-center gap-2">
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => setIsLocalPreviewOpen(true)}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-bold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50 active:scale-95"
                    title="Preview uploaded document"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Empty Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !disabled && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-center transition ${
                compact ? 'px-4 py-5' : 'px-5 py-7'
              } ${
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
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-[#00b14f] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Choose file</span>
              </button>
            </div>
          )}

          {/* Warning Note Box */}
          {warningBullets && warningBullets.length > 0 && (
            <div className="rounded-xl border border-amber-200/90 bg-amber-50/60 p-3 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div className="space-y-0.5 text-[11px] leading-relaxed">
                  {warningBullets.map((bullet, idx) => (
                    <p key={idx} className="flex items-start gap-1">
                      <span className="font-bold">•</span>
                      <span>{bullet}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Illustration Thumbnail */}
        {!compact && illustrationSrc && (
          <div className="flex flex-col items-center justify-start space-y-2 lg:col-span-4">
            <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Illustration (Minh họa)</p>

            <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white p-2 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={illustrationSrc}
                alt={illustrationAlt || ''}
                className="h-36 w-auto max-w-[200px] object-contain"
              />
            </div>

            {illustrationCaption && <p className="text-center text-[10px] text-slate-500">{illustrationCaption}</p>}

            {actionButton && <div className="pt-1">{actionButton}</div>}
          </div>
        )}
      </div>

      {/* Local Preview Modal */}
      {isLocalPreviewOpen && previewUrl && (
        <LocalFilePreviewModal
          isOpen={isLocalPreviewOpen}
          onClose={() => setIsLocalPreviewOpen(false)}
          fileUrl={previewUrl}
          fileName={file?.name || 'Uploaded_Document'}
          isImage={isImage}
          isPdf={isPdf}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*             5. UNIFIED VERIFICATION STATUS TRACKER & TIMELINE              */
/* -------------------------------------------------------------------------- */

interface UnifiedVerificationStatusTrackerProps {
  status: string;
  fileName?: string;
  submittedAt?: string;
  verifiedAt?: string;
  expiresAt?: string;
  reviewReason?: string;
  documentId?: number;
  hasIdentity?: boolean;
  hasIdentityBack?: boolean;
  identityFileName?: string;
  identityBackFileName?: string;
  documents: BusinessDocumentResource[];
  showOverrideForm: boolean;
  onToggleOverride: () => void;
  onPreview: (docId: number, fileName: string, target?: 'main' | 'identity' | 'identity-back') => void;
}

function formatDocSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function UnifiedVerificationStatusTracker({
  status,
  fileName,
  submittedAt,
  verifiedAt,
  expiresAt,
  reviewReason,
  documentId,
  hasIdentity,
  hasIdentityBack,
  identityFileName,
  identityBackFileName,
  documents,
  showOverrideForm,
  onToggleOverride,
  onPreview,
}: UnifiedVerificationStatusTrackerProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const isPending = status === 'PENDING_REVIEW';
  const isApproved = status === 'APPROVED';
  const isRevoked = status === 'REVOKED';
  const isRejected = status === 'REJECTED';
  const isMoreInfo = status === 'MORE_INFO_REQUIRED';

  const latestDoc = documents.find((d) => d.submittedByMe) || documents[0];
  const effectiveFileName = fileName || latestDoc?.originalFileName || 'Legal_Document.pdf';
  const effectiveDocId = documentId || latestDoc?.id;
  const effectiveSubmittedAt = submittedAt || latestDoc?.submittedAt;
  const effectiveReviewedAt = verifiedAt || latestDoc?.reviewedAt;
  const effectiveReason = reviewReason || latestDoc?.reviewReason;
  const isLoa =
    latestDoc?.documentType === 'LETTER_OF_AUTHORIZATION' ||
    effectiveFileName.toLowerCase().includes('loa') ||
    hasIdentity ||
    hasIdentityBack;

  return (
    <div className="rounded-md border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9">
      {/* 1. Header Row */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
              isApproved
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-600'
                : isPending
                  ? 'border border-amber-200 bg-amber-50 text-amber-600'
                  : isMoreInfo
                    ? 'border border-sky-200 bg-sky-50 text-sky-600'
                    : 'border border-rose-200 bg-rose-50 text-rose-600'
            }`}
          >
            {isApproved ? (
              <ShieldCheck className="h-6 w-6" />
            ) : isPending ? (
              <Clock className="h-6 w-6" />
            ) : isMoreInfo ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {isApproved
                  ? 'Verification Approved & Active'
                  : isPending
                    ? 'Awaiting Compliance Review'
                    : isRevoked
                      ? 'Business Verification Revoked'
                      : isRejected
                        ? 'Verification Dossier Rejected'
                        : 'Supplementary Information Required'}
              </h3>
            </div>

            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-[13px]">
              {isApproved &&
                'Your company legal documents have been verified and approved by the InterVue Compliance Team.'}
              {isPending &&
                'Your verification dossier has been submitted and is currently being evaluated by compliance officers.'}
              {isRevoked &&
                'Company verification credentials have been revoked. Please inspect the compliance remarks and resubmit below.'}
              {isRejected &&
                'Your submission did not meet verification standards. Please review the officer feedback and upload corrected documents.'}
              {isMoreInfo &&
                'Additional supporting documentation is required. Please follow the compliance instructions and update your submission.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:pt-0.5">
          {effectiveDocId && (
            <button
              type="button"
              onClick={() => onPreview(effectiveDocId, effectiveFileName, 'main')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#00b14f] hover:text-[#00b14f] active:scale-95"
            >
              <Eye className="h-3.5 w-3.5 text-[#00b14f]" />
              <span>View Submitted Dossier</span>
            </button>
          )}

          {isApproved && (
            <button
              type="button"
              onClick={onToggleOverride}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
            >
              {showOverrideForm ? 'Close Form' : 'Request Renewal'}
            </button>
          )}

          {documents.length > 1 && (
            <button
              type="button"
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
            >
              <History className="h-3.5 w-3.5 text-slate-400" />
              <span>History ({documents.length})</span>
              {isHistoryExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* 2. Vertical Connected Timeline */}
      <div className="mt-8 pt-2">
        <div className="relative pl-8 sm:pl-10">
          {/* Vertical Connecting Line */}
          <div className="absolute top-4 bottom-8 left-[15px] w-0.5 bg-slate-200 sm:left-[19px]" />

          {/* STEP 1: Dossier Submitted */}
          <div className="relative pb-10">
            {/* Step Node */}
            <div className="absolute top-0 -left-8 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs ring-4 ring-white sm:-left-10 sm:h-9 sm:w-9">
              <Check className="h-4.5 w-4.5" />
            </div>

            {/* Step Content */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 sm:text-base">1. Dossier Submitted</h4>
                <span className="text-xs font-medium text-slate-500">
                  {effectiveSubmittedAt ? `Recorded on ${formatDate(effectiveSubmittedAt)}` : 'Recorded'}
                </span>
              </div>

              {/* Submitted File Detail Box */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-600 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200/80 bg-emerald-50 text-[#00b14f]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{effectiveFileName}</p>
                      <p className="text-xs text-slate-500">
                        {isLoa ? 'Official Letter of Authorization (LOA)' : 'Enterprise Registration Certificate (ERC)'}
                      </p>
                    </div>
                  </div>

                  {effectiveDocId && (
                    <button
                      type="button"
                      onClick={() => onPreview(effectiveDocId, effectiveFileName, 'main')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00b14f] hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" /> View file
                    </button>
                  )}
                </div>

                {/* Attached CCCD if present */}
                {(hasIdentity || hasIdentityBack) && effectiveDocId && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-3">
                    <span className="text-xs font-semibold text-slate-700">Attached Identity Cards:</span>
                    {hasIdentity && (
                      <button
                        type="button"
                        onClick={() => onPreview(effectiveDocId, identityFileName || 'CCCD_Front.png', 'identity')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-[#00b14f] hover:text-[#00b14f]"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#00b14f]" /> Front Side ({identityFileName || 'Attached'})
                      </button>
                    )}
                    {hasIdentityBack && (
                      <button
                        type="button"
                        onClick={() =>
                          onPreview(effectiveDocId, identityBackFileName || 'CCCD_Back.png', 'identity-back')
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-[#00b14f] hover:text-[#00b14f]"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#00b14f]" /> Back Side ({identityBackFileName || 'Attached'})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: Compliance Legal Review */}
          <div className="relative pb-10">
            {/* Step Node */}
            <div
              className={`absolute top-0 -left-8 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs ring-4 ring-white sm:-left-10 sm:h-9 sm:w-9 ${
                isApproved ? 'bg-emerald-500' : isPending ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-emerald-500'
              }`}
            >
              {isApproved || !isPending ? <Check className="h-4.5 w-4.5" /> : <Clock className="h-4.5 w-4.5" />}
            </div>

            {/* Step Content */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h4 className="text-sm font-bold text-slate-900 sm:text-base">2. Compliance Legal Review</h4>
                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <Check className="h-3 w-3 text-emerald-600" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Review Process Box */}
              <div
                className={`rounded-xl border p-4 text-xs leading-relaxed shadow-2xs sm:p-5 sm:text-[13px] ${
                  isPending
                    ? 'border-amber-200/90 bg-amber-50/30 text-amber-950'
                    : 'border-slate-200/80 bg-white text-slate-600'
                }`}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Reviewing Entity
                    </span>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      InterVue Trust &amp; Safety Compliance Team
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Estimated Turnaround (SLA)
                    </span>
                    <p className="mt-1 text-sm font-semibold text-slate-900">Within 24 business hours</p>
                  </div>
                </div>

                <p className="mt-3.5 border-t border-slate-200/70 pt-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  {isPending
                    ? 'Compliance officers are cross-referencing tax registration, legal representative authorization, and official company seals against the National Business Registration Portal.'
                    : 'Corporate background checks and legal dossier validations have concluded successfully.'}
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3: Final Decision & Privileges Activation */}
          <div className="relative">
            {/* Step Node */}
            <div
              className={`absolute top-0 -left-8 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs ring-4 ring-white sm:-left-10 sm:h-9 sm:w-9 ${
                isApproved
                  ? 'bg-emerald-500'
                  : isPending
                    ? 'border-2 border-slate-300 bg-white text-slate-400'
                    : isMoreInfo
                      ? 'bg-sky-500'
                      : 'bg-rose-500'
              }`}
            >
              {isApproved ? (
                <Check className="h-4.5 w-4.5" />
              ) : isPending ? (
                <span className="text-xs font-bold text-slate-400">3</span>
              ) : (
                <AlertCircle className="h-4.5 w-4.5" />
              )}
            </div>

            {/* Step Content */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                    3. Verification Result &amp; Privileges Activation
                  </h4>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <Check className="h-3 w-3 text-emerald-600" />
                      Approved
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      Pending
                    </span>
                  ) : isRevoked ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
                      Revoked
                    </span>
                  ) : isRejected ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
                      Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
                      Action Required
                    </span>
                  )}
                </div>
              </div>

              {/* Result Outcome Box */}
              {isPending && (
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs leading-relaxed text-slate-600 shadow-2xs sm:p-5 sm:text-[13px]">
                  <p className="font-semibold text-slate-900">Platform privileges activated upon approval:</p>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs text-slate-600 sm:text-[13px]">
                    <li>
                      High-trust <strong>Verified Employer Badge (Level 2/3)</strong> awarded to your company profile.
                    </li>
                    <li>
                      Full recruitment privileges: publish unlimited job postings and directly contact candidates.
                    </li>
                    <li>
                      Automated email and in-app notifications dispatched immediately once the decision is finalized.
                    </li>
                  </ul>
                </div>
              )}

              {isApproved && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-950 shadow-2xs sm:p-5">
                  <p className="text-sm font-bold text-emerald-900">Company legal credentials verified successfully!</p>
                  <p className="mt-1 text-xs text-emerald-800 sm:text-[13px]">
                    Your account is granted full recruitment and job publishing privileges across the platform.
                  </p>
                  {expiresAt && (
                    <p className="mt-2 text-xs font-semibold text-emerald-900">
                      Valid through: {formatDate(expiresAt)}
                    </p>
                  )}
                </div>
              )}

              {(isRevoked || isRejected || isMoreInfo) && (
                <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs text-rose-950 shadow-2xs sm:p-5 sm:text-[13px]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-rose-900">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      Compliance Officer Remarks
                    </span>
                    {effectiveReviewedAt && (
                      <span className="text-xs font-normal text-slate-500">{formatDate(effectiveReviewedAt)}</span>
                    )}
                  </div>
                  <div className="rounded-lg border border-rose-200/80 bg-white p-3.5 text-xs leading-relaxed text-rose-900 italic sm:text-[13px]">
                    &ldquo;
                    {effectiveReason ||
                      'Documentation does not meet compliance standards. Please review guidance and resubmit.'}
                    &rdquo;
                  </div>
                  <p className="text-xs text-rose-800">
                    Please review the feedback above, prepare corrected copies, and submit using the form below.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Expandable Past Submission History Section */}
      {isHistoryExpanded && documents.length > 1 && (
        <div className="mt-8 space-y-4 border-t border-slate-200/80 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Past Submission History &amp; Audit Trail</h4>
                <p className="text-xs text-slate-500">
                  Record of {documents.length - 1} previous verification{' '}
                  {documents.length - 1 === 1 ? 'dossier' : 'dossiers'} evaluated by compliance officers
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {documents.slice(1).map((doc) => {
              const isDocLoa =
                doc.documentType === 'LETTER_OF_AUTHORIZATION' ||
                doc.originalFileName.toLowerCase().includes('loa') ||
                Boolean(doc.identityFileName) ||
                Boolean(doc.identityBackFileName);

              const statusLabel =
                doc.reviewStatus === 'APPROVED'
                  ? 'Approved'
                  : doc.reviewStatus === 'PENDING_REVIEW'
                    ? 'Pending Review'
                    : doc.reviewStatus === 'REVOKED'
                      ? 'Revoked'
                      : doc.reviewStatus === 'REJECTED'
                        ? 'Rejected'
                        : doc.reviewStatus === 'MORE_INFO_REQUIRED'
                          ? 'More Info Required'
                          : doc.reviewStatus;

              const badgeClass =
                doc.reviewStatus === 'APPROVED'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : doc.reviewStatus === 'PENDING_REVIEW'
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : doc.reviewStatus === 'MORE_INFO_REQUIRED'
                      ? 'border-sky-200 bg-sky-50 text-sky-800'
                      : 'border-rose-200 bg-rose-50 text-rose-800';

              return (
                <div
                  key={doc.id}
                  className="space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                          doc.reviewStatus === 'APPROVED'
                            ? 'border-emerald-200 bg-emerald-50 text-[#00b14f]'
                            : doc.reviewStatus === 'REVOKED' || doc.reviewStatus === 'REJECTED'
                              ? 'border-rose-200 bg-rose-50 text-rose-600'
                              : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {isDocLoa
                              ? 'Letter of Authorization & Identity Dossier'
                              : 'Enterprise Registration Certificate (ERC)'}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{doc.originalFileName}</span>
                          {doc.fileSizeBytes ? ` • ${formatDocSize(doc.fileSizeBytes)}` : ''}
                          {doc.submittedAt ? ` • Submitted on ${formatDate(doc.submittedAt)}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreview(doc.id, doc.originalFileName, 'main')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#00b14f] hover:text-[#00b14f] active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#00b14f]" />
                        <span>View Dossier</span>
                      </button>
                    </div>
                  </div>

                  {/* Attached CCCD chips for past doc */}
                  {(doc.identityFileName || doc.identityBackFileName) && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5 text-xs">
                      <span className="text-[11px] font-semibold text-slate-600">Attached ID Cards:</span>
                      {doc.identityFileName && (
                        <button
                          type="button"
                          onClick={() => onPreview(doc.id, doc.identityFileName || 'CCCD_Front.png', 'identity')}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-[#00b14f] hover:text-[#00b14f]"
                        >
                          <Eye className="h-3 w-3 text-[#00b14f]" /> Front Side
                        </button>
                      )}
                      {doc.identityBackFileName && (
                        <button
                          type="button"
                          onClick={() =>
                            onPreview(doc.id, doc.identityBackFileName || 'CCCD_Back.png', 'identity-back')
                          }
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-[#00b14f] hover:text-[#00b14f]"
                        >
                          <Eye className="h-3 w-3 text-[#00b14f]" /> Back Side
                        </button>
                      )}
                    </div>
                  )}

                  {/* Compliance feedback callout note */}
                  {doc.reviewReason && (
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 text-xs leading-relaxed">
                      <div className="mb-1 flex items-center justify-between font-semibold text-slate-700">
                        <span className="flex items-center gap-1 text-[11px] tracking-wider text-slate-600 uppercase">
                          <AlertCircle className="h-3 w-3 text-rose-500" /> Compliance Officer Feedback
                        </span>
                        {doc.reviewedAt && (
                          <span className="text-[11px] font-normal text-slate-400">
                            Evaluated on {formatDate(doc.reviewedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-800 italic">&ldquo;{doc.reviewReason}&rdquo;</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         6. MAIN BUSINESS LICENSE VIEW                      */
/* -------------------------------------------------------------------------- */

export function BusinessLicenseView() {
  const { profile, company, documents, handleSubmitLicense } = useCompanyVerification();

  const [documentType, setDocumentType] = useState<BusinessDocumentType>(() => {
    return profile.license.documentType || 'BUSINESS_LICENSE';
  });

  // Files state
  const [ercFile, setErcFile] = useState<File | null>(null);
  const [loaFile, setLoaFile] = useState<File | null>(null);
  const [idCardFrontFile, setIdCardFrontFile] = useState<File | null>(null);
  const [idCardBackFile, setIdCardBackFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isLoaGuideOpen, setIsLoaGuideOpen] = useState(false);
  const [showOverrideForm, setShowOverrideForm] = useState(false);

  // Server Preview Modal state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    documentId: number;
    fileName: string;
    target: 'main' | 'identity' | 'identity-back';
  }>({
    isOpen: false,
    documentId: 0,
    fileName: '',
    target: 'main',
  });

  const openPreview = (docId: number, fileName: string, target: 'main' | 'identity' | 'identity-back' = 'main') => {
    setPreviewModal({
      isOpen: true,
      documentId: docId,
      fileName,
      target,
    });
  };

  const handleSave = async () => {
    if (!company) {
      toast.error('You must link or create a company profile first before submitting documents.');
      return;
    }

    if (documentType === 'BUSINESS_LICENSE') {
      if (!ercFile) {
        toast.error('Please choose your Enterprise Registration Certificate file before saving.');
        return;
      }

      setIsSubmitting(true);
      try {
        await handleSubmitLicense({
          documentType: 'BUSINESS_LICENSE',
          file: ercFile,
        });
        setErcFile(null);
        setShowOverrideForm(false);
      } catch (err) {
        if (isApiError(err)) {
          toast.error(err.message || 'Could not submit business license.');
        } else {
          toast.error('Failed to submit business license. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LETTER_OF_AUTHORIZATION
      if (!loaFile) {
        toast.error('Please choose your Letter of Authorization (LOA) file before saving.');
        return;
      }

      if (!idCardFrontFile) {
        toast.error('Please attach the FRONT side of your Citizen Identity Card (CCCD) or Passport photo page.');
        return;
      }

      if (!idCardBackFile) {
        toast.warning(
          'Tip: If using a Vietnamese Citizen ID (CCCD), please also attach the BACK side for faster verification.',
        );
      }

      setIsSubmitting(true);
      try {
        await handleSubmitLicense({
          documentType: 'LETTER_OF_AUTHORIZATION',
          file: loaFile,
          identityFile: idCardFrontFile,
          identityBackFile: idCardBackFile,
        });
        setLoaFile(null);
        setIdCardFrontFile(null);
        setIdCardBackFile(null);
        setShowOverrideForm(false);
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
  const hasExistingStatus = reviewStatus && reviewStatus !== 'NOT_SUBMITTED';
  const isPendingReview = reviewStatus === 'PENDING_REVIEW';
  const isApproved = reviewStatus === 'APPROVED';

  // Toggle whether upload form should be shown:
  // - Show if not pending and not approved
  // - Or if user manually toggles "Submit Renewal" when approved
  // - Or if rejected / revoked / more info
  const shouldShowUploadForm = (!isPendingReview && !isApproved) || showOverrideForm;

  return (
    <AccountSettingsLayout activeTab="license" pageTitle="Business License & Authorization">
      <div className="space-y-6">
        {/* ---------------- 1. UNIFIED TOP STATUS TRACKER & TIMELINE ---------------- */}
        {hasExistingStatus && (
          <UnifiedVerificationStatusTracker
            status={reviewStatus}
            fileName={profile.license.fileName}
            submittedAt={profile.license.submittedAt}
            verifiedAt={profile.license.reviewedAt}
            expiresAt={profile.license.expiresAt}
            reviewReason={profile.license.reviewReason}
            documentId={profile.license.documentId}
            hasIdentity={profile.license.hasIdentity}
            hasIdentityBack={profile.license.hasIdentityBack}
            identityFileName={profile.license.identityFileName}
            identityBackFileName={profile.license.identityBackFileName}
            documents={documents}
            showOverrideForm={showOverrideForm}
            onToggleOverride={() => setShowOverrideForm(!showOverrideForm)}
            onPreview={openPreview}
          />
        )}

        {/* ---------------- 2. MAIN UPLOAD FORM PANEL ---------------- */}
        {shouldShowUploadForm && (
          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            {/* Section Header */}
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">
                  {showOverrideForm
                    ? 'Submit Replacement Legal Document'
                    : 'Business Registration & Authorization Details'}
                </h2>
                <div className="flex items-center gap-3">
                  {/* <button
                    type="button"
                    onClick={() => setIsLoaGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#00b14f] hover:underline"
                  >
                    <HelpCircle className="h-3.5 w-3.5" /> LOA Preparation Guideee
                  </button>
                  <span className="text-slate-300">•</span> */}
                  <button
                    type="button"
                    onClick={() => setIsGuidelinesOpen(true)}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#00b14f] hover:underline"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    General Guidelines
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Please select your verification method and attach official scanned documents with authentic seal.
              </p>
            </div>

            {/* Method Selectors (TopCV Radio Options) */}
            <div className="mt-6 space-y-6">
              {/* OPTION 1: Enterprise Registration Certificate (ERC) */}
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-2.5 select-none">
                  <input
                    type="radio"
                    name="verificationMethod"
                    value="BUSINESS_LICENSE"
                    checked={documentType === 'BUSINESS_LICENSE'}
                    onChange={() => setDocumentType('BUSINESS_LICENSE')}
                    className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    Enterprise Registration Certificate or equivalent (ERC)
                  </span>
                </label>

                {documentType === 'BUSINESS_LICENSE' && (
                  <div className="ml-6 space-y-4 rounded-xl border border-slate-200/90 bg-slate-50/30 p-5">
                    <DocumentDropzone
                      label="Certificate Document"
                      required
                      file={ercFile}
                      onFileSelect={setErcFile}
                      onFileRemove={() => setErcFile(null)}
                      disabled={isSubmitting}
                      warningBullets={[
                        'Uploaded documents must show all pages and have no signs of modification, covering, or cropping.',
                        'Please upload an Enterprise Registration Certificate whose information matches company data on the General Department of Taxation portal.',
                        'Only official PDF or high-resolution photos (JPG, PNG) with the red DPI seal are accepted.',
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
                </label>

                {documentType === 'LETTER_OF_AUTHORIZATION' && (
                  <div className="ml-6 space-y-6 rounded-xl border border-slate-200/90 bg-slate-50/30 p-5">
                    {/* Sub-box 1: Letter of Authorization (LOA) */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          1. Official Letter of Authorization (Bản scan Giấy ủy quyền có mộc đỏ){' '}
                          <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsLoaGuideOpen(true)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#00b14f] hover:underline"
                        >
                          <HelpCircle className="h-3.5 w-3.5" /> How to prepare Letter of Authorization?
                        </button>
                      </div>

                      <DocumentDropzone
                        label=""
                        required
                        file={loaFile}
                        onFileSelect={setLoaFile}
                        onFileRemove={() => setLoaFile(null)}
                        disabled={isSubmitting}
                        warningBullets={[
                          'Must be signed by the enterprise Legal Representative and stamped with the official company round seal.',
                          'The authorized person name and citizen ID must strictly match the ID card attached below.',
                        ]}
                        illustrationSrc="/images/recruiter/illustration-loa.png"
                        illustrationAlt="Sample Letter of Authorization"
                        illustrationCaption="Official Letter of Authorization signed & stamped by Legal Representative"
                        actionButton={
                          <a
                            href="/templates/intervue-authorization-letter-template.docx"
                            download="intervue-authorization-letter-template.docx"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#00b14f] bg-white px-3 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50 active:scale-95"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download Template (.docx)</span>
                          </a>
                        }
                      />
                    </div>

                    {/* Sub-box 2: Identity Documents (Citizen ID / CCCD 2 mặt) with CCCD Illustration */}
                    <div className="border-t border-slate-200/80 pt-5">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left Column (8 cols): Vertically stacked Front side & Back side slots */}
                        <div className="space-y-4 lg:col-span-8">
                          <div>
                            <label className="block text-xs font-bold text-slate-800">
                              2. Identity Documents (Citizen ID / CCCD / Passport){' '}
                              <span className="text-rose-500">*</span>
                            </label>
                            <p className="text-xs text-slate-500">
                              Please attach clear, uncropped photos of both the front and back of your Citizen Identity
                              Card (CCCD) or Passport.
                            </p>
                          </div>

                          {/* Front Side Slot */}
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <DocumentDropzone
                              label="CCCD Mặt trước (Front Side) / Passport Photo Page"
                              required
                              compact
                              file={idCardFrontFile}
                              onFileSelect={setIdCardFrontFile}
                              onFileRemove={() => setIdCardFrontFile(null)}
                              disabled={isSubmitting}
                              acceptedFormatsText="Photo page showing portrait, full name & ID number"
                              warningBullets={[
                                'Must be clear, all 4 corners visible, no glare or shadows covering information.',
                              ]}
                            />
                          </div>

                          {/* Back Side Slot */}
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <DocumentDropzone
                              label="CCCD Mặt sau (Back Side)"
                              required={false}
                              compact
                              file={idCardBackFile}
                              onFileSelect={setIdCardBackFile}
                              onFileRemove={() => setIdCardBackFile(null)}
                              disabled={isSubmitting}
                              acceptedFormatsText="Back side with chip & issuance date (optional for Passport)"
                              warningBullets={[
                                'Must show electronic chip, barcode/fingerprints, and police authority seal.',
                              ]}
                            />
                          </div>
                        </div>

                        {/* Right Column (4 cols): Illustration of CCCD */}
                        <div className="flex flex-col items-center justify-start space-y-2 pt-6 lg:col-span-4">
                          <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                            Illustration (Minh họa)
                          </p>
                          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/recruiter/illustration-id-card.png"
                              alt="Sample Front & Back Vietnamese Citizen ID (CCCD)"
                              className="h-44 w-auto max-w-[210px] object-contain"
                            />
                          </div>
                          <p className="text-center text-[10px] text-slate-500">
                            Sample Front &amp; Back Vietnamese Citizen ID (CCCD) with chip
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Footer Action */}
            <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#00b14f] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#009b45] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Submitting dossier...</span>
                  </>
                ) : (
                  <span>Submit Legal Dossier</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 3. FLOATING NAVIGATION: NEXT STEP ---------------- */}
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
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#00b14f]" />
                <h3 className="text-base font-bold text-slate-900">Legal Document Upload Guidelines</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGuidelinesOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
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
                  <li>Only PDF and high-resolution scanned photos (JPG, PNG) are accepted.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="font-bold text-slate-800">2. Letter of Authorization (LOA) &amp; Identity Document</h4>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                  <li>Applicable to authorized HR specialists, team leads, or recruiters.</li>
                  <li>Download and complete the official InterVue Letter of Authorization template (`.docx`).</li>
                  <li>
                    <strong>Must be printed out on paper</strong>, signed by the Legal Representative or authorized
                    director with the enterprise legal round red seal.
                  </li>
                  <li>
                    <strong>Must attach clear photos/scans of both front and back</strong> of the authorized
                    person&apos;s Citizen ID Card (CCCD).
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900">
                <h4 className="font-bold text-amber-950">3. Common Rejection Reasons to Avoid</h4>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-800">
                  <li>Cropped edges, obscured text, blurry photos, or photocopies without notarization stamp.</li>
                  <li>Missing company red seal or missing Legal Representative signature.</li>
                  <li>Only submitting front side of Citizen ID Card (missing back side with chip).</li>
                  <li>Mismatched Tax Code or mismatched authorized representative name.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsGuidelinesOpen(false)}
                className="rounded-lg bg-[#00b14f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#009b45]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOA Preparation Guide Modal */}
      {isLoaGuideOpen && <LoaPreparationGuideModal isOpen={isLoaGuideOpen} onClose={() => setIsLoaGuideOpen(false)} />}

      {/* Server Document Inline Preview Modal */}
      {previewModal.isOpen && (
        <DocumentPreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
          documentId={previewModal.documentId}
          fileName={previewModal.fileName}
          target={previewModal.target}
        />
      )}
    </AccountSettingsLayout>
  );
}

export default BusinessLicenseView;

'use client';

import { adminBusinessVerificationApi } from '@/apiRequest/admin-business-verification';
import Spinner from '@/components/common/Spinner';
import type { BusinessDocumentResource } from '@/types/recruiter-company';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  FileText,
  Maximize2,
  Minimize2,
  RotateCw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface AdminBusinessDocumentViewerProps {
  document: BusinessDocumentResource;
  companyName: string;
  taxCode: string;
  submitterName: string;
  sampleScanUrl?: string;
  totalPages?: number;
}

export function AdminBusinessDocumentViewer({
  document,
  companyName,
  taxCode,
  submitterName,
  sampleScanUrl,
  totalPages = 1,
}: AdminBusinessDocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOcrOverlay, setShowOcrOverlay] = useState(false);
  const [viewMode, setViewMode] = useState<'stream' | 'structured'>('stream');

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blobType, setBlobType] = useState<'pdf' | 'image' | 'unknown'>('unknown');
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const effectiveTotalPages = document.identityBackStoragePublicId
    ? 3
    : document.identityStoragePublicId
      ? 2
      : totalPages;
  const currentKey = `${document.id}-${currentPage}`;
  const isLoadingBlob = loadedKey !== currentKey;

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;

    let fetcher = adminBusinessVerificationApi.viewDocumentBlob(document.id);
    if (currentPage === 2 && document.identityStoragePublicId) {
      fetcher = adminBusinessVerificationApi.viewIdentityBlob(document.id);
    } else if (currentPage === 3 && document.identityBackStoragePublicId) {
      fetcher = adminBusinessVerificationApi.viewIdentityBackBlob(document.id);
    }

    fetcher
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
        const type = blob.type.toLowerCase();
        if (type.includes('pdf')) {
          setBlobType('pdf');
        } else if (type.includes('image')) {
          setBlobType('image');
        } else {
          setBlobType('unknown');
        }
        setLoadedKey(currentKey);
      })
      .catch(() => {
        if (cancelled) return;
        setBlobUrl(null);
        setBlobType('unknown');
        setLoadedKey(currentKey);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [document.id, currentPage, document.identityStoragePublicId, document.identityBackStoragePublicId, currentKey]);

  const isErc = document.documentType === 'BUSINESS_LICENSE';
  const defaultScan = isErc ? '/images/recruiter/illustration-erc.png' : '/images/recruiter/illustration-loa.png';
  const scanImageSrc = sampleScanUrl || defaultScan;

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div
      className={`dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 flex flex-col rounded-2xl border bg-white shadow-xs transition-all ${
        isFullscreen ? 'shadow-elevation-2 fixed inset-4 z-50 rounded-2xl' : 'min-h-[640px]'
      }`}
    >
      {/* Document Studio Header */}
      <div className="dark:border-forest-800 border-outline-variant flex flex-wrap items-center justify-between border-b px-4 py-3">
        {/* Document Title & Metadata */}
        <div className="flex items-center gap-2.5">
          <div className="dark:bg-forest-800 bg-surface-container-high text-on-surface-variant flex h-8 w-8 items-center justify-center rounded-lg dark:text-emerald-300">
            <FileText className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p
              className="dark:text-forest-100 text-on-surface max-w-[240px] truncate text-xs font-semibold sm:max-w-[320px]"
              title={
                currentPage === 3
                  ? document.identityBackFileName || 'Citizen_ID_Back.png'
                  : currentPage === 2
                    ? document.identityFileName || 'Citizen_ID_Front.png'
                    : document.originalFileName
              }
            >
              {currentPage === 3
                ? document.identityBackFileName || 'Citizen ID Back / CCCD Mặt sau'
                : currentPage === 2
                  ? document.identityFileName || 'Citizen ID Front / CCCD Mặt trước'
                  : document.originalFileName}
            </p>
            <p className="dark:text-forest-400 text-label-sm text-outline">
              {(document.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB ·{' '}
              {currentPage === 3
                ? 'Citizen ID Back (CCCD Mặt sau)'
                : currentPage === 2
                  ? 'Citizen ID Front (CCCD Mặt trước)'
                  : isErc
                    ? 'License (ERC)'
                    : 'Authorization (LOA)'}{' '}
              · Page {currentPage}/{effectiveTotalPages}
            </p>
          </div>
        </div>

        {/* Studio Controls */}
        <div className="flex items-center gap-1">
          {/* Mode Switcher: Stream vs Structured View */}
          <div className="dark:bg-forest-950 bg-surface-container-high flex items-center rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('stream')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                viewMode === 'stream'
                  ? 'dark:bg-forest-800 dark:text-forest-100 text-on-surface bg-white shadow-xs'
                  : 'dark:text-forest-400 text-on-surface-variant hover:text-on-surface'
              }`}
              title="Stream authentic PDF or image from server"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Document</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('structured')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                viewMode === 'structured'
                  ? 'dark:bg-forest-800 dark:text-forest-100 text-on-surface bg-white shadow-xs'
                  : 'dark:text-forest-400 text-on-surface-variant hover:text-on-surface'
              }`}
              title="Structured certificate preview"
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Details</span>
            </button>
          </div>

          {/* OCR Highlight Toggle */}
          <button
            type="button"
            onClick={() => setShowOcrOverlay((prev) => !prev)}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              showOcrOverlay
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title="Toggle OCR extracted information overlay"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">OCR</span>
          </button>

          <div className="dark:bg-forest-800 bg-surface-container-high mx-1 h-4 w-px" />

          {/* Zoom Controls */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high rounded-lg p-1.5"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="dark:text-forest-300 dark:hover:bg-forest-800 text-label-sm text-on-surface-variant hover:bg-surface-container-high rounded px-1.5 py-1 font-mono font-medium"
            title="Reset to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high rounded-lg p-1.5"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Rotate Control */}
          <button
            type="button"
            onClick={handleRotate}
            className="dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high rounded-lg p-1.5"
            title="Rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high rounded-lg p-1.5"
            title={isFullscreen ? 'Exit full screen' : 'View full screen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="dark:bg-forest-950/80 bg-surface-container-high/70 relative flex flex-1 items-center justify-center overflow-auto p-6">
        {isLoadingBlob ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <Spinner />
            <p className="dark:text-forest-400 text-on-surface-variant text-xs">Streaming authenticated document...</p>
          </div>
        ) : viewMode === 'stream' && blobUrl ? (
          <div
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="flex h-full w-full max-w-3xl items-center justify-center"
          >
            {blobType === 'pdf' ? (
              <object
                data={blobUrl}
                type="application/pdf"
                className="border-outline-variant/80 h-[560px] w-full rounded-xl border bg-white shadow-sm dark:bg-slate-900"
              >
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <FileText className="text-outline h-10 w-10" />
                  <p className="text-on-surface-variant text-xs">PDF preview is ready.</p>
                  <a
                    href={blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              </object>
            ) : (
              <div className="border-outline-variant/80 overflow-hidden rounded-xl border bg-white p-2 shadow-sm dark:bg-slate-900">
                <img
                  src={blobUrl}
                  alt={document.originalFileName}
                  className="max-h-[540px] w-auto max-w-full object-contain"
                />
              </div>
            )}
          </div>
        ) : (
          /* Structured Scanned Document Paper Container (Details mode / Fallback) */
          <div
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="dark:border-forest-700 border-outline-variant/90 relative max-h-[560px] max-w-[480px] overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900"
          >
            {/* Document Header Text */}
            <div className="dark:border-forest-800 border-outline-variant space-y-2 border-b pb-3 text-center">
              <p className="dark:text-forest-400 text-label-sm text-on-surface-variant font-semibold tracking-wider uppercase">
                SOCIALIST REPUBLIC OF VIETNAM
              </p>
              <p className="dark:text-forest-500 text-label-sm text-outline">Independence - Freedom - Happiness</p>
              <div className="dark:bg-forest-700 mx-auto h-0.5 w-12 bg-slate-300" />

              <div className="pt-1">
                <h4 className="dark:text-forest-100 text-on-surface text-xs font-bold uppercase">
                  {currentPage === 2
                    ? 'CHIP-BASED CITIZEN IDENTITY CARD (CCCD)'
                    : isErc
                      ? 'ENTERPRISE REGISTRATION CERTIFICATE'
                      : 'LETTER OF AUTHORIZATION FOR RECRUITMENT'}
                </h4>
                <p className="dark:text-forest-400 text-label-sm text-on-surface-variant font-mono">
                  {currentPage === 2 ? `AUTHORIZED REPRESENTATIVE: ${submitterName}` : `TAX ID: ${taxCode}`}
                </p>
              </div>
            </div>

            {/* OCR Extracted Insights Banner if enabled */}
            {showOcrOverlay && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <p className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Extracted OCR Data:</span>
                </p>
                <div className="text-label-sm mt-1 space-y-1">
                  <p>
                    <strong>Company:</strong> {companyName}
                  </p>
                  <p>
                    <strong>Tax ID:</strong> {taxCode}
                  </p>
                  <p>
                    <strong>Signatory:</strong> {submitterName}
                  </p>
                </div>
              </div>
            )}

            {/* Visual Scanned Document Graphic */}
            <div className="dark:border-forest-800 dark:bg-forest-950/40 border-outline-variant bg-surface-container-low/50 mt-4 flex items-center justify-center overflow-hidden rounded-lg border p-2">
              <Image
                src={scanImageSrc}
                alt="Scanned credential document"
                width={380}
                height={220}
                className="max-h-[220px] w-auto object-contain"
                priority
              />
            </div>

            {/* Subtle Document Footer */}
            <div className="dark:border-forest-800 dark:text-forest-500 border-outline-variant text-label-sm text-outline mt-4 flex items-center justify-between border-t pt-3">
              <span>Submitted: {new Date(document.submittedAt).toLocaleDateString('en-US')}</span>
              <span className="font-mono">
                ID: {document.storagePublicId ? document.storagePublicId : `DOC-${document.id}`}
              </span>
            </div>
          </div>
        )}

        {/* Floating Page Switcher */}
        {effectiveTotalPages > 1 && (
          <div className="dark:border-forest-800 dark:bg-forest-900/90 border-outline-variant absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-white/95 px-3 py-1 shadow-sm backdrop-blur-md">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high rounded-full p-1 disabled:opacity-30"
              title="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="dark:text-forest-200 text-on-surface text-xs font-medium">
              Page {currentPage} of {effectiveTotalPages}
              {currentPage === 1 ? ' (LOA)' : ' (CCCD)'}
            </span>
            <button
              type="button"
              disabled={currentPage >= effectiveTotalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, effectiveTotalPages))}
              className="dark:text-forest-300 dark:hover:bg-forest-800 text-on-surface-variant hover:bg-surface-container-high rounded-full p-1 disabled:opacity-30"
              title="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-400 border-outline-variant bg-surface-container-low/50 text-label-sm text-on-surface-variant flex items-center justify-between border-t px-4 py-2.5">
        <span>Sandboxed Internal Document Studio · InterVue Compliance</span>
        <span className="dark:text-forest-500 text-outline font-mono">Verified Secure Stream</span>
      </div>
    </div>
  );
}

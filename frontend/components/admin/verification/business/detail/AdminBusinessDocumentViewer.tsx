'use client';

import type { BusinessDocumentResource } from '@/types/recruiter-company';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  Minimize2,
  RotateCw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

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
  totalPages = 2,
}: AdminBusinessDocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOcrOverlay, setShowOcrOverlay] = useState(false);

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
      className={`dark:border-forest-800 dark:bg-forest-900 flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'min-h-[640px]'
      }`}
    >
      {/* Document Studio Header */}
      <div className="dark:border-forest-800 flex flex-wrap items-center justify-between border-b border-slate-100 px-4 py-3">
        {/* Document Title & Metadata */}
        <div className="flex items-center gap-2.5">
          <div className="dark:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:text-emerald-300">
            <FileText className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p
              className="dark:text-forest-100 max-w-[240px] truncate text-xs font-semibold text-slate-800 sm:max-w-[320px]"
              title={document.originalFileName}
            >
              {document.originalFileName}
            </p>
            <p className="dark:text-forest-400 text-[11px] text-slate-400">
              {(document.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB ·{' '}
              {isErc ? 'License (ERC)' : 'Authorization (LOA)'} · Page {currentPage}/{totalPages}
            </p>
          </div>
        </div>

        {/* Studio Controls */}
        <div className="flex items-center gap-1">
          {/* OCR Highlight Toggle */}
          <button
            type="button"
            onClick={() => setShowOcrOverlay((prev) => !prev)}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              showOcrOverlay
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'dark:text-forest-300 dark:hover:bg-forest-800 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle OCR extracted information overlay"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">OCR Insights</span>
          </button>

          <div className="dark:bg-forest-800 mx-1 h-4 w-px bg-slate-200" />

          {/* Zoom Controls */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="dark:text-forest-300 dark:hover:bg-forest-800 rounded px-1.5 py-1 font-mono text-[11px] font-medium text-slate-600 hover:bg-slate-100"
            title="Reset to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Rotate Control */}
          <button
            type="button"
            onClick={handleRotate}
            className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title="Rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title={isFullscreen ? 'Exit full screen' : 'View full screen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="dark:bg-forest-950/80 relative flex flex-1 items-center justify-center overflow-auto bg-slate-100/70 p-6">
        {/* Scanned Document Paper Container */}
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="dark:border-forest-700 relative max-h-[560px] max-w-[480px] overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm dark:bg-slate-900"
        >
          {/* Document Header Text */}
          <div className="dark:border-forest-800 space-y-2 border-b border-slate-100 pb-3 text-center">
            <p className="dark:text-forest-400 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              SOCIALIST REPUBLIC OF VIETNAM
            </p>
            <p className="dark:text-forest-500 text-[9px] text-slate-400">Independence - Freedom - Happiness</p>
            <div className="dark:bg-forest-700 mx-auto h-0.5 w-12 bg-slate-300" />

            <div className="pt-1">
              <h4 className="dark:text-forest-100 text-xs font-bold text-slate-900 uppercase">
                {isErc ? 'ENTERPRISE REGISTRATION CERTIFICATE' : 'LETTER OF AUTHORIZATION FOR RECRUITMENT'}
              </h4>
              <p className="dark:text-forest-400 font-mono text-[10px] text-slate-500">
                BUSINESS CODE / TAX ID: {taxCode}
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
              <div className="mt-1 space-y-1 text-[11px]">
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
          <div className="dark:border-forest-800 dark:bg-forest-950/40 mt-4 flex items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50/50 p-2">
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
          <div className="dark:border-forest-800 dark:text-forest-500 mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">
            <span>Submitted: {new Date(document.submittedAt).toLocaleDateString('en-US')}</span>
            <span className="font-mono">
              ID:{' '}
              {'storagePublicId' in document && typeof document.storagePublicId === 'string'
                ? document.storagePublicId
                : `DOC-${document.id}`}
            </span>
          </div>
        </div>

        {/* Floating Page Switcher */}
        {totalPages > 1 && (
          <div className="dark:border-forest-800 dark:bg-forest-900/90 absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1 shadow-sm backdrop-blur-md">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-full p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              title="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="dark:text-forest-200 text-xs font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-full p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              title="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-400 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[11px] text-slate-500">
        <span>Sandboxed Internal Document Studio · InterVue Compliance</span>
        <span className="dark:text-forest-500 font-mono text-slate-400">Verified Secure Preview</span>
      </div>
    </div>
  );
}

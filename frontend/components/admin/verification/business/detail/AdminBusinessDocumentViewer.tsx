'use client';

import { env } from '@/config/env';
import type { BusinessDocumentResource } from '@/types/recruiter-company';
import { FileText, Maximize2, Minimize2, RotateCw, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface AdminBusinessDocumentViewerProps {
  document: BusinessDocumentResource;
}

export function AdminBusinessDocumentViewer({ document }: AdminBusinessDocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Directly construct view URL
  const viewUrl = `${env.NEXT_PUBLIC_API_URL}/admin/business-verification/${document.id}/view`;
  const isPdf = document.contentType === 'application/pdf' || document.originalFileName.toLowerCase().endsWith('.pdf');

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));

  return (
    <div
      className={`dark:border-forest-800 dark:bg-forest-900 flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'h-[720px]'
      }`}
    >
      {/* Document Viewer Header Bar */}
      <div className="dark:border-forest-800 flex flex-wrap items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="dark:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:text-emerald-300">
            <FileText className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p
              className="dark:text-forest-100 max-w-[260px] truncate text-xs font-bold text-slate-800"
              title={document.originalFileName}
            >
              {document.originalFileName}
            </p>
            <p className="dark:text-forest-400 text-[10px] text-slate-500">
              {(document.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB · {document.contentType}
            </p>
          </div>
        </div>

        {/* Sandboxed Viewer Controls */}
        <div className="flex items-center gap-1">
          {!isPdf && (
            <>
              <button
                type="button"
                onClick={handleZoomOut}
                className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                title="Rotate 90 degrees"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="dark:text-forest-300 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Sandboxed Content Frame */}
      <div className="dark:bg-forest-950 relative flex flex-1 items-center justify-center overflow-hidden bg-slate-50 p-2">
        {isPdf ? (
          <iframe
            src={`${viewUrl}#toolbar=0`}
            title="Document PDF Preview"
            className="dark:border-forest-800 h-full w-full rounded-xl border border-slate-200 bg-white shadow-2xs"
            sandbox="allow-same-origin allow-scripts"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center overflow-auto">
            <img
              src={viewUrl}
              alt="Document Scan Preview"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-in-out',
              }}
              className="max-h-full max-w-full rounded-lg object-contain shadow-md"
            />
          </div>
        )}
      </div>

      {/* Sandbox Compliance Footer Notice */}
      <div className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-400 flex items-center justify-between border-t border-slate-100 bg-white px-5 py-2.5 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Sandboxed Inline Stream · File download disabled for system security</span>
        </span>
        <span className="font-mono text-[10px]">Doc #{document.id}</span>
      </div>
    </div>
  );
}

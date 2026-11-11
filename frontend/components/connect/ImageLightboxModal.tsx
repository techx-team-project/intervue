'use client';

import type { ConnectMessage } from '@/types/connect';
import { formatConnectExactTime } from '@/utils/connect-chat';
import { ChevronLeft, ChevronRight, Download, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ZOOM_STEPS = [
  { label: '75%', className: 'scale-75' },
  { label: '100%', className: 'scale-100' },
  { label: '125%', className: 'scale-125' },
  { label: '150%', className: 'scale-150' },
  { label: '200%', className: 'scale-[2]' },
] as const;

type ImageLightboxModalProps = {
  images: ConnectMessage[];
  initialIndex: number;
  onClose: () => void;
  onDownload: (message: ConnectMessage) => void;
};

export default function ImageLightboxModal({ images, initialIndex, onClose, onDownload }: ImageLightboxModalProps) {
  const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), Math.max(0, images.length - 1)));
  const [zoomIdx, setZoomIdx] = useState(1);

  const current = images[index];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft' && hasMultiple) {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoomIdx(1);
      } else if (event.key === 'ArrowRight' && hasMultiple) {
        setIndex((prev) => (prev + 1) % images.length);
        setZoomIdx(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasMultiple, images.length, onClose]);

  if (!current || !current.attachmentUrl) return null;

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomIdx(1);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
    setZoomIdx(1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/92 text-white backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {current.senderName || current.attachmentFileName || 'Shared image'}
          </p>
          <p className="truncate text-xs text-slate-300">
            {formatConnectExactTime(current.createdAt)}
            {hasMultiple ? ` · ${index + 1} of ${images.length}` : ''}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomIdx((z) => Math.max(0, z - 1))}
            disabled={zoomIdx === 0}
            aria-label="Zoom out"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-11 text-center text-xs font-medium text-slate-200">{ZOOM_STEPS[zoomIdx].label}</span>
          <button
            type="button"
            onClick={() => setZoomIdx((z) => Math.min(ZOOM_STEPS.length - 1, z + 1))}
            disabled={zoomIdx === ZOOM_STEPS.length - 1}
            aria-label="Zoom in"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomIdx(1)}
            disabled={zoomIdx === 1}
            aria-label="Reset zoom"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDownload(current)}
            aria-label="Download image"
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="fixed top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80 sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <Image
          src={current.attachmentUrl}
          alt={current.attachmentFileName ?? 'Chat image'}
          width={1600}
          height={1200}
          unoptimized
          onClick={(e) => e.stopPropagation()}
          className={`h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-lg object-contain shadow-2xl transition-transform duration-150 ${ZOOM_STEPS[zoomIdx].className}`}
        />

        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="fixed top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80 sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {current.body && current.body !== current.attachmentFileName && (
        <div
          className="shrink-0 border-t border-white/10 bg-black/40 px-6 py-3 text-center text-sm text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {current.body}
        </div>
      )}
    </div>
  );
}

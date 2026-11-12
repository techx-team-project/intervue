'use client';

import { formatAdDimensions } from '@/lib/admin-ads';
import { cn } from '@/lib/utils';
import { ImageOff, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface AdBannerPreviewFrameProps {
  imageUrl?: string | null;
  alt: string;
  width?: number | null;
  height?: number | null;
  emptyLabel?: string;
  onInspect?: () => void;
  className?: string;
  compact?: boolean;
}

function BannerImage({
  imageUrl,
  alt,
  compact,
  onBroken,
}: {
  imageUrl: string;
  alt: string;
  compact?: boolean;
  onBroken: () => void;
}) {
  return (
    /* Artwork may live on Cloudinary or external URLs outside next.config images.remotePatterns */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={alt}
      onError={onBroken}
      className={cn('h-full w-full object-contain', compact ? 'max-h-14' : 'max-h-44')}
    />
  );
}

export default function AdBannerPreviewFrame({
  imageUrl,
  alt,
  width,
  height,
  emptyLabel = 'No banner artwork set',
  onInspect,
  className,
  compact = false,
}: AdBannerPreviewFrameProps) {
  const normalizedUrl = imageUrl?.trim() ?? '';
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasImage = Boolean(normalizedUrl) && failedUrl !== normalizedUrl;

  const content = (
    <div
      className={cn(
        'dark:border-forest-700 dark:bg-forest-950/70 border-outline-variant bg-surface-container-low relative flex w-full items-center justify-center overflow-hidden rounded-lg border',
        compact ? 'h-12 px-1.5 py-1' : 'min-h-24 p-2.5',
        onInspect && hasImage && 'group cursor-pointer',
        className,
      )}
    >
      {hasImage ? (
        <>
          <BannerImage
            key={normalizedUrl}
            imageUrl={normalizedUrl}
            alt={alt}
            compact={compact}
            onBroken={() => setFailedUrl(normalizedUrl)}
          />
          {onInspect && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow-xs">
                <Maximize2 className="h-3 w-3" />
                {!compact && <span>Inspect</span>}
              </span>
            </span>
          )}
        </>
      ) : (
        <div className="dark:text-forest-400 text-on-surface-variant flex flex-col items-center justify-center gap-1 text-center">
          <ImageOff className={compact ? 'h-3.5 w-3.5 opacity-60' : 'h-5 w-5 opacity-60'} />
          {!compact && (
            <>
              <span className="text-xs font-medium">
                {failedUrl === normalizedUrl && normalizedUrl ? 'Image failed to load' : emptyLabel}
              </span>
              <span className="font-mono text-[11px] opacity-80">{formatAdDimensions(width, height)}</span>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (onInspect && hasImage) {
    return (
      <button
        type="button"
        onClick={onInspect}
        aria-label={`Inspect ${alt}`}
        className="block w-full text-left focus-visible:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
}

'use client';

import { publicAdApi } from '@/apiRequest/ads';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

const STALE_MS = 2 * 60 * 1000;

interface AdSlotProps {
  code: string;
  className?: string;
}

/** Renders nothing at all when the slot has neither a paid banner nor a house ad. */
export default function AdSlot({ code, className }: AdSlotProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ['ads', 'slot', code],
    queryFn: () => publicAdApi.serve(code),
    staleTime: STALE_MS,
  });

  if (!data || failedSrc === data.imageUrl) return null;

  const alt = data.altText?.trim() || (data.house ? 'InterVue banner' : 'Sponsored banner');
  const disclosure = data.house ? 'InterVue Spotlight' : 'Sponsored';
  const targetUrl = data.targetUrl?.trim() || null;

  const frame = (
    <div
      className="border-outline-variant/80 bg-surface-container-low relative w-full overflow-hidden rounded-2xl border shadow-xs transition-shadow group-hover:shadow-md"
      style={{ aspectRatio: `${data.width} / ${data.height}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.imageUrl}
        alt={alt}
        width={data.width}
        height={data.height}
        loading="lazy"
        onError={() => setFailedSrc(data.imageUrl)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.005]"
      />
    </div>
  );

  const trackClick = () => {
    void publicAdApi.click(code);
  };

  return (
    <aside aria-label={alt} className={cn('w-full', className)}>
      {!targetUrl ? (
        frame
      ) : targetUrl.startsWith('/') ? (
        <Link href={targetUrl} onClick={trackClick} aria-label={alt} className="group block focus:outline-none">
          {frame}
        </Link>
      ) : (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={trackClick}
          aria-label={alt}
          className="group block focus:outline-none"
        >
          {frame}
        </a>
      )}
      <p className="text-on-surface-variant mt-1.5 text-right text-[11px] font-medium tracking-wide">{disclosure}</p>
    </aside>
  );
}

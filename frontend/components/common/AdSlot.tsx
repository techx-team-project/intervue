'use client';

import { publicAdApi } from '@/apiRequest/ads';
import { useQuery } from '@tanstack/react-query';

const STALE_MS = 2 * 60 * 1000;

interface AdSlotProps {
  code: string;
  className?: string;
}

/** Renders nothing at all when the slot has neither a paid banner nor a house ad. */
export default function AdSlot({ code, className }: AdSlotProps) {
  const { data } = useQuery({
    queryKey: ['ads', 'slot', code],
    queryFn: () => publicAdApi.serve(code),
    staleTime: STALE_MS,
  });

  if (!data) return null;

  const banner = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={data.imageUrl}
      alt={data.altText ?? 'Quảng cáo'}
      width={data.width}
      height={data.height}
      className="h-auto w-full rounded-2xl"
    />
  );

  if (!data.targetUrl) {
    return <div className={className}>{banner}</div>;
  }

  return (
    <div className={className}>
      <a
        href={data.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => {
          void publicAdApi.click(code);
        }}
        aria-label={data.altText ?? 'Quảng cáo'}
      >
        {banner}
      </a>
      <p className="text-on-surface-variant mt-1 text-right text-[11px]">
        {data.house ? 'Nội dung của InterVue' : 'Quảng cáo'}
      </p>
    </div>
  );
}

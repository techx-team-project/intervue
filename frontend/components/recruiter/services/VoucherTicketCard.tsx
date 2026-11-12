'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Fragment, useId } from 'react';

interface VoucherTicketCardProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  active?: boolean;
  expanded?: boolean;
  ariaExpanded?: boolean;
  className?: string;
  children: ReactNode;
}

const HIGHLIGHT_TOKEN_REGEX = /(\d+(?:[.,]\d+)?%|\d+(?:[.,]\d+)*(?:\s*(?:đ|VNĐ|VND|K(?![a-zA-ZÀ-ỹ]))))/gi;

export function ScallopedPercentBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('h-[20px] w-[20px] shrink-0 text-[#00b14f]', className)}>
      <g fill="currentColor">
        <circle cx="12" cy="12" r="7.4" />
        <circle cx="18.6" cy="12" r="3.2" />
        <circle cx="16.67" cy="16.67" r="3.2" />
        <circle cx="12" cy="18.6" r="3.2" />
        <circle cx="7.33" cy="16.67" r="3.2" />
        <circle cx="5.4" cy="12" r="3.2" />
        <circle cx="7.33" cy="7.33" r="3.2" />
        <circle cx="12" cy="5.4" r="3.2" />
        <circle cx="16.67" cy="7.33" r="3.2" />
      </g>
      <circle cx="9.3" cy="9.3" r="1.35" fill="#ffffff" />
      <circle cx="14.7" cy="14.7" r="1.35" fill="#ffffff" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/** Highlights percentage and currency tokens in bold to match TopCV voucher typography. */
export function renderHighlightedVoucherLabel(label: string): ReactNode {
  const parts = label.split(HIGHLIGHT_TOKEN_REGEX);
  if (parts.length <= 1) return label;

  return parts.map((part, index) => {
    if (!part) return null;
    if (index % 2 === 1) {
      return (
        <strong key={`${part}-${index}`} className="font-bold">
          {part}
        </strong>
      );
    }
    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export default function VoucherTicketCard({
  onClick,
  disabled = false,
  title,
  active = false,
  expanded = false,
  ariaExpanded,
  className,
  children,
}: VoucherTicketCardProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const clipId = `vt-clip-${rawId}`;
  const maskId = `vt-mask-${rawId}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-expanded={ariaExpanded}
      className={cn(
        'group relative flex min-h-[62px] w-full cursor-pointer items-center px-4 py-3.5 text-left transition-transform duration-150 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
          </clipPath>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle cx="0" cy="50%" r="5.5" fill="black" />
            <circle cx="100%" cy="50%" r="5.5" fill="black" />
            <circle cx="28" cy="0" r="4" fill="black" />
            <circle cx="28" cy="100%" r="4" fill="black" />
          </mask>
        </defs>

        <g clipPath={`url(#${clipId})`} mask={`url(#${maskId})`}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="8"
            ry="8"
            stroke="#00b14f"
            strokeWidth="2"
            className={cn(
              'transition-colors duration-150',
              active || expanded
                ? 'fill-[#dcfce7] group-hover:fill-[#d1fae5]'
                : 'fill-[#f0fdf5] group-hover:fill-[#e4faed] group-focus-visible:fill-[#e4faed]',
            )}
          />
          <circle cx="0" cy="50%" r="5.5" fill="none" stroke="#00b14f" strokeWidth="2" />
          <circle cx="100%" cy="50%" r="5.5" fill="none" stroke="#00b14f" strokeWidth="2" />
          <circle cx="28" cy="0" r="4" fill="none" stroke="#00b14f" strokeWidth="2" />
          <circle cx="28" cy="100%" r="4" fill="none" stroke="#00b14f" strokeWidth="2" />
        </g>
      </svg>

      <span className="relative z-10 flex w-full min-w-0 items-center gap-3">{children}</span>
    </button>
  );
}

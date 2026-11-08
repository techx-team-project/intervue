import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type SectionHeaderProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
};

export default function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = 'left',
  tone = 'light',
}: SectionHeaderProps) {
  const isCentered = align === 'center';
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'mb-10 flex flex-wrap items-end justify-between gap-4',
        isCentered && 'mx-auto max-w-3xl flex-col items-center text-center',
      )}
    >
      <div className="space-y-3">
        {eyebrow && (
          <p
            className={cn(
              'text-label-lg font-bold tracking-widest uppercase',
              isDark ? 'text-primary-bright' : 'text-primary',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2 id={id} className={cn('font-display text-display-md', isDark ? 'text-white' : 'text-on-surface')}>
          {title}
        </h2>
        {description && (
          <p className={cn('text-title-md font-normal', isDark ? 'text-white/70' : 'text-on-surface-variant')}>
            {description}
          </p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="text-title-md text-primary group inline-flex items-center gap-2 font-semibold"
        >
          {actionLabel}
          <ArrowRight
            className="ease-standard h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
}

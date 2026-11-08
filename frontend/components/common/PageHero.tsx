import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  crumbs?: Crumb[];
  align?: 'left' | 'center';
  overlap?: boolean;
  children?: ReactNode;
};

export default function PageHero({
  id,
  eyebrow,
  title,
  description,
  crumbs,
  align = 'left',
  overlap = false,
  children,
}: PageHeroProps) {
  const isCentered = align === 'center';

  return (
    <section
      aria-labelledby={id}
      className={cn('bg-primary-deeper relative overflow-hidden pt-12', overlap ? 'pb-28' : 'pb-14')}
    >
      <div aria-hidden className="bg-primary-deep absolute -top-44 -right-32 h-[520px] w-[520px] rounded-full" />
      <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.07]" />

      <div className={cn('container-page relative', isCentered && 'text-center')}>
        {crumbs && crumbs.length > 0 && (
          <nav
            aria-label="Đường dẫn"
            className={cn('text-body-sm mb-6 flex items-center gap-1.5 text-white/60', isCentered && 'justify-center')}
          >
            {crumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <p
            className={cn(
              'text-label-lg text-primary-bright flex items-center gap-3 font-bold tracking-widest uppercase',
              isCentered && 'justify-center',
            )}
          >
            <span aria-hidden className="bg-primary-bright h-px w-10" />
            {eyebrow}
          </p>
        )}

        <h1
          id={id}
          className={cn(
            'font-display text-display-md medium:text-display-lg mt-4 text-white',
            isCentered && 'mx-auto max-w-4xl',
          )}
        >
          {title}
        </h1>

        {description && (
          <p className={cn('text-title-md mt-4 max-w-2xl font-normal text-white/75', isCentered && 'mx-auto')}>
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const WINDOW = 2;

function pageWindow(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set<number>([1, pageCount, page]);
  for (let offset = 1; offset <= WINDOW; offset += 1) {
    if (page - offset > 1) pages.add(page - offset);
    if (page + offset < pageCount) pages.add(page + offset);
  }

  const sorted = [...pages].sort((left, right) => left - right);
  return sorted.flatMap((entry, index) =>
    index > 0 && entry - sorted[index - 1] > 1 ? (['gap', entry] as (number | 'gap')[]) : [entry],
  );
}

export default function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const first = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalItems);

  const stepClass =
    'dark:border-forest-800 dark:text-forest-200 dark:hover:bg-forest-850 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <p className="dark:text-forest-300 text-body-sm text-on-surface-variant">
        Showing <span className="dark:text-forest-100 text-on-surface-variant font-bold">{first}</span>–
        <span className="dark:text-forest-100 text-on-surface-variant font-bold">{last}</span> of{' '}
        <span className="dark:text-forest-100 text-on-surface-variant font-bold">
          {totalItems.toLocaleString('en-GB')}
        </span>
      </p>

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={stepClass}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageWindow(page, pageCount).map((entry, index) =>
            entry === 'gap' ? (
              <span key={`gap-${index}`} className="text-body-sm text-outline px-1">
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                onClick={() => onPageChange(entry)}
                aria-current={entry === page ? 'page' : undefined}
                className={cn(
                  'text-body-sm h-8 min-w-8 cursor-pointer rounded-lg px-2 font-bold transition-colors',
                  entry === page
                    ? 'bg-primary text-white'
                    : 'dark:text-forest-200 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-high',
                )}
              >
                {entry}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
            className={stepClass}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

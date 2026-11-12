'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

type JobFilterSectionProps = {
  title: string;
  activeCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function JobFilterSection({
  title,
  activeCount = 0,
  defaultOpen = true,
  children,
}: JobFilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section className="border-outline-variant border-b py-5 first:pt-0 last:border-b-0 last:pb-0">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <span className="font-display text-title-sm text-on-surface flex items-center gap-2 font-bold">
          {title}
          {activeCount > 0 && (
            <span className="bg-primary text-on-primary rounded-full px-1.5 text-[11px] leading-4 font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn('text-on-surface-variant h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>
      {isOpen && (
        <div id={contentId} className="mt-4">
          {children}
        </div>
      )}
    </section>
  );
}

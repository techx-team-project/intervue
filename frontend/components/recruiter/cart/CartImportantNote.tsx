'use client';

import { SERVICE_IMPORTANT_NOTICE } from '@/constants/service-package';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface CartImportantNoteProps {
  size?: 'compact' | 'comfortable';
}

export default function CartImportantNote({ size = 'compact' }: CartImportantNoteProps) {
  const isComfortable = size === 'comfortable';

  return (
    <div
      className={cn(
        'rounded-xl border border-[#dbeafe] bg-[#f0f7ff] shadow-2xs',
        isComfortable ? 'p-4 sm:px-5 sm:py-4' : 'text-body-md p-4',
      )}
    >
      <div className="flex items-center gap-2.5 font-bold text-[#1d4ed8]">
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white',
            isComfortable ? 'h-5.5 w-5.5' : 'h-5 w-5',
          )}
        >
          <Info className="h-3.5 w-3.5" aria-hidden />
        </span>
        <h3 className={cn('font-bold tracking-tight', isComfortable ? 'text-base sm:text-[17px]' : 'text-sm')}>
          {SERVICE_IMPORTANT_NOTICE.title}
        </h3>
      </div>
      <p
        className={cn(
          'text-on-surface-variant leading-relaxed',
          isComfortable ? 'mt-2.5 text-sm sm:text-[15px]' : 'text-body-sm mt-2',
        )}
      >
        {SERVICE_IMPORTANT_NOTICE.body}
      </p>
    </div>
  );
}

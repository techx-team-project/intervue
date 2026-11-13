import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

interface InfoNoticeProps {
  title?: string;
  children: ReactNode;
}

export default function InfoNotice({ title, children }: InfoNoticeProps) {
  return (
    <div className="flex gap-3 rounded-lg border-l-4 border-sky-500 bg-sky-50 px-4 py-3.5">
      <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-600" aria-hidden />
      <div>
        {title && <p className="text-sm font-bold text-sky-900">{title}</p>}
        <div className={cn('text-on-surface-variant text-sm leading-relaxed', title && 'mt-1')}>{children}</div>
      </div>
    </div>
  );
}

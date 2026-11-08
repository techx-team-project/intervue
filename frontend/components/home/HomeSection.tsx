import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type HomeSectionProps = {
  id?: string;
  titleId: string;
  className?: string;
  children: ReactNode;
};

export default function HomeSection({ id, titleId, className, children }: HomeSectionProps) {
  return (
    <section id={id} aria-labelledby={titleId} className="container-page py-4">
      <div className={cn('bg-surface medium:p-8 rounded-2xl p-6', className)}>{children}</div>
    </section>
  );
}

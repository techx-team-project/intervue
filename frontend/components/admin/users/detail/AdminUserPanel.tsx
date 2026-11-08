import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AdminUserPanelProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AdminUserPanel({ title, description, actions, children, className }: AdminUserPanelProps) {
  return (
    <section
      className={cn(
        'dark:border-forest-800 dark:bg-forest-900 border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-xs',
        className,
      )}
    >
      <header className="dark:border-forest-800 border-outline-variant flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="text-navy dark:text-forest-50 text-body-md font-bold">{title}</h2>
          {description && (
            <p className="dark:text-forest-300 text-body-sm text-on-surface-variant mt-0.5">{description}</p>
          )}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>

      <div className="px-4 py-3.5">{children}</div>
    </section>
  );
}

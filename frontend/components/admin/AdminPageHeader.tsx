import { ReactNode } from 'react';

interface AdminPageHeaderProps {
  description: string;
  count?: number;
  countLabel?: string;
  actions?: ReactNode;
}

// The page title already sits in AdminPageBar, so the body carries only the
// description and the page-level actions.
export default function AdminPageHeader({ description, count, countLabel, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="dark:text-forest-300 min-w-0 text-[13px] text-[#64748b]">
        {description}
        {count !== undefined && (
          <span className="text-navy dark:text-forest-100 ml-1.5 font-bold">
            {count.toLocaleString('en-GB')} {countLabel ?? ''}
          </span>
        )}
      </p>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

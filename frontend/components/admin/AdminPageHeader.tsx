import { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  actions?: ReactNode;
}

export default function AdminPageHeader({ title, description, count, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="truncate text-xl font-black text-slate-900 sm:text-2xl">{title}</h1>

          {count !== undefined && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600">
              {count}
            </span>
          )}
        </div>

        {description && <p className="mt-1 text-[13px] text-slate-500">{description}</p>}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

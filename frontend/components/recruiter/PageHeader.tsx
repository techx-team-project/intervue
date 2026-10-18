import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-navy text-xl font-black sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-[#64748b]">{description}</p>}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

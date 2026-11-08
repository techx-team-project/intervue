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
        <h1 className="text-navy text-xl font-bold sm:text-2xl">{title}</h1>
        {description && <p className="text-body-md text-on-surface-variant mt-1">{description}</p>}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

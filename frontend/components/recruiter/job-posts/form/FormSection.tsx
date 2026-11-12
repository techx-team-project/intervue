import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="border-outline-variant rounded-xl border bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-navy text-body-lg font-bold">{title}</h3>
        {description && <p className="text-body-sm text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

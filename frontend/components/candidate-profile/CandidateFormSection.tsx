import type { ReactNode } from 'react';

type CandidateFormSectionProps = {
  title: string;
  children: ReactNode;
};

export default function CandidateFormSection({ title, children }: CandidateFormSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="border-b border-slate-100 pb-1.5 text-sm font-bold text-slate-800">{title}</h3>
      {children}
    </section>
  );
}

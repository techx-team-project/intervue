import type { ReactNode } from 'react';

type CandidateFormSectionProps = {
  title: string;
  children: ReactNode;
};

export default function CandidateFormSection({ title, children }: CandidateFormSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="border-outline-variant text-on-surface border-b pb-1.5 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}

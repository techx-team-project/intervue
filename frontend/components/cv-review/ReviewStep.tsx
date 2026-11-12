import type { ReactNode } from 'react';

type ReviewStepProps = {
  step: string;
  title: string;
  hint?: string;
  children: ReactNode;
};

export default function ReviewStep({ step, title, hint, children }: ReviewStepProps) {
  return (
    <section className="bg-surface border-outline-variant rounded-2xl border p-6 sm:p-8">
      <h2 className="mb-1 flex items-center gap-3">
        <span className="text-label-lg text-primary font-bold tabular-nums">{step}</span>
        <span aria-hidden className="bg-primary/40 h-px w-6" />
        <span className="font-display text-title-lg text-on-surface font-bold">{title}</span>
      </h2>
      {hint && <p className="text-body-md text-on-surface-variant mb-5">{hint}</p>}
      {!hint && <div className="mb-5" />}
      {children}
    </section>
  );
}

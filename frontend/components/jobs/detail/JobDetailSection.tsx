import type { ReactNode } from 'react';

type JobDetailSectionProps = {
  id: string;
  title: string;
  index?: string;
  lines?: string[];
  children?: ReactNode;
};

export default function JobDetailSection({ id, title, index, lines, children }: JobDetailSectionProps) {
  if (!children && (!lines || lines.length === 0)) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="bg-surface border-outline-variant scroll-mt-32 rounded-2xl border p-6 sm:p-8"
    >
      <h2 id={`${id}-title`} className="mb-6 flex items-center gap-3">
        {index && <span className="text-label-lg text-primary font-bold tabular-nums">{index}</span>}
        {index && <span aria-hidden className="bg-primary/40 h-px w-6" />}
        <span className="font-display text-title-lg text-on-surface font-bold">{title}</span>
      </h2>
      {lines && (
        <ul className="text-body-lg text-on-surface space-y-3 leading-relaxed">
          {lines.map((line, position) => (
            <li key={position} className="flex gap-3">
              <span className="bg-primary mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}

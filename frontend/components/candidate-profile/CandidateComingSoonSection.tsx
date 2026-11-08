import type { LucideIcon } from 'lucide-react';

type CandidateComingSoonSectionProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function CandidateComingSoonSection({
  title,
  description,
  icon: Icon,
}: CandidateComingSoonSectionProps) {
  return (
    <section className="border-outline-variant rounded-3xl border bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-2.5">
        <div className="text-primary bg-primary-light flex h-9 w-9 items-center justify-center rounded-xl">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-navy text-lg font-bold sm:text-xl">{title}</h2>
        <span className="bg-surface-container-high text-on-surface-variant rounded-full px-2.5 py-0.5 text-xs font-semibold">
          Coming soon
        </span>
      </div>
      <p className="border-outline-variant bg-surface-container-low text-on-surface-variant mt-4 rounded-2xl border border-dashed px-4 py-6 text-center text-sm">
        {description}
      </p>
    </section>
  );
}

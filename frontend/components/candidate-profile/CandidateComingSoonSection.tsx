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
    <section className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-2.5">
        <div className="text-primary flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-navy text-lg font-bold sm:text-xl">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
          Coming soon
        </span>
      </div>
      <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        {description}
      </p>
    </section>
  );
}

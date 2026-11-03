import Button from '@/components/ui/Button';
import { Plus, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type CandidateSectionCardProps = {
  title: string;
  icon: LucideIcon;
  addLabel: string;
  emptyText: string;
  isEmpty: boolean;
  onAdd: () => void;
  children: ReactNode;
};

export default function CandidateSectionCard({
  title,
  icon: Icon,
  addLabel,
  emptyText,
  isEmpty,
  onAdd,
  children,
}: CandidateSectionCardProps) {
  return (
    <section className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-navy truncate text-lg font-bold sm:text-xl">{title}</h2>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} leftIcon={<Plus className="h-4 w-4" />}>
          {addLabel}
        </Button>
      </div>

      {isEmpty ? (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">{children}</ul>
      )}
    </section>
  );
}

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
    <section className="border-outline-variant rounded-3xl border bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="text-primary bg-primary-light flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-navy truncate text-lg font-bold sm:text-xl">{title}</h2>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} leftIcon={<Plus className="h-4 w-4" />}>
          {addLabel}
        </Button>
      </div>

      {isEmpty ? (
        <p className="border-outline-variant bg-surface-container-low text-on-surface-variant mt-4 rounded-2xl border border-dashed px-4 py-6 text-center text-sm">
          {emptyText}
        </p>
      ) : (
        <ul className="divide-outline-variant mt-4 divide-y">{children}</ul>
      )}
    </section>
  );
}

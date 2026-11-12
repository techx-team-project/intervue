import type { ActiveJobFilter, PublicJobFilters } from '@/types/job-filters';
import { X } from 'lucide-react';

type ActiveFilterChipsProps = {
  filters: ActiveJobFilter[];
  onRemove: (patch: Partial<PublicJobFilters>) => void;
  onClear: () => void;
};

export default function ActiveFilterChips({ filters, onRemove, onClear }: ActiveFilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {filters.map((filter) => (
        <li key={filter.id}>
          <button
            type="button"
            onClick={() => onRemove(filter.patch)}
            aria-label={`Remove filter ${filter.label}`}
            className="bg-primary-light text-primary text-label-lg hover:bg-primary-tag flex h-8 cursor-pointer items-center gap-1.5 rounded-full pr-2.5 pl-3.5 font-semibold transition-colors"
          >
            {filter.label}
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClear}
          className="text-label-lg text-on-surface-variant hover:text-primary cursor-pointer px-2 font-semibold underline-offset-4 hover:underline"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}

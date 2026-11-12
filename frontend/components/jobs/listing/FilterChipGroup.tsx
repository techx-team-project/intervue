import { cn } from '@/lib/utils';

type FilterChipOption = { value: string; label: string };

type FilterChipGroupProps = {
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  allowClear?: boolean;
};

export default function FilterChipGroup({
  options,
  value,
  onChange,
  ariaLabel,
  allowClear = true,
}: FilterChipGroupProps) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected && allowClear ? '' : option.value)}
            className={cn(
              'text-label-lg ease-standard h-9 cursor-pointer rounded-full border px-3.5 transition-colors duration-150',
              isSelected
                ? 'border-primary bg-primary text-on-primary'
                : 'border-outline-variant bg-surface text-on-surface hover:border-primary hover:text-primary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

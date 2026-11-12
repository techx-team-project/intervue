import { REVIEW_LEVELS, type ReviewLevel } from '@/constants/cv-review';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type ReviewLevelPickerProps = {
  value: ReviewLevel;
  onChange: (level: ReviewLevel) => void;
};

export default function ReviewLevelPicker({ value, onChange }: ReviewLevelPickerProps) {
  return (
    <div role="radiogroup" aria-label="Review level" className="grid gap-3 sm:grid-cols-3">
      {REVIEW_LEVELS.map((item) => {
        const isSelected = value === item.level;
        return (
          <button
            key={item.level}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(item.level)}
            className={cn(
              'ease-standard flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 text-left transition-colors duration-150',
              isSelected
                ? 'border-primary bg-primary-light'
                : 'border-outline-variant bg-surface hover:border-primary/60',
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">
                Level {item.level}
                {item.isPaid && <span className="text-primary ml-1.5">Paid</span>}
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border',
                  isSelected ? 'border-primary bg-primary text-on-primary' : 'border-outline',
                )}
                aria-hidden
              >
                {isSelected && <Check className="h-3 w-3" />}
              </span>
            </span>
            <span className="space-y-1">
              <span className="font-display text-title-md text-on-surface block font-bold">{item.title}</span>
              <span className="text-body-md text-on-surface-variant block">{item.description}</span>
            </span>
            <span className="text-label-lg text-primary mt-auto font-semibold">{item.cost}</span>
          </button>
        );
      })}
    </div>
  );
}

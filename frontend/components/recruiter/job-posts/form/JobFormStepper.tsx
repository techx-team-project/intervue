import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const JOB_FORM_STEPS = ['Thông tin chính', 'Nội dung', 'Xem lại & đăng'] as const;

interface JobFormStepperProps {
  current: number;
  reached: number;
  onSelect: (step: number) => void;
}

export default function JobFormStepper({ current, reached, onSelect }: JobFormStepperProps) {
  return (
    <ol className="border-outline-variant flex border-b" aria-label="Các bước đăng tin">
      {JOB_FORM_STEPS.map((label, index) => {
        const done = index < current;
        const isCurrent = index === current;
        return (
          <li key={label} className="flex-1">
            <button
              type="button"
              disabled={index > reached}
              onClick={() => onSelect(index)}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                '-mb-px flex w-full items-center justify-center gap-2 border-b-2 px-2 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed',
                isCurrent ? 'border-primary text-navy' : 'text-on-surface-variant border-transparent',
                !isCurrent && index <= reached && 'hover:text-navy',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  isCurrent && 'bg-primary text-white',
                  done && 'bg-primary-light text-primary-deep',
                  !isCurrent && !done && 'bg-surface-container-high text-outline',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

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
    <ol className="flex items-center gap-2" aria-label="Các bước đăng tin">
      {JOB_FORM_STEPS.map((label, index) => {
        const done = index < current;
        const reachable = index <= reached;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onSelect(index)}
              aria-current={index === current ? 'step' : undefined}
              className="flex items-center gap-2 disabled:cursor-not-allowed"
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  index === current && 'bg-emerald-600 text-white',
                  done && 'bg-emerald-100 text-emerald-700',
                  index > current && 'bg-slate-100 text-slate-400',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-semibold sm:inline',
                  index === current ? 'text-slate-900' : 'text-slate-400',
                )}
              >
                {label}
              </span>
            </button>
            {index < JOB_FORM_STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

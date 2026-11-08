import { cn } from '@/lib/utils';
import type { RecruiterOnboardingStep } from '@/types/recruiter-onboarding';
import { Check } from 'lucide-react';

const STEPS: Array<{ key: RecruiterOnboardingStep; label: string }> = [
  { key: 'profile', label: 'Recruiter information' },
  { key: 'needs', label: 'Hiring needs' },
];

type RecruiterOnboardingStepperProps = {
  current: RecruiterOnboardingStep;
};

export default function RecruiterOnboardingStepper({ current }: RecruiterOnboardingStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <ol aria-label="Sign-up progress" className="grid grid-cols-2">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <li
            key={step.key}
            aria-current={isActive ? 'step' : undefined}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-3 right-1/2 -left-1/2 h-0.5',
                  index <= currentIndex ? 'bg-primary' : 'bg-surface-container-high',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2',
                isDone && 'border-primary bg-primary text-white',
                isActive && 'border-primary bg-white',
                !isDone && !isActive && 'border-outline bg-white',
              )}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className={cn('h-2 w-2 rounded-full', isActive ? 'bg-primary' : 'bg-slate-300')} />
              )}
            </span>
            <span
              className={cn(
                'text-xs font-semibold sm:text-sm',
                isDone || isActive ? 'text-on-surface' : 'text-outline',
              )}
            >
              {step.label}
              {isDone && <span className="sr-only"> (completed)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

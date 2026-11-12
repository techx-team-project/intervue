import { cn } from '@/lib/utils';

const GOOD_SCORE = 80;
const OK_SCORE = 60;

type ReviewScoreProps = {
  score: number;
  label: string;
  suffix?: string;
};

export function scoreTone(score: number): string {
  if (score >= GOOD_SCORE) return 'text-primary';
  if (score >= OK_SCORE) return 'text-on-surface';
  return 'text-error';
}

export default function ReviewScore({ score, label, suffix = '' }: ReviewScoreProps) {
  return (
    <div className="border-outline-variant shrink-0 rounded-2xl border px-6 py-4 text-center">
      <p className={cn('font-display text-5xl leading-none font-extrabold tabular-nums', scoreTone(score))}>
        {score}
        {suffix}
      </p>
      <p className="text-label-md text-on-surface-variant mt-2 font-semibold tracking-wider uppercase">{label}</p>
    </div>
  );
}

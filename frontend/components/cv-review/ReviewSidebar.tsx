import { Button } from '@/components/ui/Button';
import { PAID_LEVEL, type ReviewLevel } from '@/constants/cv-review';
import type { CvReviewQuota } from '@/types/cv-review';
import { Coins, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

type ReviewSidebarProps = {
  level: ReviewLevel;
  quota: CvReviewQuota | null;
  credits: number;
  isAuthenticated: boolean;
  isPending: boolean;
  onSubmit: () => void;
  onTopup: () => void;
  onHistory: () => void;
};

export default function ReviewSidebar({
  level,
  quota,
  credits,
  isAuthenticated,
  isPending,
  onSubmit,
  onTopup,
  onHistory,
}: ReviewSidebarProps) {
  const isPaid = level === PAID_LEVEL;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="bg-surface border-outline-variant space-y-5 rounded-2xl border p-6">
        <dl className="border-outline-variant divide-outline-variant grid grid-cols-2 divide-x rounded-xl border">
          <div className="px-4 py-3">
            <dt className="text-label-md text-on-surface-variant">Free runs today</dt>
            <dd className="font-display text-title-lg text-on-surface font-bold">
              {quota ? `${quota.remaining}/${quota.maxDaily}` : '3/3'}
            </dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-label-md text-on-surface-variant">Credits</dt>
            <dd className="font-display text-title-lg text-on-surface font-bold">{isAuthenticated ? credits : '—'}</dd>
          </div>
        </dl>

        <Button
          size="xl"
          className="w-full"
          disabled={isPending}
          onClick={onSubmit}
          leftIcon={
            isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden />
            )
          }
        >
          {isPending ? 'Analyzing…' : isPaid ? 'Match with job (1 credit)' : 'Review my CV'}
        </Button>

        <p className="text-body-sm text-on-surface-variant text-center">
          {isPaid
            ? 'A failed AI run is refunded automatically. Re-running the same CV on the same job is free.'
            : 'Free runs reset every day.'}
        </p>

        {isAuthenticated && (
          <div className="border-outline-variant flex items-center justify-between border-t pt-4">
            <button
              type="button"
              onClick={onTopup}
              className="text-label-lg text-primary flex cursor-pointer items-center gap-1.5 font-semibold hover:underline"
            >
              <Coins className="h-4 w-4" aria-hidden />
              Top up credits
            </button>
            <button
              type="button"
              onClick={onHistory}
              className="text-label-lg text-on-surface-variant hover:text-primary cursor-pointer font-semibold hover:underline"
            >
              History
            </button>
          </div>
        )}
      </div>

      <p className="text-body-sm text-on-surface-variant flex items-start gap-2 px-1">
        <ShieldCheck className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        AI only assists. Your CV is processed privately and is never shared with recruiters by this tool.
      </p>
    </aside>
  );
}

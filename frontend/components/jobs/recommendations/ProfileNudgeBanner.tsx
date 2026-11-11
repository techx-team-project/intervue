import Link from 'next/link';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileNudgeBannerProps {
  message: string;
  actionUrl?: string;
  className?: string;
}

export default function ProfileNudgeBanner({
  message,
  actionUrl = '/candidate/profile',
  className,
}: ProfileNudgeBannerProps) {
  return (
    <div
      className={cn(
        'border-primary/20 to-primary-light/40 relative overflow-hidden rounded-2xl border bg-gradient-to-r from-emerald-50 via-teal-50/50 p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-label-sm text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold">
                <UserCheck className="h-3 w-3" />
                Profile Completion Nudge
              </span>
            </div>
            <p className="text-body-md text-on-surface mt-1 leading-relaxed font-medium">{message}</p>
          </div>
        </div>

        <Link
          href={actionUrl}
          className="bg-primary text-label-md hover:bg-primary-hover inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 font-bold text-white shadow-xs transition active:scale-[0.98]"
        >
          <span>Complete profile</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

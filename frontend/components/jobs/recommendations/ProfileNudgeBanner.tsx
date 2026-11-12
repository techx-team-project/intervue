import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
        'bg-surface-container-low border-outline-variant flex flex-col gap-3 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-body-md text-on-surface">{message}</p>
      <Link
        href={actionUrl}
        className="text-body-md text-primary inline-flex shrink-0 items-center gap-1.5 font-semibold hover:underline"
      >
        Complete profile
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

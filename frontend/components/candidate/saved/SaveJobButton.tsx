'use client';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useSavedJobIds, useToggleSavedJob } from '@/hooks/useCandidateSaved';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SaveJobButtonProps {
  jobId: number;
  variant?: 'icon' | 'labeled';
  className?: string;
}

export default function SaveJobButton({ jobId, variant = 'icon', className }: SaveJobButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasRole } = useAuth();
  const { data: savedIds = [] } = useSavedJobIds();
  const toggle = useToggleSavedJob();
  const saved = savedIds.includes(jobId);

  const onClick = () => {
    if (!isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!hasRole('CANDIDATE')) {
      toast.info('Only candidate accounts can save jobs.');
      return;
    }
    toggle.mutate(
      { id: jobId, active: !saved },
      { onSuccess: () => toast.success(saved ? 'Job removed from your saved list.' : 'Job saved.') },
    );
  };

  const label = saved ? 'Unsave job' : 'Save job';

  if (variant === 'labeled') {
    return (
      <Button
        type="button"
        size="2xl"
        variant="outline"
        aria-pressed={saved}
        className={className}
        leftIcon={<Heart className={cn('h-4 w-4', saved && 'fill-current')} />}
        onClick={onClick}
      >
        {saved ? 'Saved' : 'Save job'}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      title={label}
      onClick={onClick}
      className={cn(
        'text-on-surface-variant hover:text-error flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/5',
        saved && 'text-error',
        className,
      )}
    >
      <Heart className={cn('h-5 w-5', saved && 'fill-current')} aria-hidden />
    </button>
  );
}

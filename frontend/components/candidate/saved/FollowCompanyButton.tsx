'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useFollowedCompanyIds, useToggleFollowCompany } from '@/hooks/useCandidateSaved';
import { cn } from '@/lib/utils';
import { BellPlus, BellRing } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FollowCompanyButtonProps {
  companyId: number;
  className?: string;
}

export default function FollowCompanyButton({ companyId, className }: FollowCompanyButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasRole } = useAuth();
  const { data: followedIds = [] } = useFollowedCompanyIds();
  const toggle = useToggleFollowCompany();
  const following = followedIds.includes(companyId);
  const Icon = following ? BellRing : BellPlus;

  const onClick = () => {
    if (!isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!hasRole('CANDIDATE')) {
      toast.info('Only candidate accounts can follow companies.');
      return;
    }
    toggle.mutate(
      { id: companyId, active: !following },
      {
        onSuccess: () =>
          toast.success(
            following
              ? 'You unfollowed this company.'
              : 'You are following this company. We will notify you about new jobs.',
          ),
      },
    );
  };

  return (
    <button
      type="button"
      aria-pressed={following}
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors',
        following
          ? 'border-primary bg-primary-light text-primary'
          : 'border-outline-variant text-on-surface hover:bg-surface-container-low bg-white',
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>{following ? 'Following' : 'Follow'}</span>
    </button>
  );
}

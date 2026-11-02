'use client';

import { ROLES } from '@/constants/auth';
import { RECRUITER_AREA_PREFIX, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type RoleSwitcherProps = {
  onNavigate?: () => void;
  className?: string;
};

export default function RoleSwitcher({ onNavigate, className }: RoleSwitcherProps) {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  if (!hasRole(ROLES.CANDIDATE) || !hasRole(ROLES.RECRUITER)) return null;

  const target = pathname.startsWith(RECRUITER_AREA_PREFIX)
    ? { href: ROUTES.HOME, label: 'Chuyển sang Ứng viên' }
    : { href: ROUTES.RECRUITER_DASHBOARD, label: 'Chuyển sang Nhà tuyển dụng' };

  return (
    <Link
      href={target.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50',
        className,
      )}
    >
      <ArrowLeftRight className="h-4 w-4 shrink-0" />
      <span>{target.label}</span>
    </Link>
  );
}

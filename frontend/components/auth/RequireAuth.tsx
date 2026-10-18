'use client';

import Spinner from '@/components/common/Spinner';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import type { RoleType } from '@/types/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type RequireAuthProps = {
  roles?: RoleType[];
  children: ReactNode;
};

export default function RequireAuth({ roles, children }: RequireAuthProps) {
  const router = useRouter();
  const { status, hasRole } = useAuth();

  useEffect(() => {
    if (status !== 'unauthenticated') return;
    const current = window.location.pathname + window.location.search;
    router.replace(`${ROUTES.LOGIN}?${REDIRECT_PARAM}=${encodeURIComponent(current)}`);
  }, [status, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (roles && !roles.some(hasRole)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-lg font-bold text-slate-800">You do not have access to this page</h1>
        <Link href={ROUTES.HOME} className="text-sm font-semibold text-emerald-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return children;
}

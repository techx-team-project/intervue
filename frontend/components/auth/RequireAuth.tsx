'use client';

import Spinner from '@/components/common/Spinner';
import NotFoundView from '@/components/common/NotFoundView';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { isRecruiterPortal } from '@/lib/auth-portal';
import type { RoleType } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type RequireAuthProps = {
  roles?: RoleType[];
  forbiddenFallback?: ReactNode;
  children: ReactNode;
};

export default function RequireAuth({ roles, forbiddenFallback, children }: RequireAuthProps) {
  const router = useRouter();
  const { status, hasRole } = useAuth();

  useEffect(() => {
    if (status !== 'unauthenticated') return;
    const current = window.location.pathname + window.location.search;
    const loginRoute = current.startsWith('/admin')
      ? '/admin/login'
      : isRecruiterPortal()
        ? ROUTES.RECRUITER_LOGIN
        : ROUTES.LOGIN;
    router.replace(`${loginRoute}?${REDIRECT_PARAM}=${encodeURIComponent(current)}`);
  }, [status, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (roles && !roles.some(hasRole)) {
    if (forbiddenFallback) return forbiddenFallback;
    return <NotFoundView />;
  }

  return children;
}

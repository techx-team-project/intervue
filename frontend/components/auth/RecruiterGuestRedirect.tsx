'use client';

import { ROLES } from '@/constants/auth';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeRedirect } from '@/utils/redirect';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RecruiterGuestRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user || !hasRole(ROLES.RECRUITER)) return;
    const target = new URLSearchParams(window.location.search).get(REDIRECT_PARAM);
    router.replace(sanitizeRedirect(target, ROUTES.RECRUITER_DASHBOARD));
  }, [isAuthenticated, user, hasRole, router]);

  return null;
}

'use client';

import { REDIRECT_PARAM } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeRedirect } from '@/utils/redirect';
import { homeFor } from '@/utils/role-home';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GuestRedirect() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const target = new URLSearchParams(window.location.search).get(REDIRECT_PARAM);
    router.replace(sanitizeRedirect(target, homeFor(user.roles)));
  }, [isAuthenticated, user, router]);

  return null;
}

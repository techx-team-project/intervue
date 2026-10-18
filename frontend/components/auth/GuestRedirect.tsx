'use client';

import { REDIRECT_PARAM } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeRedirect } from '@/utils/redirect';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GuestRedirect() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const target = new URLSearchParams(window.location.search).get(REDIRECT_PARAM);
    router.replace(sanitizeRedirect(target));
  }, [isAuthenticated, router]);

  return null;
}

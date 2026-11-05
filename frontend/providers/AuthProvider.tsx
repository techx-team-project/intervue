'use client';

import { refreshSession } from '@/apiRequest/http';
import { getActivePortal } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { ReactNode, useEffect } from 'react';

type AuthProviderProps = { children: ReactNode };

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const portal = getActivePortal();
    const portalSession = useAuthStore.getState()[portal];
    if (portalSession.status !== 'idle') return;
    useAuthStore.getState().startLoading(portal);
    refreshSession()
      .then((session) => useAuthStore.getState().setSession(session, portal))
      .catch(() => useAuthStore.getState().clearSession(portal));
  }, []);

  return children;
}

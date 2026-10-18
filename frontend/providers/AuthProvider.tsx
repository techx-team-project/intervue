'use client';

import { refreshSession } from '@/apiRequest/http';
import { useAuthStore } from '@/store/auth.store';
import { ReactNode, useEffect } from 'react';

type AuthProviderProps = { children: ReactNode };

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const { status, startLoading, clearSession } = useAuthStore.getState();
    if (status !== 'idle') return;
    startLoading();
    refreshSession().catch(clearSession);
  }, []);

  return children;
}

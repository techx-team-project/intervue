'use client';

import { refreshSession } from '@/apiRequest/http';
import { useAuthStore } from '@/store/auth.store';
import { ReactNode, useEffect } from 'react';

type AuthProviderProps = { children: ReactNode };

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const { status, startLoading, clearSession, setSession } = useAuthStore.getState();
    if (status !== 'idle') return;
    startLoading();
    refreshSession().catch(() => {
      if (process.env.NODE_ENV === 'development') {
        setSession({
          accessToken: 'dev-mock-recruiter-token',
          user: {
            id: '838025',
            name: 'Nguyễn Minh Phúc',
            email: 'phuc.recruiter@intervue.vn',
            roles: ['RECRUITER'],
          },
        });
        return;
      }
      clearSession();
    });
  }, []);

  return children;
}

'use client';

import { useAuthStore } from '@/store/auth.store';
import type { RoleType } from '@/types/auth';

export function useAuth() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'idle' || status === 'loading',
    hasRole: (role: RoleType) => user?.roles.includes(role) ?? false,
  };
}

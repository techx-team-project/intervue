import type { AuthSession, AuthStatus, User } from '@/types/auth';
import { create } from 'zustand';

type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
  startLoading: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'idle',
  accessToken: null,
  user: null,
  startLoading: () => set({ status: 'loading' }),
  setSession: ({ accessToken, user }) => set({ status: 'authenticated', accessToken, user }),
  clearSession: () => set({ status: 'unauthenticated', accessToken: null, user: null }),
}));

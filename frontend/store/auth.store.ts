import { getActivePortal } from '@/lib/auth-portal';
import type { AuthSession, AuthStatus, User } from '@/types/auth';
import { create } from 'zustand';

type PortalSession = {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
};

type AuthState = {
  candidate: PortalSession;
  recruiter: PortalSession;
  admin: PortalSession;

  // Active portal projection for backwards-compatibility
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;

  startLoading: (portal?: 'candidate' | 'recruiter' | 'admin') => void;
  setSession: (session: AuthSession, portal?: 'candidate' | 'recruiter' | 'admin') => void;
  clearSession: (portal?: 'candidate' | 'recruiter' | 'admin') => void;
};

const initialPortalSession: PortalSession = {
  status: 'idle',
  accessToken: null,
  user: null,
};

export const useAuthStore = create<AuthState>()((set) => ({
  candidate: { ...initialPortalSession },
  recruiter: { ...initialPortalSession },
  admin: { ...initialPortalSession },

  status: 'idle',
  accessToken: null,
  user: null,

  startLoading: (portal) => {
    const target = portal ?? getActivePortal();
    set((state) => ({
      ...state,
      [target]: { ...state[target], status: 'loading' },
      status: 'loading',
    }));
  },

  setSession: (session, portal) => {
    const target = portal ?? getActivePortal();
    set((state) => ({
      ...state,
      [target]: {
        status: 'authenticated',
        accessToken: session.accessToken,
        user: session.user,
      },
      status: 'authenticated',
      accessToken: session.accessToken,
      user: session.user,
    }));
  },

  clearSession: (portal) => {
    const target = portal ?? getActivePortal();
    set((state) => ({
      ...state,
      [target]: {
        status: 'unauthenticated',
        accessToken: null,
        user: null,
      },
      status: 'unauthenticated',
      accessToken: null,
      user: null,
    }));
  },
}));

import { ROLES } from '@/constants/auth';

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export type User = {
  id: number;
  email: string;
  name: string;
  phone?: string;
  emailVerified: boolean;
  roles: RoleType[];
  createdAt: string;
};

export type AuthSession = {
  accessToken: string;
  user: User;
};

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

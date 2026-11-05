import { ROLES } from '@/constants/auth';

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export type User = {
  id: number;
  email: string;
  name: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  deleteRequestedAt?: string | null;
  roles: RoleType[];
  createdAt: string;
};

export type AuthSession = {
  accessToken: string;
  user: User;
};

export type AuthResponsePayload = {
  accessToken?: string;
  user?: User;
  requiresTwoFactor?: boolean;
  tempToken?: string;
};

export type RecruiterAuthPayload = {
  accessToken?: string;
  recruiter?: Omit<User, 'roles'>;
  requiresTwoFactor?: boolean;
  tempToken?: string;
};

export type AdminQueueCounts = {
  pendingVerifications: number;
  totalUsers: number;
  totalRecruiters: number;
  activeCompanies: number;
};

export type AdminProfile = {
  id: number;
  name: string;
  email: string;
  roles: RoleType[];
  twoFactorEnabled: boolean;
  lastLoginAt?: string | null;
  queueCounts?: AdminQueueCounts;
};

export type AdminAuthPayload = {
  accessToken?: string;
  admin?: AdminProfile;
  requiresTwoFactor?: boolean;
  requiresTwoFactorSetup?: boolean;
  tempToken?: string;
};

export type TwoFactorChallengePayload = {
  tempToken: string;
  code: string;
  trustDevice?: boolean;
};

export type TrustedDevice = {
  id: number;
  deviceName: string;
  ipAddress: string;
  lastUsedAt: string;
  expiresAt: string;
  current: boolean;
};

export type TwoFactorStatus = {
  enabled: boolean;
  confirmedAt?: string | null;
  remainingBackupCodes: number;
};

export type TwoFactorSetup = {
  secret: string;
  totpUri: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
};

export type UserProfilePatch = Omit<User, 'roles'>;

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

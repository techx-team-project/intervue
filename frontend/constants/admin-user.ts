import type { BadgeProps } from '@/components/ui/Badge';
import type { AdminPermission } from '@/types/admin';
import type {
  AdminUserActivityKind,
  AdminUserLinkedRecordKey,
  AdminUserRestrictionKind,
  AdminUserSegment,
  AdminUserSort,
  AdminUserStatus,
} from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import {
  BadgeCheck,
  Ban,
  Bookmark,
  Building2,
  CircleCheck,
  FileText,
  KeyRound,
  LogOut,
  Lock,
  MailCheck,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Send,
  UserMinus,
  UserPlus,
  Users,
  Unlock,
  RotateCcw,
  UserX,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const USER_STATUS_META: Record<AdminUserStatus, { label: string; variant: NonNullable<BadgeProps['variant']> }> =
  {
    ACTIVE: { label: 'Active', variant: 'success' },
    BANNED: { label: 'Banned', variant: 'danger' },
    PENDING_DELETION: { label: 'Pending deletion', variant: 'warning' },
    DELETED: { label: 'Deleted', variant: 'default' },
  };

export const RESTRICTION_META: Record<
  AdminUserRestrictionKind,
  { verb: string; liftVerb: string; status: AdminUserStatus; blurb: string }
> = {
  ban: {
    verb: 'Ban',
    liftVerb: 'Unban',
    status: 'BANNED',
    blurb: 'Policy enforcement. Sign-in is blocked and the account’s public content is hidden.',
  },
};

export const USER_ROLE_META: Record<RoleType, { label: string; chipClassName: string }> = {
  CANDIDATE: { label: 'Candidate', chipClassName: 'bg-sky-50 text-sky-700 ring-sky-200' },
  RECRUITER: { label: 'Recruiter', chipClassName: 'bg-violet-50 text-violet-700 ring-violet-200' },
  ADMIN: { label: 'Admin', chipClassName: 'bg-amber-50 text-amber-800 ring-amber-300' },
};

export const USER_SEGMENTS: { segment: AdminUserSegment; label: string }[] = [
  { segment: 'all', label: 'All' },
  { segment: 'candidates', label: 'Candidates' },
  { segment: 'recruiters', label: 'Recruiters' },
  { segment: 'admins', label: 'Admins' },
  { segment: 'banned', label: 'Banned' },
  { segment: 'unverified', label: 'Unverified email' },
  { segment: 'pendingDeletion', label: 'Pending deletion' },
];

export const USER_PAGE_SIZE = 20;

// One request feeds the whole screen because filtering, sorting, paging and the
// stat tiles are still computed client-side. 100 is the API's hard cap, so the
// list silently stops at 100 accounts until the server-side filters are wired.
export const USER_FETCH_SIZE = 100;

export const USER_SORT_OPTIONS: { value: AdminUserSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'lastSignIn', label: 'Recently active' },
  { value: 'lastRestricted', label: 'Recently restricted' },
];

export const RESTRICTION_REASON_PRESETS: Record<AdminUserRestrictionKind, string[]> = {
  ban: [
    'Fake or impersonated account',
    'Recruitment scam or fraudulent job posting',
    'Harassment or abusive behaviour',
    'Repeated spam after a warning',
    'Scraping or reselling candidate data',
  ],
};

export const LINKED_RECORD_ICON: Record<AdminUserLinkedRecordKey, LucideIcon> = {
  identityVerification: BadgeCheck,
  companyVerification: Building2,
  jobPosts: FileText,
  applications: Users,
  savedCandidates: Bookmark,
};

export const ACTIVITY_ICON: Record<AdminUserActivityKind, LucideIcon> = {
  accountCreated: UserPlus,
  emailVerified: MailCheck,
  roleGranted: ShieldCheck,
  roleRevoked: UserMinus,
  locked: Lock,
  unlocked: Unlock,
  banned: Ban,
  unbanned: CircleCheck,
  sessionsRevoked: LogOut,
  twoFactorReset: ShieldOff,
  passwordResetSent: Send,
  tokenReuseDetected: ShieldAlert,
  deletionRequested: UserX,
  deletionCancelled: RotateCcw,
  restored: RotateCcw,
};

export const ACTIVITY_TONE: Record<AdminUserActivityKind, string> = {
  accountCreated: 'bg-slate-100 text-slate-600',
  emailVerified: 'bg-emerald-50 text-emerald-600',
  roleGranted: 'bg-violet-50 text-violet-600',
  roleRevoked: 'bg-amber-50 text-amber-700',
  locked: 'bg-amber-50 text-amber-700',
  unlocked: 'bg-emerald-50 text-emerald-600',
  banned: 'bg-rose-50 text-rose-600',
  unbanned: 'bg-emerald-50 text-emerald-600',
  sessionsRevoked: 'bg-sky-50 text-sky-600',
  twoFactorReset: 'bg-amber-50 text-amber-700',
  passwordResetSent: 'bg-sky-50 text-sky-600',
  tokenReuseDetected: 'bg-rose-50 text-rose-600',
  deletionRequested: 'bg-amber-50 text-amber-700',
  deletionCancelled: 'bg-emerald-50 text-emerald-600',
  restored: 'bg-emerald-50 text-emerald-600',
};

export const ADMIN_PERMISSION_META: Record<AdminPermission, { label: string; description: string }> = {
  'verification.identity': { label: 'Identity verification', description: 'Review eKYC submissions from candidates.' },
  'verification.business': {
    label: 'Business verification',
    description: 'Review business licences and company changes.',
  },
  'moderation.jobs': { label: 'Job post moderation', description: 'Approve, reject and hide job posts.' },
  'moderation.reports': { label: 'Reports', description: 'Handle reported content and reported accounts.' },
  'users.manage': { label: 'User management', description: 'Search accounts, lock, unlock and revoke sessions.' },
  'users.admins': {
    label: 'Admin accounts',
    description: 'Create admin accounts and assign admin permissions.',
  },
  'catalogs.manage': { label: 'Catalogs', description: 'Positions, levels, skills, locations and minimum wage.' },
  'services.manage': { label: 'Services & pricing', description: 'Service packages, prices, credits and quotas.' },
  'finance.manage': { label: 'Finance', description: 'Orders, transactions, refunds and VAT invoices.' },
  'support.manage': { label: 'Support', description: 'Support tickets and consultation requests.' },
  'content.manage': { label: 'Content', description: 'Blog, FAQ, chatbot knowledge and announcements.' },
};

export const ADMIN_PERMISSION_ORDER = [
  'users.manage',
  'users.admins',
  'verification.identity',
  'verification.business',
  'moderation.jobs',
  'moderation.reports',
  'catalogs.manage',
  'services.manage',
  'finance.manage',
  'support.manage',
  'content.manage',
] as const satisfies readonly AdminPermission[];

export const SECURITY_ACTION_ICON = { passwordReset: KeyRound, twoFactorReset: ShieldOff, revokeSessions: LogOut };

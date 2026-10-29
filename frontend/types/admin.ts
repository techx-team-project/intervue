import type { LucideIcon } from 'lucide-react';

export type AdminPermission =
  | 'verification.business'
  | 'verification.identity'
  | 'moderation.jobs'
  | 'moderation.reports'
  | 'users.manage'
  | 'users.admins'
  | 'catalogs.manage'
  | 'services.manage'
  | 'finance.manage'
  | 'support.manage'
  | 'content.manage';

export type AdminQueueKey =
  | 'identityVerification'
  | 'businessVerification'
  | 'companyChanges'
  | 'jobPosts'
  | 'reports'
  | 'supportTickets'
  | 'consultationRequests'
  | 'unmatchedTransactions'
  | 'vatInvoices';

export type AdminQueueCounts = Partial<Record<AdminQueueKey, number>>;

export interface AdminNavItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  queue?: AdminQueueKey;
  permission?: AdminPermission;
  comingSoon?: boolean;
  children?: AdminNavItem[];
}

export interface AdminNavSection {
  id: string;
  title: string;
  tone?: 'default' | 'action';
  items: AdminNavItem[];
}

export interface AdminBreadcrumbEntry {
  label: string;
  href?: string;
}

// Kept out of the shared User type on purpose: that shape mirrors the API contract,
// and the backend does not expose a two-factor flag yet.
export interface AdminAccountState {
  twoFactorEnabled: boolean;
}

export interface AdminQueueSummary {
  key: AdminQueueKey;
  label: string;
  href: string;
  count: number;
}

export type AdminWorkItemKind =
  'identityVerification' | 'businessVerification' | 'companyChange' | 'jobPost' | 'report' | 'supportTicket';

export interface AdminWorkItemFact {
  label: string;
  value: string;
}

export interface AdminWorkItem {
  id: string;
  kind: AdminWorkItemKind;
  subject: string;
  context: string;
  waitingLabel: string;
  submittedAt: string;
  facts: AdminWorkItemFact[];
}

export interface AdminPlatformMetric {
  key: string;
  label: string;
  value: string;
}

export type AdminAuditOutcome = 'approved' | 'rejected' | 'locked' | 'updated' | 'dismissed';

export interface AdminAuditEntry {
  id: string;
  actorName: string;
  actorRoleLabel: string;
  action: string;
  targetLabel: string;
  outcome: AdminAuditOutcome;
  reason?: string;
  at: string;
}

export interface AdminBannerSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  gradientClassName: string;
}

export type AdminHighlightTone = 'primary' | 'amber' | 'sky' | 'violet';

export type AdminHighlightKey = 'waiting' | 'oldest' | 'resolved' | 'autoApproved';

// No LucideIcon here: this object crosses the server/client boundary, and a React
// component cannot be serialised. The icon is looked up by key on the client.
export interface AdminHighlight {
  key: AdminHighlightKey;
  label: string;
  value: string;
  caption: string;
  tone: AdminHighlightTone;
}

export interface AdminDashboardData {
  banners: AdminBannerSlide[];
  highlights: AdminHighlight[];
  queues: AdminQueueSummary[];
  workItems: AdminWorkItem[];
  metrics: AdminPlatformMetric[];
  recentAudit: AdminAuditEntry[];
}

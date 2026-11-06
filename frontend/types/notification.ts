export type NotificationRealm = 'candidate' | 'recruiter' | 'admin';

export type NotificationCategory =
  'JOBS' | 'APPLICATIONS' | 'CONNECTIONS' | 'COMPANY' | 'ACCOUNT' | 'SECURITY' | 'MODERATION' | 'SYSTEM';

export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';

export type NotificationType =
  | 'BUSINESS_DOCUMENT_APPROVED'
  | 'BUSINESS_DOCUMENT_REJECTED'
  | 'BUSINESS_DOCUMENT_MORE_INFO'
  | 'BUSINESS_DOCUMENT_REVOKED'
  | 'BUSINESS_DOCUMENT_EXPIRED'
  | 'PUBLISH_RIGHT_LOST'
  | 'COMPANY_VERIFIED'
  | 'COMPANY_MEMBERSHIP_CHANGED'
  | 'AGREEMENT_REVIEWED'
  | 'ACCOUNT_RESTRICTED'
  | 'ACCOUNT_RESTRICTION_LIFTED'
  | 'ACCOUNT_ROLES_CHANGED'
  | 'SECURITY_NEW_DEVICE_LOGIN'
  | 'SECURITY_SETTING_CHANGED'
  | 'ADMIN_REVIEW_QUEUE_ITEM'
  | 'ANNOUNCEMENT';

export interface NotificationListResource {
  id: number;
  type: NotificationType;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  summary: string;
  actionUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
  readAt: string | null;
  seenAt: string | null;
}

export interface NotificationDetailResource extends NotificationListResource {
  bodyMarkdown: string | null;
}

export interface UnreadCountResource {
  total: number;
  byCategory: Partial<Record<NotificationCategory, number>>;
}

export interface NotificationPreferenceResource {
  category: NotificationCategory;
  inApp: boolean;
  email: boolean;
  mandatory: boolean;
}

export type NotificationCategoryFilter = NotificationCategory | 'ALL';

export type BroadcastAudience = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export type BroadcastStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED';

export interface AdminBroadcastResource {
  id: number;
  audience: BroadcastAudience;
  status: BroadcastStatus;
  severity: NotificationSeverity;
  title: string;
  summary: string;
  bodyMarkdown: string;
  actionUrl: string | null;
  actionLabel: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  deliveredCount: number;
  readCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudiencePreviewResource {
  audience: BroadcastAudience;
  estimatedRecipients: number;
}

export interface BroadcastInput {
  audience: BroadcastAudience;
  severity: NotificationSeverity;
  title: string;
  summary: string;
  bodyMarkdown: string;
  actionUrl?: string | null;
  actionLabel?: string | null;
  scheduledAt?: string | null;
}

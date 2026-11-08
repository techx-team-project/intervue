import type {
  NotificationCategory,
  NotificationCategoryFilter,
  NotificationRealm,
  NotificationSeverity,
} from '@/types/notification';

export const NOTIFICATION_PAGE_SIZE = 10;

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  JOBS: 'Jobs',
  APPLICATIONS: 'Applications',
  CONNECTIONS: 'Connect',
  COMPANY: 'Company',
  ACCOUNT: 'Account',
  SECURITY: 'Security',
  MODERATION: 'Moderation',
  SYSTEM: 'System',
};

export const NOTIFICATION_CATEGORY_LABELS_VI: Record<NotificationCategory, string> = {
  JOBS: 'Jobs',
  APPLICATIONS: 'Applications',
  CONNECTIONS: 'Connections',
  COMPANY: 'Company',
  ACCOUNT: 'Account',
  SECURITY: 'Security',
  MODERATION: 'Moderation',
  SYSTEM: 'System',
};

const TABS_BY_REALM: Record<NotificationRealm, NotificationCategoryFilter[]> = {
  candidate: ['ALL', 'JOBS', 'APPLICATIONS', 'ACCOUNT', 'SECURITY', 'SYSTEM'],
  recruiter: ['ALL', 'JOBS', 'APPLICATIONS', 'CONNECTIONS', 'COMPANY', 'SECURITY', 'SYSTEM'],
  admin: ['ALL', 'MODERATION', 'ACCOUNT', 'SECURITY', 'SYSTEM'],
};

export function notificationTabsFor(realm: NotificationRealm): NotificationCategoryFilter[] {
  return TABS_BY_REALM[realm];
}

export function notificationTabLabel(filter: NotificationCategoryFilter, vietnamese = false): string {
  if (filter === 'ALL') return 'All';
  return vietnamese ? NOTIFICATION_CATEGORY_LABELS_VI[filter] : NOTIFICATION_CATEGORY_LABELS[filter];
}

export const SEVERITY_TONE_CLASSES: Record<NotificationSeverity, string> = {
  DANGER: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60',
  INFO: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60',
  SUCCESS:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
  WARNING:
    'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
};

export const RECRUITER_TAG_CLASSES = 'bg-amber-50 text-amber-800 border-amber-200/90';

export interface NotificationCopy {
  detailsHeading: string;
  back: string;
  backToList: string;
  notFoundTitle: string;
  notFoundBody: string;
  loadError: string;
  retry: string;
  empty: string;
  emptyFiltered: string;
  newBadge: string;
  tagFallback: string;
  supportIntro: string;
  hotlineLabel: string;
  clearTimeFilter: string;
}

const COPY_EN: NotificationCopy = {
  detailsHeading: 'Notification details',
  back: 'Back',
  backToList: 'Back to notifications',
  notFoundTitle: 'Notification not found',
  notFoundBody: 'The notification you are looking for may have been removed or does not exist.',
  loadError: 'Could not load notifications',
  retry: 'Try again',
  empty: 'No notifications found in this category',
  emptyFiltered: 'No notifications found matching this filter',
  newBadge: 'New',
  tagFallback: 'Notification',
  supportIntro: 'For any inquiries or assistance, please contact your account manager or our official support desk:',
  hotlineLabel: 'Customer Hotline',
  clearTimeFilter: 'Clear time filter',
};

const COPY_VI: NotificationCopy = {
  detailsHeading: 'Notification details',
  back: 'Back',
  backToList: 'Back to notifications',
  notFoundTitle: 'Notification not found',
  notFoundBody: 'The notification you are looking for may have been removed or does not exist.',
  loadError: 'Could not load notifications',
  retry: 'Try again',
  empty: 'No notifications in this section yet',
  emptyFiltered: 'No notifications match the filter',
  newBadge: 'New',
  tagFallback: 'Notification',
  supportIntro: 'If you need help, please contact InterVue customer support:',
  hotlineLabel: 'Hotline',
  clearTimeFilter: 'Clear time filter',
};

export function isVietnameseRealm(realm: NotificationRealm): boolean {
  return realm === 'candidate';
}

export function notificationCopy(realm: NotificationRealm): NotificationCopy {
  return isVietnameseRealm(realm) ? COPY_VI : COPY_EN;
}

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
  JOBS: 'Việc làm',
  APPLICATIONS: 'Ứng tuyển',
  CONNECTIONS: 'Kết nối',
  COMPANY: 'Doanh nghiệp',
  ACCOUNT: 'Tài khoản',
  SECURITY: 'Bảo mật',
  MODERATION: 'Kiểm duyệt',
  SYSTEM: 'Hệ thống',
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
  if (filter === 'ALL') return vietnamese ? 'Tất cả' : 'All';
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
  detailsHeading: 'Chi tiết thông báo',
  back: 'Quay lại',
  backToList: 'Về danh sách thông báo',
  notFoundTitle: 'Không tìm thấy thông báo',
  notFoundBody: 'Thông báo bạn đang tìm có thể đã bị gỡ hoặc không tồn tại.',
  loadError: 'Không tải được thông báo',
  retry: 'Thử lại',
  empty: 'Chưa có thông báo nào trong mục này',
  emptyFiltered: 'Không có thông báo nào khớp bộ lọc',
  newBadge: 'Mới',
  tagFallback: 'Thông báo',
  supportIntro: 'Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng của InterVue:',
  hotlineLabel: 'Tổng đài',
  clearTimeFilter: 'Xoá bộ lọc thời gian',
};

export function isVietnameseRealm(realm: NotificationRealm): boolean {
  return realm === 'candidate';
}

export function notificationCopy(realm: NotificationRealm): NotificationCopy {
  return isVietnameseRealm(realm) ? COPY_VI : COPY_EN;
}

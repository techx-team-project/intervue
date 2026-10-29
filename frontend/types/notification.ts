export type NotificationCategory = 'all' | 'jobs' | 'applications' | 'connections' | 'system';

export type NotificationTarget = 'recruiter' | 'admin';

export interface NotificationDetailSection {
  heading?: string;
  items?: string[];
  paragraph?: string;
}

export interface AppNotification {
  id: string;
  target: NotificationTarget;
  category: NotificationCategory;
  tag: string;
  tagTone?: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  summary: string;
  createdAt: string;
  displayDate: string;
  isRead: boolean;
  intro?: string;
  sections?: NotificationDetailSection[];
  footerContact?: {
    hotline?: string;
    email?: string;
  };
  actionUrl?: string;
  actionLabel?: string;
}

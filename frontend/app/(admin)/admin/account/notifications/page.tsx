import NotificationPreferencesView from '@/components/common/NotificationPreferencesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification preferences | InterVue Admin',
  description: 'Choose which notifications reach your administrator account',
};

export default function AdminNotificationPreferencesPage() {
  return <NotificationPreferencesView realm="admin" />;
}

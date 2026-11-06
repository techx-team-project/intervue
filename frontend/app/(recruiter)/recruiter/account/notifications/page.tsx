import NotificationPreferencesView from '@/components/common/NotificationPreferencesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification preferences | InterVue',
  description: 'Choose which notifications reach your employer account',
};

export default function RecruiterNotificationPreferencesPage() {
  return <NotificationPreferencesView realm="recruiter" />;
}

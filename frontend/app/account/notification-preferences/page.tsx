import NotificationPreferencesView from '@/components/common/NotificationPreferencesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification preferences | InterVue',
  description: 'Choose which notifications you want to receive from InterVue',
};

export default function CandidateNotificationPreferencesPage() {
  return <NotificationPreferencesView realm="candidate" />;
}

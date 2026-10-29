import NotificationsListView from '@/components/common/NotificationsListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Notifications | InterVue Recruiter',
  description: 'View all announcements, policy updates, and recruitment notifications',
};

export default function RecruiterNotificationsPage() {
  return (
    <NotificationsListView target="recruiter" baseRoute="/recruiter/notifications" pageTitle="System Notifications" />
  );
}

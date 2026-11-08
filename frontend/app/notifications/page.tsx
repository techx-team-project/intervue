import NotificationsListView from '@/components/common/NotificationsListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | InterVue',
  description: 'See notifications about your applications, jobs and account on InterVue',
};

export default function CandidateNotificationsPage() {
  return <NotificationsListView realm="candidate" baseRoute="/notifications" pageTitle="Your notifications" />;
}

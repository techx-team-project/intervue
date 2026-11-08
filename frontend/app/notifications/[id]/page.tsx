import NotificationDetailView from '@/components/common/NotificationDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification details | InterVue',
  description: 'Notification details',
};

export default function CandidateNotificationDetailPage() {
  return <NotificationDetailView realm="candidate" baseRoute="/notifications" />;
}

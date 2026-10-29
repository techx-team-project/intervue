import NotificationDetailView from '@/components/common/NotificationDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification Details | InterVue Recruiter',
  description: 'Detailed notification content and instructions',
};

export default function RecruiterNotificationDetailPage() {
  return <NotificationDetailView target="recruiter" baseRoute="/recruiter/notifications" />;
}

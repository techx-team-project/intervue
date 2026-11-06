import NotificationDetailView from '@/components/common/NotificationDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification Details | InterVue Admin',
  description: 'Detailed administrative notification content',
};

export default function AdminNotificationDetailPage() {
  return <NotificationDetailView realm="admin" baseRoute="/admin/notifications" />;
}

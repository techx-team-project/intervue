import NotificationsListView from '@/components/common/NotificationsListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Notifications | InterVue Admin',
  description: 'View administrative alerts, moderation notices, and system announcements',
};

export default function AdminNotificationsPage() {
  return (
    <NotificationsListView target="admin" baseRoute="/admin/notifications" pageTitle="System Alerts & Notifications" />
  );
}

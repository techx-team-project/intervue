import AdminBroadcastListView from '@/components/admin/notifications/AdminBroadcastListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Announcements | InterVue Admin',
  description: 'Broadcast platform announcements to candidates, recruiters and administrators.',
};

export default function AdminAnnouncementsPage() {
  return <AdminBroadcastListView />;
}

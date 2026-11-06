import AdminBroadcastEditor from '@/components/admin/notifications/AdminBroadcastEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New announcement | InterVue Admin',
  description: 'Compose a platform announcement.',
};

export default function AdminAnnouncementCreatePage() {
  return <AdminBroadcastEditor broadcastId={null} />;
}

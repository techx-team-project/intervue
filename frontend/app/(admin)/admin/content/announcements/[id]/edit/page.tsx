import AdminBroadcastEditor from '@/components/admin/notifications/AdminBroadcastEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit announcement | InterVue Admin',
  description: 'Edit a platform announcement before it is delivered.',
};

interface AdminAnnouncementEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAnnouncementEditPage({ params }: AdminAnnouncementEditPageProps) {
  const { id } = await params;
  return <AdminBroadcastEditor broadcastId={Number(id)} />;
}

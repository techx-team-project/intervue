import AdminBroadcastDetailView from '@/components/admin/notifications/AdminBroadcastDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Announcement details | InterVue Admin',
  description: 'Review an announcement, its delivery status and reach.',
};

interface AdminAnnouncementDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAnnouncementDetailPage({ params }: AdminAnnouncementDetailPageProps) {
  const { id } = await params;
  return <AdminBroadcastDetailView broadcastId={Number(id)} />;
}

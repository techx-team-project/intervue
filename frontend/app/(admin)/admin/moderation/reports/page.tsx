import AdminReportsPageClient from '@/components/admin/moderation/AdminReportsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports & Content Moderation | InterVue Admin',
  description: 'Review user reports on conversations, take actions, and configure content filtering patterns.',
};

export default function AdminReportsPage() {
  return <AdminReportsPageClient />;
}

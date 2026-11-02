import AdminUserDetailPageClient from '@/components/admin/users/detail/AdminUserDetailPageClient';
import { notFound } from 'next/navigation';

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) notFound();

  return <AdminUserDetailPageClient userId={userId} />;
}

import AdminUserDetailView from '@/components/admin/users/detail/AdminUserDetailView';
import { fetchAdminUserDetail, fetchAdminUserList } from '@/mocks/admin-user.mock';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params;
  const [detail, listData] = await Promise.all([fetchAdminUserDetail(Number(id)), fetchAdminUserList()]);

  if (!detail) notFound();

  return <AdminUserDetailView detail={detail} listData={listData} />;
}

import AdminUsersListView from '@/components/admin/users/AdminUsersListView';
import { fetchAdminUserList } from '@/mocks/admin-user.mock';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const data = await fetchAdminUserList();

  return <AdminUsersListView data={data} />;
}

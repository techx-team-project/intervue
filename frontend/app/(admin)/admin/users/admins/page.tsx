import AdminAccountsListView from '@/components/admin/users/admins/AdminAccountsListView';
import { fetchAdminAccountList } from '@/mocks/admin-user.mock';

export const dynamic = 'force-dynamic';

export default async function AdminAccountsPage() {
  const data = await fetchAdminAccountList();

  return <AdminAccountsListView data={data} />;
}

import AdminShell from '@/components/admin/AdminShell';
import RequireAuth from '@/components/auth/RequireAuth';
import { ROLES } from '@/constants/auth';
import { getAdminAccountState } from '@/mocks/admin-account.mock';
import { getAdminQueueCounts } from '@/mocks/admin-dashboard.mock';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const queueCounts = getAdminQueueCounts();
  const account = getAdminAccountState();

  return (
    <RequireAuth roles={[ROLES.ADMIN]}>
      <AdminShell queueCounts={queueCounts} account={account}>
        {children}
      </AdminShell>
    </RequireAuth>
  );
}

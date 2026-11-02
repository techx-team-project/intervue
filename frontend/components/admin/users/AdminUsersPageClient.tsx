'use client';

import { adminUserApi } from '@/apiRequest/admin-user';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminUsersListView from '@/components/admin/users/AdminUsersListView';
import { USER_FETCH_SIZE } from '@/constants/admin-user';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';

export default function AdminUsersPageClient() {
  const { user } = useAuth();

  const load = useCallback(() => adminUserApi.getUsers({ size: USER_FETCH_SIZE }), []);
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminUsersListView users={data.items} currentAdminId={user?.id ?? 0} />}
    </AdminDataGate>
  );
}

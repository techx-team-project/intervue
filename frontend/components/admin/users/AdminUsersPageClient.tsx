'use client';

import { adminUserApi } from '@/apiRequest/admin-user';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminUsersListView from '@/components/admin/users/AdminUsersListView';
import { USER_PAGE_SIZE } from '@/constants/admin-user';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';

export default function AdminUsersPageClient() {
  const { user } = useAuth();

  const load = useCallback(
    () =>
      Promise.all([
        adminUserApi.getUserSummary(),
        adminUserApi.getUsers({ page: 0, size: USER_PAGE_SIZE, sort: 'createdAt,desc' }),
      ]),
    [],
  );
  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && (
        <AdminUsersListView initialSummary={data[0]} initialUsersPage={data[1]} currentAdminId={user?.id ?? 0} />
      )}
    </AdminDataGate>
  );
}

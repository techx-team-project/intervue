'use client';

import { adminUserApi } from '@/apiRequest/admin-user';
import AdminDataGate from '@/components/admin/AdminDataGate';
import AdminUserDetailView from '@/components/admin/users/detail/AdminUserDetailView';
import { USER_FETCH_SIZE } from '@/constants/admin-user';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useAuth } from '@/hooks/useAuth';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';

interface AdminUserDetailPageClientProps {
  userId: number;
}

export default function AdminUserDetailPageClient({ userId }: AdminUserDetailPageClientProps) {
  const { user } = useAuth();

  const load = useCallback(
    () => Promise.all([adminUserApi.getUserDetail(userId), adminUserApi.getUsers({ size: USER_FETCH_SIZE })]),
    [userId],
  );
  const { data, status, error, reload } = useAdminResource(load);

  if (status === 'error' && error?.status === 404) {
    notFound();
  }

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      {data && <AdminUserDetailView detail={data[0]} allUsers={data[1].items} currentAdminId={user?.id ?? 0} />}
    </AdminDataGate>
  );
}

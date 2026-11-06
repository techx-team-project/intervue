'use client';

import { blogApi } from '@/apiRequest/blog';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';
import AdminBlogEditor from './AdminBlogEditor';

export function AdminBlogCreatePageClient() {
  const load = useCallback(async () => {
    const categories = await blogApi.getCategories();
    return { categories };
  }, []);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminBlogEditor categories={data?.categories ?? []} />
    </AdminDataGate>
  );
}

export default AdminBlogCreatePageClient;

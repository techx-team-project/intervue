'use client';

import { blogApi } from '@/apiRequest/blog';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';
import { AdminBlogListView } from './AdminBlogListView';

export function AdminBlogPageClient() {
  const load = useCallback(async () => {
    const [summary, page, categories] = await Promise.all([
      blogApi.getAdminSummary(),
      blogApi.searchAdmin({ page: 0, size: 20 }),
      blogApi.getCategories(),
    ]);
    return { summary, page, categories };
  }, []);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminBlogListView
        initialSummary={data?.summary}
        initialPage={data?.page}
        categories={data?.categories ?? []}
        onRefresh={reload}
      />
    </AdminDataGate>
  );
}

export default AdminBlogPageClient;

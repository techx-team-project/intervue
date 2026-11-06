'use client';

import { blogApi } from '@/apiRequest/blog';
import AdminDataGate from '@/components/admin/AdminDataGate';
import { useAdminResource } from '@/hooks/useAdminResource';
import { useCallback } from 'react';
import AdminBlogEditor from './AdminBlogEditor';

interface AdminBlogEditPageClientProps {
  id: number;
}

export function AdminBlogEditPageClient({ id }: AdminBlogEditPageClientProps) {
  const load = useCallback(async () => {
    const [post, categories] = await Promise.all([blogApi.getAdminDetail(id), blogApi.getCategories()]);
    return { post, categories };
  }, [id]);

  const { data, status, error, reload } = useAdminResource(load);

  return (
    <AdminDataGate status={status} error={error} onRetry={reload}>
      <AdminBlogEditor initialPost={data?.post ?? undefined} categories={data?.categories ?? []} />
    </AdminDataGate>
  );
}

export default AdminBlogEditPageClient;

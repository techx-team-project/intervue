import AdminBlogEditPageClient from '@/components/admin/content/blog/editor/AdminBlogEditPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết | InterVue Admin',
  description: 'Chỉnh sửa bài viết cẩm nang nghề nghiệp.',
};

interface AdminBlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: AdminBlogEditPageProps) {
  const { id } = await params;
  return <AdminBlogEditPageClient id={Number(id)} />;
}

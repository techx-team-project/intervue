import AdminBlogEditPageClient from '@/components/admin/content/blog/editor/AdminBlogEditPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Article | InterVue Admin',
  description: 'Edit career guide article content and metadata.',
};

interface AdminBlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: AdminBlogEditPageProps) {
  const { id } = await params;
  return <AdminBlogEditPageClient id={Number(id)} />;
}

import AdminBlogCreatePageClient from '@/components/admin/content/blog/editor/AdminBlogCreatePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Article | InterVue Admin',
  description: 'Draft and publish new career guidance articles and resources.',
};

export default function AdminBlogCreatePage() {
  return <AdminBlogCreatePageClient />;
}

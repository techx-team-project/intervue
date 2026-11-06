import AdminBlogPageClient from '@/components/admin/content/blog/AdminBlogPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Management | InterVue Admin',
  description: 'Manage career guide articles, interview preparation resources, and editorial publications.',
};

export default function AdminBlogPage() {
  return <AdminBlogPageClient />;
}

import AdminBlogCreatePageClient from '@/components/admin/content/blog/editor/AdminBlogCreatePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viết bài Cẩm nang mới | InterVue Admin',
  description: 'Tạo và xuất bản bài viết cẩm nang nghề nghiệp mới.',
};

export default function AdminBlogCreatePage() {
  return <AdminBlogCreatePageClient />;
}

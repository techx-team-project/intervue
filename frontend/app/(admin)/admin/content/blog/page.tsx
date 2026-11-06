import AdminBlogPageClient from '@/components/admin/content/blog/AdminBlogPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Blog & Cẩm Nang Nghề Nghiệp | InterVue Admin',
  description: 'Quản trị các bài viết cẩm nang nghề nghiệp, bí quyết phỏng vấn và tính lương.',
};

export default function AdminBlogPage() {
  return <AdminBlogPageClient />;
}

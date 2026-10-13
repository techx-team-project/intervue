import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BlogHubView from '@/components/blog/BlogHubView';
import { getAllBlogArticles, BLOG_CATEGORIES } from '@/mocks/blog.mock';

export const metadata: Metadata = {
  title: 'Cẩm Nang Nghề Nghiệp - Bí Quyết Tìm Việc & Lương Thưởng | InterVue',
  description:
    'Khám phá cẩm nang nghề nghiệp toàn diện: Định hướng sự nghiệp, bí quyết viết CV chuẩn ATS, phỏng vấn, công cụ tính lương Gross sang Net 2026 và kiến thức chuyên ngành.',
  openGraph: {
    title: 'Cẩm Nang Nghề Nghiệp & Tuyển Dụng - InterVue',
    description: 'Định hướng sự nghiệp, bí quyết tìm việc, công cụ tính lương Gross sang Net chuẩn quy định mới.',
  },
};

export default function BlogPage() {
  const articles = getAllBlogArticles();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <BlogHubView initialArticles={articles} categories={BLOG_CATEGORIES} />
      </main>
      <Footer />
    </div>
  );
}

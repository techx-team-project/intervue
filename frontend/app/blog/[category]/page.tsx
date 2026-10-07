import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BlogCategoryView from '@/components/blog/BlogCategoryView';
import {
  BLOG_CATEGORIES,
  getBlogArticlesByCategory,
  getBlogCategoryBySlug,
  getAllBlogArticles,
} from '@/mocks/blog.mock';
import { BlogCategorySlug } from '@/types/blog';

interface BlogCategoryPageProps {
  params: Promise<{ category: string }>;
}

// Canonical slug mappings for aliases
const SLUG_ALIASES: Record<string, BlogCategorySlug> = {
  'huong-nghiep': 'dinh-huong-nghe-nghiep',
  'bi-quyet-tim-viec': 'bi-kip-tim-viec',
  'che-do-huong-luong': 'che-do-luong-thuong',
  'kien-thuc-nganh': 'kien-thuc-chuyen-nganh',
};

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const canonicalSlug = SLUG_ALIASES[category] || (category as BlogCategorySlug);
  const categoryMeta = getBlogCategoryBySlug(canonicalSlug);

  if (!categoryMeta) {
    return {
      title: 'Chuyên mục không tồn tại | InterVue',
    };
  }

  return {
    title: `${categoryMeta.name} - Cẩm Nang Nghề Nghiệp | InterVue`,
    description: categoryMeta.description,
    openGraph: {
      title: `${categoryMeta.name} - InterVue Blog`,
      description: categoryMeta.shortDesc,
    },
  };
}

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category } = await params;

  // Handle aliases with redirect
  if (SLUG_ALIASES[category]) {
    redirect(`/blog/${SLUG_ALIASES[category]}`);
  }

  const canonicalSlug = category as BlogCategorySlug;
  const categoryMeta = getBlogCategoryBySlug(canonicalSlug);

  if (!categoryMeta) {
    notFound();
  }

  const categoryArticles = getBlogArticlesByCategory(canonicalSlug);
  const allArticles = getAllBlogArticles();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <BlogCategoryView categoryMeta={categoryMeta} articles={categoryArticles} allArticles={allArticles} />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BlogCategoryView from '@/components/blog/BlogCategoryView';
import { blogApi } from '@/apiRequest/blog';
import { toBlogArticle, type BlogCategoryMeta, type BlogCategorySlug } from '@/types/blog';
import {
  BLOG_CATEGORIES,
  getBlogArticlesByCategory,
  getBlogCategoryBySlug,
  getAllBlogArticles,
} from '@/mocks/blog.mock';

export const revalidate = 60;

interface BlogCategoryPageProps {
  params: Promise<{ category: string }>;
}

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

  if (SLUG_ALIASES[category]) {
    redirect(`/blog/${SLUG_ALIASES[category]}`);
  }

  const canonicalSlug = category as BlogCategorySlug;
  const fallbackCategoryMeta = getBlogCategoryBySlug(canonicalSlug);

  if (!fallbackCategoryMeta) {
    notFound();
  }

  let categoryMeta: BlogCategoryMeta = fallbackCategoryMeta;
  let categoryArticles = getBlogArticlesByCategory(canonicalSlug);
  let allArticles = getAllBlogArticles();

  try {
    const [catRes, postRes, allPostRes] = await Promise.all([
      blogApi.getCategory(canonicalSlug),
      blogApi.search({ categorySlug: canonicalSlug, size: 50 }),
      blogApi.search({ size: 100 }),
    ]);

    if (catRes) {
      categoryMeta = {
        id: String(catRes.id),
        name: catRes.name,
        slug: catRes.slug,
        shortDesc: fallbackCategoryMeta.shortDesc || catRes.description?.slice(0, 90) || '',
        description: catRes.description || fallbackCategoryMeta.description || '',
        iconName: (fallbackCategoryMeta.iconName || 'Compass') as BlogCategoryMeta['iconName'],
        badge: fallbackCategoryMeta.badge || catRes.name,
        articleCount: catRes.articleCount,
        subFilters: fallbackCategoryMeta.subFilters || [],
        bannerGradient: catRes.bannerGradient || fallbackCategoryMeta.bannerGradient || 'from-blue-600 to-indigo-800',
        accentColor: catRes.accentColor || fallbackCategoryMeta.accentColor || '#2563eb',
      };
    }

    if (postRes && postRes.items && postRes.items.length > 0) {
      categoryArticles = postRes.items.map((p) => toBlogArticle(p, categoryMeta));
    }

    if (allPostRes && allPostRes.items && allPostRes.items.length > 0) {
      allArticles = allPostRes.items.map((p) => toBlogArticle(p));
    }
  } catch {
    // Graceful fallback to static mock data
  }

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

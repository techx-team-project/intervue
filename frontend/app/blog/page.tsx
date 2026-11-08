import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BlogHubView from '@/components/blog/BlogHubView';
import { blogApi } from '@/apiRequest/blog';
import { toBlogArticle, type BlogCategoryMeta } from '@/types/blog';
import { getAllBlogArticles, BLOG_CATEGORIES } from '@/mocks/blog.mock';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Career Guides - Job Search Tips & Salary | InterVue',
  description:
    'Explore complete career guides: career orientation, ATS-ready CV tips, interviews, 2026 Gross to Net salary tools and industry knowledge.',
  openGraph: {
    title: 'Career Guides & Hiring - InterVue',
    description: 'Career orientation, job search tips and Gross to Net salary tools based on the latest rules.',
  },
};

export default async function BlogPage() {
  let categories: BlogCategoryMeta[] = BLOG_CATEGORIES;
  let articles = getAllBlogArticles();

  try {
    const [catRes, postRes] = await Promise.all([blogApi.getCategories(), blogApi.search({ size: 100 })]);

    if (catRes && catRes.length > 0) {
      categories = catRes.map((cat) => {
        const fallback = BLOG_CATEGORIES.find((c) => c.slug === cat.slug);
        return {
          id: String(cat.id),
          name: cat.name,
          slug: cat.slug,
          shortDesc: fallback?.shortDesc || cat.description?.slice(0, 90) || '',
          description: cat.description || fallback?.description || '',
          iconName: (fallback?.iconName || 'Compass') as BlogCategoryMeta['iconName'],
          badge: fallback?.badge || cat.name,
          articleCount: cat.articleCount,
          subFilters: fallback?.subFilters || [],
          bannerGradient: cat.bannerGradient || fallback?.bannerGradient || 'from-emerald-600 to-teal-800',
          accentColor: cat.accentColor || fallback?.accentColor || '#00b14f',
        };
      });
    }

    if (postRes && postRes.items && postRes.items.length > 0) {
      articles = postRes.items.map((p) => toBlogArticle(p));
    }
  } catch {
    // Graceful fallback to static data
  }

  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <BlogHubView initialArticles={articles} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}

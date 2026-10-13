import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import BlogDetailView from '@/components/blog/detail/BlogDetailView';
import { getBlogArticleBySlug, getAllBlogArticles } from '@/mocks/blog.mock';

interface BlogArticleDetailPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Bài viết không tồn tại | InterVue',
    };
  }

  return {
    title: `${article.title} | InterVue`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} - Cẩm Nang Nghề Nghiệp InterVue`,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllBlogArticles();
  return articles.map((art) => ({
    category: art.categorySlug,
    slug: art.slug,
  }));
}

export default async function BlogArticleDetailPage({ params }: BlogArticleDetailPageProps) {
  const { category, slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Canonical category redirection if user accessed via mismatched category
  if (article.categorySlug && article.categorySlug !== category) {
    redirect(`/blog/${article.categorySlug}/${article.slug}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <BlogDetailView article={article} />
      </main>
      <Footer />
    </div>
  );
}

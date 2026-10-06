import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CareerDetailView from '@/components/career-orientation/detail/CareerDetailView';
import { getCareerArticleBySlug, getAllCareerArticles } from '@/mocks/career-orientation.mock';

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getCareerArticleBySlug(slug);

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
  const articles = getAllCareerArticles();
  return articles.map((art) => ({
    slug: art.slug,
  }));
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const article = getCareerArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <CareerDetailView article={article} />
      </main>
      <Footer />
    </div>
  );
}

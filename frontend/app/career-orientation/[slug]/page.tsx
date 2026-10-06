import { redirect } from 'next/navigation';
import { getBlogArticleBySlug } from '@/mocks/blog.mock';

interface CareerOrientationSlugRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function CareerOrientationSlugRedirectPage({ params }: CareerOrientationSlugRedirectProps) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (article && article.categorySlug) {
    redirect(`/blog/${article.categorySlug}/${article.slug}`);
  }

  redirect(`/blog/dinh-huong-nghe-nghiep/${slug}`);
}

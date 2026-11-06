import { CAREER_ARTICLES, CAREER_CATEGORIES, TRENDING_INDUSTRIES } from '@/constants/career-orientation';
import type { CareerArticle, CareerCategory, CareerTrendingIndustry } from '@/types/career';

export { CAREER_ARTICLES, CAREER_CATEGORIES, TRENDING_INDUSTRIES };

export function getAllCareerArticles(): CareerArticle[] {
  return CAREER_ARTICLES;
}

export function getCareerArticleBySlug(slug: string): CareerArticle | undefined {
  return CAREER_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedCareerArticles(currentArticleId: string, limit: number = 3): CareerArticle[] {
  return CAREER_ARTICLES.filter((a) => a.id !== currentArticleId).slice(0, limit);
}

export function getFeaturedCareerArticles(): CareerArticle[] {
  return CAREER_ARTICLES.filter((art) => art.isFeatured);
}

export function getTrendingCareerArticles(): CareerArticle[] {
  return CAREER_ARTICLES.filter((art) => art.isTrending);
}

export function getCareerCategories(): CareerCategory[] {
  return CAREER_CATEGORIES;
}

export function getTrendingIndustries(): CareerTrendingIndustry[] {
  return TRENDING_INDUSTRIES;
}

import {
  CareerArticle,
  CareerArticleSection,
  CareerArticleSubsection,
  CareerRelatedArticlePreview,
  CareerRoadmapStage,
  CareerSalaryTier,
  CareerSpecialization,
  CareerTableOfContentsItem,
  CareerTrendingIndustry,
} from './career';

export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type BlogCategorySlug =
  'dinh-huong-nghe-nghiep' | 'bi-kip-tim-viec' | 'che-do-luong-thuong' | 'kien-thuc-chuyen-nganh';

export interface BlogCategoryResource {
  id: number;
  slug: BlogCategorySlug;
  name: string;
  description: string;
  iconName: 'Compass' | 'Briefcase' | 'Calculator' | 'GraduationCap' | string;
  accentColor: string;
  bannerGradient: string;
  displayOrder: number;
  articleCount: number;
}

export interface BlogPostListResource {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  status: BlogPostStatus;
  isFeatured: boolean;
  readTimeMinutes: number;
  viewsCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categorySlug: BlogCategorySlug;
  categoryName: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  tags: string[];
}

export interface BlogPostDetailResource {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImagePublicId?: string;
  status: BlogPostStatus;
  isFeatured: boolean;
  readTimeMinutes: number;
  viewsCount: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: BlogCategoryResource;
  author: {
    id?: number;
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
}

export interface AdminBlogSummaryResource {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
}

export interface CreateBlogPostInput {
  categoryId: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  status?: BlogPostStatus;
  isFeatured?: boolean;
  readTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  authorName?: string;
  authorRole?: string;
  tags?: string[];
}

export interface UpdateBlogPostInput {
  categoryId: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  status?: BlogPostStatus;
  isFeatured?: boolean;
  readTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  authorName?: string;
  authorRole?: string;
  tags?: string[];
}

export interface BlogCategoryMeta {
  id: string;
  name: string;
  slug: BlogCategorySlug;
  shortDesc: string;
  description: string;
  iconName: 'Compass' | 'Briefcase' | 'Calculator' | 'GraduationCap';
  badge: string;
  articleCount: number;
  subFilters: string[];
  bannerGradient: string;
  accentColor: string;
}

export type BlogArticle = CareerArticle;
export type BlogArticleSection = CareerArticleSection;
export type BlogArticleSubsection = CareerArticleSubsection;
export type BlogRelatedArticlePreview = CareerRelatedArticlePreview;
export type BlogRoadmapStage = CareerRoadmapStage;
export type BlogSalaryTier = CareerSalaryTier;
export type BlogSpecialization = CareerSpecialization;
export type BlogTableOfContentsItem = CareerTableOfContentsItem;
export type BlogTrendingIndustry = CareerTrendingIndustry;

export interface GrossNetCalculationResult {
  grossSalary: number;
  netSalary: number;
  insurance: {
    social: number;
    health: number;
    unemployment: number;
    total: number;
  };
  employerCost: {
    social: number;
    health: number;
    unemployment: number;
    occupationalAccident: number;
    total: number;
    totalEmployerCost: number;
  };
  deductions: {
    personal: number;
    dependents: number;
    total: number;
  };
  taxableIncome: number;
  personalIncomeTax: number;
  taxTiers: {
    tier: number;
    rate: number;
    amount: number;
  }[];
}

export function toBlogArticle(
  res: BlogPostListResource | BlogPostDetailResource,
  categoryMeta?: BlogCategoryResource | BlogCategoryMeta,
): BlogArticle {
  const publishedDate = res.publishedAt
    ? new Date(res.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Recently updated';

  const viewsFormatted = res.viewsCount >= 1000 ? `${(res.viewsCount / 1000).toFixed(1)}K` : `${res.viewsCount || 0}`;

  const detailContent = 'content' in res ? (res as BlogPostDetailResource).content : '';
  const catSlug =
    'categorySlug' in res ? (res as BlogPostListResource).categorySlug : (res as BlogPostDetailResource).category?.slug;
  const catName =
    'categoryName' in res ? (res as BlogPostListResource).categoryName : (res as BlogPostDetailResource).category?.name;
  const authorName =
    'authorName' in res ? (res as BlogPostListResource).authorName : (res as BlogPostDetailResource).author?.name;
  const authorAvatar =
    'authorAvatar' in res ? (res as BlogPostListResource).authorAvatar : (res as BlogPostDetailResource).author?.avatar;
  const authorRole =
    'authorRole' in res ? (res as BlogPostListResource).authorRole : (res as BlogPostDetailResource).author?.role;

  return {
    id: String(res.id),
    slug: res.slug,
    title: res.title,
    category: categoryMeta?.name || catName || 'Career guide',
    categorySlug: catSlug || categoryMeta?.slug || 'dinh-huong-nghe-nghiep',
    excerpt: res.excerpt,
    coverImage:
      res.coverImageUrl ||
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    publishedAt: publishedDate,
    readTime: `${res.readTimeMinutes || 5} min read`,
    viewsCount: viewsFormatted,
    author: {
      name: authorName || 'InterVue Editorial Team',
      avatar:
        authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: authorRole || 'Editor',
    },
    isFeatured: res.isFeatured,
    tags: res.tags || [],
    tableOfContents: [],
    content: detailContent,
    sections: detailContent ? [] : [],
  };
}

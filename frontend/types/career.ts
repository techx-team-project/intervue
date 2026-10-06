export interface CareerTableOfContentsItem {
  id: string;
  title: string;
  level: 1 | 2;
}

export interface CareerSalaryTier {
  level: string;
  range: string;
  experience: string;
  description: string;
  popularRoles: string[];
  color?: string;
}

export interface CareerRoadmapStage {
  step: number;
  title: string;
  duration: string;
  salaryEstimate: string;
  skills: string[];
  keyResponsibilities: string[];
}

export interface CareerSpecialization {
  title: string;
  description: string;
  avgSalary: string;
  keySkills: string[];
  tools: string[];
  growthRate: string;
}

export interface CareerArticleSubsection {
  title: string;
  content: string[];
}

export interface CareerArticleSection {
  id: string;
  title: string;
  leadText?: string;
  paragraphs: string[];
  highlights?: string[];
  subsections?: CareerArticleSubsection[];
}

export interface CareerRelatedArticlePreview {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

export interface CareerArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  viewsCount: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio?: string;
  };
  isFeatured?: boolean;
  isTrending?: boolean;
  tags: string[];
  tableOfContents: CareerTableOfContentsItem[];
  salaryTiers?: CareerSalaryTier[];
  careerRoadmap?: CareerRoadmapStage[];
  specializations?: CareerSpecialization[];
  sections: CareerArticleSection[];
  relatedJobKeyword?: string;
  relatedArticles?: CareerRelatedArticlePreview[];
}

export interface CareerCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  count: number;
}

export interface CareerTrendingIndustry {
  id: string;
  name: string;
  demandRate: string;
  avgSalary: string;
  jobCount: number;
  badge: string;
  slug: string;
}

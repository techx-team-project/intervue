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

export type BlogCategorySlug =
  'dinh-huong-nghe-nghiep' | 'bi-kip-tim-viec' | 'che-do-luong-thuong' | 'kien-thuc-chuyen-nganh';

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

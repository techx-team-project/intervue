import type {
  EntitlementType,
  ServicePackageBadge,
  ServicePackageBenefit,
  ServicePackageSection,
  ServiceNeedKey,
} from '@/types/service-package';

export type ServicePackageStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface AdminServiceCategory {
  id: number;
  code: string;
  name: string;
  headline: string;
  description: string | null;
  needKey: ServiceNeedKey | null;
  displayOrder: number;
  isActive: boolean;
  packageCount: number;
  activePackageCount: number;
}

export interface ReorderServiceCategoriesInput {
  items: { id: number; displayOrder: number }[];
}

export interface AdminServicePackage {
  id: number;
  categoryId: number;
  categoryCode: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  currency: string;
  badge: ServicePackageBadge;
  vipRibbon: boolean;
  accentColor: string | null;
  heroImageUrl: string | null;
  validityDays: number | null;
  bonusCredits: number;
  oneTimePerCompany: boolean;
  status: ServicePackageStatus;
  displayOrder: number;
  benefits: ServicePackageBenefit[];
  sections: ServicePackageSection[];
}

export interface SaveServiceCategoryInput {
  code: string;
  name: string;
  headline: string;
  description?: string | null;
  needKey?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface SaveServicePackageInput {
  categoryId: number;
  slug: string;
  name: string;
  shortDescription?: string | null;
  price: number;
  currency?: string;
  badge: ServicePackageBadge;
  vipRibbon: boolean;
  accentColor?: string | null;
  heroImageUrl?: string | null;
  validityDays?: number | null;
  bonusCredits: number;
  oneTimePerCompany: boolean;
  status: ServicePackageStatus;
  displayOrder: number;
  benefits: {
    entitlementType: EntitlementType;
    quantity: number;
    tier: number;
    durationDays?: number | null;
    label: string;
  }[];
  sections: {
    heading: string;
    iconName?: string | null;
    accentColor?: string | null;
    body?: string | null;
    imageUrl?: string | null;
  }[];
}

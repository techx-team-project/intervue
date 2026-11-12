export type ServicePackageBadge = 'NONE' | 'NEW' | 'SPECIAL_OFFER';

export type EntitlementType =
  | 'JOB_POST_SLOT'
  | 'JOB_BOOST'
  | 'JOB_LABEL_URGENT'
  | 'JOB_LABEL_HOT'
  | 'JOB_HIGHLIGHT'
  | 'JOB_RETOP'
  | 'JOB_ALERT_PUSH'
  | 'AI_RESUME_MATCH'
  | 'AI_JD_GENERATE'
  | 'BRAND_PAGE'
  | 'FEATURED_COMPANY'
  | 'AD_SLOT_WEEK';

export type ServiceNeedKey = 'REACH' | 'HIGHLIGHT' | 'BRANDING';

export interface ServicePackageBenefit {
  entitlementType: EntitlementType;
  quantity: number;
  tier: number;
  durationDays: number | null;
  label: string;
}

export interface ServicePackageSection {
  heading: string;
  iconName: string | null;
  accentColor: string | null;
  body: string | null;
  imageUrl: string | null;
}

export interface ServicePackageCard {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  currency: string;
  badge: ServicePackageBadge;
  vipRibbon: boolean;
  accentColor: string | null;
  validityDays: number | null;
  oneTimePerCompany: boolean;
  benefits: ServicePackageBenefit[];
}

export interface ServiceCategory {
  id: number;
  code: string;
  name: string;
  headline: string;
  description: string | null;
  needKey: ServiceNeedKey | null;
  packages: ServicePackageCard[];
}

export interface ServiceCatalog {
  categories: ServiceCategory[];
}

export interface ServicePackageDetail extends Omit<ServicePackageCard, 'benefits'> {
  heroImageUrl: string | null;
  categoryCode: string;
  categoryName: string;
  categoryHeadline: string;
  benefits: ServicePackageBenefit[];
  sections: ServicePackageSection[];
}

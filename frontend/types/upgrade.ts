export type PricingPlanId = 'free' | 'verified' | 'pro' | 'education' | 'premium';

export interface PlanFeature {
  id: string;
  name: string;
  subText?: string;
  badge?: string;
  isSpecialRow?: boolean;
}

export type FeatureValueType =
  | boolean
  | string
  | {
      text: string;
      isHighlighted?: boolean;
      link?: { text: string; url: string };
    };

export interface PricingPlan {
  id: PricingPlanId;
  name: string;
  badge?: string;
  priceText: string;
  priceValue: number;
  periodText: string;
  isHighlight?: boolean;
  buttonText?: string;
  buttonActionType?: 'upgrade' | 'link' | 'none';
  buttonLink?: string;
  footerNote?: string;
  featureValues: Record<string, FeatureValueType>;
}

export interface UpgradeOrder {
  planId: 'pro' | 'premium';
  planName: string;
  priceText: string;
  priceValue: number;
  periodText: string;
  orderCode: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

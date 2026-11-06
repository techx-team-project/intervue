import {
  CV_BENEFITS,
  CV_COLORS,
  CV_FAQS,
  CV_INDUSTRIES,
  CV_STEPS,
  CV_STYLES,
  CV_TEMPLATES,
} from '@/constants/cv-templates';
import type { CvTemplateIndustry, CvTemplateItem, CvTemplateStyle } from '@/types/cv-template';

export { CV_BENEFITS, CV_COLORS, CV_FAQS, CV_INDUSTRIES, CV_STEPS, CV_STYLES, CV_TEMPLATES };

export function getAllCvTemplates(): CvTemplateItem[] {
  return CV_TEMPLATES;
}

export function getCvTemplatesByStyle(styleSlug: string): CvTemplateItem[] {
  if (styleSlug === 'all') return CV_TEMPLATES;
  return CV_TEMPLATES.filter((tpl) => tpl.styleSlug === styleSlug);
}

export function getCvTemplateBySlug(slug: string): CvTemplateItem | undefined {
  return CV_TEMPLATES.find((tpl) => tpl.slug === slug);
}

export function getCvStyles(): CvTemplateStyle[] {
  return CV_STYLES;
}

export function getCvIndustries(): CvTemplateIndustry[] {
  return CV_INDUSTRIES;
}

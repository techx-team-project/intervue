export interface CvTemplateColor {
  id: string;
  name: string;
  hex: string;
}

export interface CvTemplateStyle {
  id: string;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export interface CvTemplateIndustry {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface CvTemplateSampleData {
  name: string;
  title: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }[];
  education: {
    degree: string;
    school: string;
    period: string;
    gpa?: string;
  }[];
  skills: string[];
  languages?: string[];
  certifications?: string[];
}

export interface CvTemplateItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  style: string;
  styleSlug: string;
  languages: ('Tiếng Việt' | 'Tiếng Anh' | 'Tiếng Nhật')[];
  industries: string[];
  availableColors: CvTemplateColor[];
  defaultColorHex: string;
  usesCount: string;
  rating: number;
  isNew?: boolean;
  isHot?: boolean;
  isAtsOptimized?: boolean;
  recommendedFor: string[];
  description: string;
  sampleData: CvTemplateSampleData;
}

export interface CvStepGuide {
  step: number;
  title: string;
  description: string;
}

export interface CvBenefitItem {
  icon: string;
  title: string;
  description: string;
}

export interface CvFaqItem {
  question: string;
  answer: string;
}

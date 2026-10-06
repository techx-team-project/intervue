export interface JobDetail {
  id: number | string;
  slug?: string;
  title: string;
  company: {
    id?: number;
    name: string;
    logo?: string;
    cover?: string;
    size: string;
    industry: string;
    address: string;
    website?: string;
    isVerified?: boolean;
    followers?: string;
    description?: string;
  };
  salary: {
    display: string;
    min?: number;
    max?: number;
    currency?: string;
    negotiable?: boolean;
  };
  location: {
    city: string;
    district?: string;
    specificAddress: string;
    allLocations?: string[];
  };
  experience: string;
  deadline: string;
  daysRemaining?: number;
  level: string;
  recruitsCount: number | string;
  workingType: string;
  employmentType: string;
  gender: string;
  isPro?: boolean;
  isUrgent?: boolean;
  highlightBadge?: string;
  tags: string[];
  skills: string[];
  jobDescription: string[];
  requirements: string[];
  benefits: string[];
  perks?: {
    icon: string;
    title: string;
    desc: string;
  }[];
  workSchedule: {
    time: string;
    days: string;
  };
  categories: {
    name: string;
    link?: string;
  }[];
  atsMatchScore?: number;
  verifiedBadges: string[];
}

export interface RelatedJob {
  id: number | string;
  title: string;
  company: string;
  companyLogo?: string;
  salary: string;
  location: string;
  deadline: string;
  tags: string[];
  isPro?: boolean;
}

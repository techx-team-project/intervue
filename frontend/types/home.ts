import type { LucideIcon } from 'lucide-react';

export interface Job {
  id: number;
  title: string;
  company: string;
  companySize?: string;
  isPro?: boolean;
  highlightBadge?: string;
  salary: string;
  location: string;
  deadline: string;
  isUrgentDeadline?: boolean;
  tags: string[];
  type: 'office' | 'general_labor';
}

export interface LiveJob {
  title: string;
  company: string;
  salary: string;
  location: string;
  time: string;
}

export interface MarketSector {
  name: string;
  jobs: string;
  growth: string;
  salary: string;
  badge: string;
}

export interface Company {
  id: number;
  name: string;
  field: string;
  fieldId: number;
  logo: string;
  cover: string;
  openJobs: number;
  followers: string;
}

export interface CompanyField {
  id: number;
  name: string;
}

export interface JobCategory {
  id: number;
  name: string;
  count: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

export interface SuperiorTool {
  title: string;
  desc: string;
  icon: string;
  link: string;
}

export interface CompanyAward {
  title: string;
  img: string;
  link: string;
}

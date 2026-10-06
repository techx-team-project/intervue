export interface CompanyJobItem {
  id: number | string;
  title: string;
  salary: string;
  location: string;
  deadline: string;
  experience: string;
  type: string;
  tags: string[];
  isHot?: boolean;
  isUrgent?: boolean;
}

export interface CompanyBranch {
  name: string;
  address: string;
  phone?: string;
}

export interface CompanyHighlight {
  icon: string;
  title: string;
  desc: string;
}

export interface CompanyDetail {
  id: number | string;
  name: string;
  slug?: string;
  logo: string;
  cover: string;
  tagline?: string;
  size: string;
  industry: string;
  foundedYear?: string;
  website?: string;
  email?: string;
  phone?: string;
  address: string;
  branches: CompanyBranch[];
  followers: string;
  isVerified: boolean;
  description: string[];
  highlights: CompanyHighlight[];
  benefits: string[];
  openJobsCount: number;
  jobs: CompanyJobItem[];
  mapEmbedUrl?: string;
}

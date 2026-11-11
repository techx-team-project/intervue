export interface CompanyJobItem {
  id: number | string;
  title: string;
  salary: string;
  location: string;
  deadline: string;
  tags: string[];
}

export interface CompanyDetail {
  id: number | string;
  name: string;
  logo?: string;
  size?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address: string;
  description: string[];
  benefits: string[];
  photos: string[];
  openJobsCount: number;
  jobs: CompanyJobItem[];
  featured?: boolean;
  brandPageActive?: boolean;
}

export interface PublicCompanyResource {
  id: number;
  name: string;
  tradingName?: string;
  address?: string;
  industry?: string;
  size?: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  benefits?: string;
  logoUrl?: string;
  photoUrls: string[];
  featured?: boolean;
  brandPageActive?: boolean;
}

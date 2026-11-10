import { request } from '@/apiRequest/http';
import type { FeaturedCompany } from '@/types/featured-company';

export const featuredCompanyApi = {
  list: (limit = 8) => request<FeaturedCompany[]>(`/companies/featured?limit=${limit}`),
};

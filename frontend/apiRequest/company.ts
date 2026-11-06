import { request } from '@/apiRequest/http';
import type { PublicCompanyResource } from '@/types/company';
import type { PublicJobSummaryResource } from '@/types/public-job';
import type { Page } from '@/types/api';

const COMPANY_JOBS_PAGE_SIZE = 50;

export const companyApi = {
  getPublic: (id: number) => request<PublicCompanyResource>(`/companies/${id}`),

  listJobs: (companyId: number) =>
    request<Page<PublicJobSummaryResource>>(`/jobs?companyId=${companyId}&page=0&size=${COMPANY_JOBS_PAGE_SIZE}`),
};

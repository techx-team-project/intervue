import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { PublicJobResource, PublicJobSummaryResource } from '@/types/public-job';

export type PublicJobSearchParams = {
  q?: string;
  city?: string;
  level?: string;
  contractType?: string;
  workingArrangement?: string;
  salaryFrom?: number;
  page?: number;
  size?: number;
};

function toQuery(params: PublicJobSearchParams) {
  const query = new URLSearchParams();
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.city) query.set('city', params.city);
  if (params.level) query.set('level', params.level);
  if (params.contractType) query.set('contractType', params.contractType);
  if (params.workingArrangement) query.set('workingArrangement', params.workingArrangement);
  if (params.salaryFrom) query.set('salaryFrom', String(params.salaryFrom));
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 12));
  return query.toString();
}

export const publicJobApi = {
  search: (params: PublicJobSearchParams) => request<Page<PublicJobSummaryResource>>(`/jobs?${toQuery(params)}`),

  get: (id: number) => request<PublicJobResource>(`/jobs/${id}`),
};

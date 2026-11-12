import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { NearbyJobResource, PublicJobResource, PublicJobSummaryResource } from '@/types/public-job';

export type PublicJobSearchParams = {
  q?: string;
  city?: string;
  level?: string;
  jobRole?: string;
  experienceYears?: number;
  contractType?: string;
  workingArrangement?: string;
  salaryFrom?: number;
  currency?: string;
  skillIds?: number[];
  companyId?: number;
  postedWithinDays?: number;
  sort?: string;
  page?: number;
  size?: number;
};

function toQuery(params: PublicJobSearchParams) {
  const query = new URLSearchParams();
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.city) query.set('city', params.city);
  if (params.level) query.set('level', params.level);
  if (params.jobRole) query.set('jobRole', params.jobRole);
  if (params.experienceYears !== undefined) query.set('experienceYears', String(params.experienceYears));
  if (params.contractType) query.set('contractType', params.contractType);
  if (params.workingArrangement) query.set('workingArrangement', params.workingArrangement);
  if (params.salaryFrom) query.set('salaryFrom', String(params.salaryFrom));
  if (params.salaryFrom && params.currency) query.set('currency', params.currency);
  params.skillIds?.forEach((id) => query.append('skillIds', String(id)));
  if (params.postedWithinDays) query.set('postedWithinDays', String(params.postedWithinDays));
  if (params.sort) query.set('sort', params.sort);
  if (params.companyId) query.set('companyId', String(params.companyId));
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 12));
  return query.toString();
}

export const publicJobApi = {
  search: (params: PublicJobSearchParams) => request<Page<PublicJobSummaryResource>>(`/jobs?${toQuery(params)}`),

  nearby: (params: { lat: number; lng: number; radiusKm: number }) =>
    request<NearbyJobResource[]>(`/jobs/nearby?lat=${params.lat}&lng=${params.lng}&radiusKm=${params.radiusKm}`),

  get: (id: number) => request<PublicJobResource>(`/jobs/${id}`),

  recordView: (id: number) => request<null>(`/jobs/${id}/view`, { method: 'POST' }),
};

import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  JobHistoryEntry,
  JobQuota,
  JobStats,
  JobStatus,
  RecruiterJobCounts,
  RecruiterJobResource,
  RecruiterJobSummaryResource,
  SaveJobRequest,
  SkillResource,
} from '@/types/recruiter-job';

export type RecruiterJobSearchParams = {
  status?: JobStatus;
  q?: string;
  sort?: string;
  page?: number;
  size?: number;
};

function toQuery(params: RecruiterJobSearchParams) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.sort) query.set('sort', params.sort);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return query.toString();
}

export const recruiterJobApi = {
  search: (params: RecruiterJobSearchParams) =>
    request<Page<RecruiterJobSummaryResource>>(`/recruiter/jobs?${toQuery(params)}`),

  counts: () => request<RecruiterJobCounts>('/recruiter/jobs/summary'),

  get: (id: number) => request<RecruiterJobResource>(`/recruiter/jobs/${id}`),

  create: (data: SaveJobRequest) => request<RecruiterJobResource>('/recruiter/jobs', { method: 'POST', body: data }),

  update: (id: number, data: SaveJobRequest) =>
    request<RecruiterJobResource>(`/recruiter/jobs/${id}`, { method: 'PUT', body: data }),

  publish: (id: number) => request<RecruiterJobResource>(`/recruiter/jobs/${id}/publish`, { method: 'POST' }),

  pause: (id: number) => request<RecruiterJobResource>(`/recruiter/jobs/${id}/pause`, { method: 'POST' }),

  resume: (id: number) => request<RecruiterJobResource>(`/recruiter/jobs/${id}/resume`, { method: 'POST' }),

  close: (id: number) => request<RecruiterJobResource>(`/recruiter/jobs/${id}/close`, { method: 'POST' }),

  retop: (id: number) => request<RecruiterJobResource>(`/recruiter/jobs/${id}/retop`, { method: 'POST' }),

  renew: (id: number, deadline: string) =>
    request<RecruiterJobResource>(`/recruiter/jobs/${id}/renew`, { method: 'POST', body: { deadline } }),

  history: (id: number, page: number, size: number) =>
    request<Page<JobHistoryEntry>>(`/recruiter/jobs/${id}/history?page=${page}&size=${size}`),

  quota: () => request<JobQuota>('/recruiter/jobs/quota'),

  stats: (id: number, days: number) => request<JobStats>(`/recruiter/jobs/${id}/stats?days=${days}`),

  remove: (id: number) => request<null>(`/recruiter/jobs/${id}`, { method: 'DELETE' }),
};

export const skillApi = {
  suggest: (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    return request<SkillResource[]>(`/skills?${params.toString()}`);
  },
};

import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { AdminJobSummaryResource } from '@/types/admin-job';
import type { JobStatus, RecruiterJobCounts, RecruiterJobResource } from '@/types/recruiter-job';

export type AdminJobSearchParams = {
  q?: string;
  status?: JobStatus;
  page?: number;
  size?: number;
};

function toQuery(params: AdminJobSearchParams) {
  const query = new URLSearchParams();
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.status) query.set('status', params.status);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  query.set('sort', 'updatedAt,desc');
  return query.toString();
}

export const adminJobApi = {
  search: (params: AdminJobSearchParams) => request<Page<AdminJobSummaryResource>>(`/admin/jobs?${toQuery(params)}`),

  counts: () => request<RecruiterJobCounts>('/admin/jobs/summary'),

  get: (id: number) => request<RecruiterJobResource>(`/admin/jobs/${id}`),

  hide: (id: number, reason: string) =>
    request<RecruiterJobResource>(`/admin/jobs/${id}/hide`, { method: 'POST', body: { reason } }),

  restore: (id: number) => request<RecruiterJobResource>(`/admin/jobs/${id}/restore`, { method: 'POST' }),
};

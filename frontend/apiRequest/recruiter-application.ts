import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { ReviewApplication, ReviewApplicationSummary, ReviewStatusCounts } from '@/types/application-review';
import type { CandidateApplicationStatus } from '@/types/candidate-application';

export type ReviewSearchParams = {
  jobId?: number;
  status?: CandidateApplicationStatus;
  q?: string;
  page?: number;
  size?: number;
};

const BASE = '/recruiter/applications';

function toQuery(params: ReviewSearchParams) {
  const query = new URLSearchParams();
  if (params.jobId) query.set('jobId', String(params.jobId));
  if (params.status) query.set('status', params.status);
  if (params.q?.trim()) query.set('q', params.q.trim());
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return query.toString();
}

export const recruiterApplicationApi = {
  search: (params: ReviewSearchParams) => request<Page<ReviewApplicationSummary>>(`${BASE}?${toQuery(params)}`),

  counts: (jobId?: number) => request<ReviewStatusCounts>(`${BASE}/summary${jobId ? `?jobId=${jobId}` : ''}`),

  open: (id: number) => request<ReviewApplication>(`${BASE}/${id}`),

  changeStatus: (id: number, status: CandidateApplicationStatus, note?: string) =>
    request<ReviewApplication>(`${BASE}/${id}/status`, { method: 'POST', body: { status, note } }),

  addNote: (id: number, content: string) =>
    request<ReviewApplication>(`${BASE}/${id}/notes`, { method: 'POST', body: { content } }),

  deleteNote: (id: number, noteId: number) =>
    request<ReviewApplication>(`${BASE}/${id}/notes/${noteId}`, { method: 'DELETE' }),

  downloadCv: (id: number) => request<Blob>(`${BASE}/${id}/cv`, { responseType: 'blob' }),
};

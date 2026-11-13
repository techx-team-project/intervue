import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { ApplyForm, CandidateApplication, SaveApplicationPayload } from '@/types/candidate-application';

const BASE = '/candidate/applications';

export const candidateApplicationApi = {
  appliedJobIds: () => request<number[]>(`${BASE}/applied-job-ids`),

  form: (jobId: number) => request<ApplyForm>(`${BASE}/form?jobId=${jobId}`),

  list: (page = 0, size = 10) =>
    request<Page<Omit<CandidateApplication, 'answers'>>>(`${BASE}?page=${page}&size=${size}`),

  saveDraft: (payload: SaveApplicationPayload) =>
    request<CandidateApplication>(`${BASE}/draft`, { method: 'PUT', body: payload }),

  submit: (payload: SaveApplicationPayload) => request<CandidateApplication>(BASE, { method: 'POST', body: payload }),

  withdraw: (id: number) => request<CandidateApplication>(`${BASE}/${id}/withdraw`, { method: 'POST' }),

  reapply: (id: number, resumeId: number) =>
    request<CandidateApplication>(`${BASE}/${id}/reapply`, { method: 'POST', body: { resumeId } }),
};

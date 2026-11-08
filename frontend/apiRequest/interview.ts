import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { Interview, InterviewFormValues, InterviewStatus } from '@/types/interview';

const RECRUITER = '/recruiter/interviews';
const CANDIDATE = '/candidate/interviews';

function pageQuery(page: number, size: number, status?: InterviewStatus) {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) query.set('status', status);
  return query.toString();
}

export const recruiterInterviewApi = {
  search: (page: number, size: number, status?: InterviewStatus) =>
    request<Page<Interview>>(`${RECRUITER}?${pageQuery(page, size, status)}`),

  listForApplication: (applicationId: number) => request<Interview[]>(`${RECRUITER}/by-application/${applicationId}`),

  schedule: (applicationId: number, values: InterviewFormValues) =>
    request<Interview>(`${RECRUITER}/by-application/${applicationId}`, { method: 'POST', body: values }),

  update: (id: number, values: InterviewFormValues) =>
    request<Interview>(`${RECRUITER}/${id}`, { method: 'PUT', body: values }),

  acceptProposal: (id: number) => request<Interview>(`${RECRUITER}/${id}/accept-proposal`, { method: 'POST' }),

  cancel: (id: number, reason?: string) =>
    request<Interview>(`${RECRUITER}/${id}/cancel`, { method: 'POST', body: { reason } }),
};

export const candidateInterviewApi = {
  list: (page: number, size: number) => request<Page<Interview>>(`${CANDIDATE}?${pageQuery(page, size)}`),

  confirm: (id: number) => request<Interview>(`${CANDIDATE}/${id}/confirm`, { method: 'POST' }),

  decline: (id: number, reason?: string) =>
    request<Interview>(`${CANDIDATE}/${id}/decline`, { method: 'POST', body: { reason } }),

  requestReschedule: (id: number, proposedStartsAt: string, message?: string) =>
    request<Interview>(`${CANDIDATE}/${id}/reschedule-request`, {
      method: 'POST',
      body: { proposedStartsAt, message },
    }),

  calendar: (id: number) => request<Blob>(`${CANDIDATE}/${id}/calendar`, { responseType: 'blob' }),
};

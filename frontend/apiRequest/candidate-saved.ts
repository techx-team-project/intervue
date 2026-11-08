import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { FollowedCompany, SavedJob } from '@/types/candidate-saved';

function pageQuery(page: number, size: number) {
  return new URLSearchParams({ page: String(page), size: String(size) }).toString();
}

export const savedJobApi = {
  list: (page: number, size: number) => request<Page<SavedJob>>(`/candidate/saved-jobs?${pageQuery(page, size)}`),

  ids: () => request<number[]>('/candidate/saved-jobs/ids'),

  save: (jobId: number) => request<null>(`/candidate/saved-jobs/${jobId}`, { method: 'PUT' }),

  remove: (jobId: number) => request<null>(`/candidate/saved-jobs/${jobId}`, { method: 'DELETE' }),
};

export const companyFollowApi = {
  list: (page: number, size: number) =>
    request<Page<FollowedCompany>>(`/candidate/followed-companies?${pageQuery(page, size)}`),

  ids: () => request<number[]>('/candidate/followed-companies/ids'),

  follow: (companyId: number) => request<null>(`/candidate/followed-companies/${companyId}`, { method: 'PUT' }),

  unfollow: (companyId: number) => request<null>(`/candidate/followed-companies/${companyId}`, { method: 'DELETE' }),
};

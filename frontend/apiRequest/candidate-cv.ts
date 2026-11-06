import { request } from '@/apiRequest/http';
import type { CandidateResume } from '@/types/candidate-application';

export const candidateCvApi = {
  list: () => request<CandidateResume[]>('/candidate/cvs'),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<CandidateResume>('/candidate/cvs', { method: 'POST', body: formData });
  },

  rename: (id: number, fileName: string) =>
    request<CandidateResume>(`/candidate/cvs/${id}`, { method: 'PATCH', body: { fileName } }),

  setDefault: (id: number) => request<CandidateResume>(`/candidate/cvs/${id}/default`, { method: 'POST' }),

  remove: (id: number) => request<null>(`/candidate/cvs/${id}`, { method: 'DELETE' }),

  download: (id: number) => request<Blob>(`/candidate/cvs/${id}/download`, { responseType: 'blob' }),
};

import { request } from '@/apiRequest/http';
import type {
  CandidateProfileResponse,
  CandidateSection,
  CandidateSectionRequests,
  SaveCandidateProfileRequest,
} from '@/types/candidate-profile';

const PROFILE_PATH = '/candidate/profile';

function toFileBody(file: File): FormData {
  const body = new FormData();
  body.append('file', file);
  return body;
}

export const candidateApi = {
  getProfile: () => request<CandidateProfileResponse>(PROFILE_PATH),
  updateProfile: (body: SaveCandidateProfileRequest) =>
    request<CandidateProfileResponse>(PROFILE_PATH, { method: 'PUT', body }),
  uploadAvatar: (file: File) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/avatar`, { method: 'POST', body: toFileBody(file) }),
  removeAvatar: () => request<CandidateProfileResponse>(`${PROFILE_PATH}/avatar`, { method: 'DELETE' }),
  uploadCover: (file: File) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/cover`, { method: 'POST', body: toFileBody(file) }),
  removeCover: () => request<CandidateProfileResponse>(`${PROFILE_PATH}/cover`, { method: 'DELETE' }),
  createItem: <S extends CandidateSection>(section: S, body: CandidateSectionRequests[S]) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/${section}`, { method: 'POST', body }),
  updateItem: <S extends CandidateSection>(section: S, id: number, body: CandidateSectionRequests[S]) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/${section}/${id}`, { method: 'PUT', body }),
  deleteItem: (section: CandidateSection, id: number) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/${section}/${id}`, { method: 'DELETE' }),
  uploadCertificationImage: (id: number, file: File) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/certifications/${id}/image`, {
      method: 'POST',
      body: toFileBody(file),
    }),
  removeCertificationImage: (id: number) =>
    request<CandidateProfileResponse>(`${PROFILE_PATH}/certifications/${id}/image`, { method: 'DELETE' }),
};

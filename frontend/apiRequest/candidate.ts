import { request } from '@/apiRequest/http';
import type { CandidateProfileResponse, SaveCandidateProfileRequest } from '@/types/candidate-profile';

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
};

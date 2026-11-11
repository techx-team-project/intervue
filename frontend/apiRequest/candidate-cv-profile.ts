import { request } from '@/apiRequest/http';
import type { ApplyCvParsedRequest, CvParseProfileResponse } from '@/types/candidate-cv-profile';
import type { CandidateProfileResponse } from '@/types/candidate-profile';

export const candidateCvProfileApi = {
  parseCv: ({ file, resumeId }: { file?: File; resumeId?: number }) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const query = resumeId ? `?resumeId=${resumeId}` : '';
    return request<CvParseProfileResponse>(`/candidate/profile/parse-cv${query}`, {
      method: 'POST',
      body: formData,
    });
  },

  applyCvParsed: (payload: ApplyCvParsedRequest) =>
    request<CandidateProfileResponse>('/candidate/profile/apply-cv-parsed', {
      method: 'POST',
      body: payload,
    }),
};

import { request } from '@/apiRequest/http';
import type {
  MockInterviewDetailResource,
  MockInterviewSummaryResource,
  StartMockInterviewRequest,
  SubmitAnswerResultResource,
  SubmitMockAnswerRequest,
  SubmitMockFollowUpRequest,
} from '@/types/ai-mock-interview';

export const candidateMockInterviewApi = {
  startSession: (payload: StartMockInterviewRequest, cvFile?: File | null) => {
    const formData = new FormData();
    formData.append('targetRole', payload.targetRole);
    formData.append('seniorityLevel', payload.seniorityLevel);
    formData.append('focusArea', payload.focusArea);
    formData.append('questionCount', String(payload.questionCount));
    if (cvFile) {
      formData.append('file', cvFile);
    }
    return request<MockInterviewDetailResource>('/candidate/mock-interviews', { method: 'POST', body: formData });
  },

  listHistory: () =>
    request<MockInterviewSummaryResource[]>('/candidate/mock-interviews', {
      method: 'GET',
    }),

  getSessionDetail: (id: number) =>
    request<MockInterviewDetailResource>(`/candidate/mock-interviews/${id}`, {
      method: 'GET',
    }),

  submitAnswer: (sessionId: number, questionId: number, payload: SubmitMockAnswerRequest) =>
    request<SubmitAnswerResultResource>(`/candidate/mock-interviews/${sessionId}/questions/${questionId}/answer`, {
      method: 'POST',
      body: payload,
    }),

  submitFollowUp: (sessionId: number, questionId: number, payload: SubmitMockFollowUpRequest) =>
    request<SubmitAnswerResultResource>(`/candidate/mock-interviews/${sessionId}/questions/${questionId}/follow-up`, {
      method: 'POST',
      body: payload,
    }),
};

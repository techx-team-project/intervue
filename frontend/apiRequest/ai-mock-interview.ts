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
  startSession: (payload: StartMockInterviewRequest) =>
    request<MockInterviewDetailResource>('/candidate/mock-interviews', {
      method: 'POST',
      body: payload,
    }),

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

import { request } from '@/apiRequest/http';
import type {
  CreateJobAlertInput,
  JobAlert,
  JobAlertSummary,
  JobAlertUnsubscribeInfo,
  UnsubscribeActionInput,
  UpdateJobAlertInput,
} from '@/types/job-alert';

const CANDIDATE_ALERTS_PATH = '/candidate/job-alerts';

export const jobAlertApi = {
  // Candidate endpoints (Authenticated)
  listAlerts: () => request<JobAlert[]>(CANDIDATE_ALERTS_PATH),

  getSummary: () => request<JobAlertSummary>(`${CANDIDATE_ALERTS_PATH}/summary`),

  getAlert: (id: number) => request<JobAlert>(`${CANDIDATE_ALERTS_PATH}/${id}`),

  createAlert: (body: CreateJobAlertInput) => request<JobAlert>(CANDIDATE_ALERTS_PATH, { method: 'POST', body }),

  updateAlert: (id: number, body: UpdateJobAlertInput) =>
    request<JobAlert>(`${CANDIDATE_ALERTS_PATH}/${id}`, { method: 'PUT', body }),

  toggleAlert: (id: number) => request<JobAlert>(`${CANDIDATE_ALERTS_PATH}/${id}/toggle`, { method: 'PATCH' }),

  deleteAlert: (id: number) => request<void>(`${CANDIDATE_ALERTS_PATH}/${id}`, { method: 'DELETE' }),

  sendTestEmail: (id: number) => request<boolean>(`${CANDIDATE_ALERTS_PATH}/${id}/test-send`, { method: 'POST' }),

  // Public One-Click Unsubscribe (No Auth needed)
  getUnsubscribeInfo: (token: string) =>
    request<JobAlertUnsubscribeInfo>(`/job-alerts/unsubscribe?token=${encodeURIComponent(token)}`, { auth: false }),

  processUnsubscribe: (body: UnsubscribeActionInput) =>
    request<void>('/job-alerts/unsubscribe', { method: 'POST', body, auth: false }),
};

import { request } from '@/apiRequest/http';
import type { ReportJobPayload } from '@/types/job-report';

export const jobReportApi = {
  report: (jobId: number, payload: ReportJobPayload) =>
    request<null>(`/candidate/jobs/${jobId}/report`, { method: 'POST', body: payload }),
};

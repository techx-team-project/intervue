'use client';

import { jobReportApi } from '@/apiRequest/job-report';
import type { ReportJobPayload } from '@/types/job-report';
import { useMutation } from '@tanstack/react-query';

export function useReportJob(jobId: number) {
  return useMutation({ mutationFn: (payload: ReportJobPayload) => jobReportApi.report(jobId, payload) });
}

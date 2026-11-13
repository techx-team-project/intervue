import type { JobLevel, JobSalary, JobStatus } from '@/types/recruiter-job';

export interface AdminJobSummaryResource {
  id: number;
  title: string;
  status: JobStatus;
  companyId: number;
  companyName: string;
  level?: JobLevel;
  city?: string;
  salary: JobSalary;
  deadline?: string;
  publishedAt?: string;
  hiddenReason?: string;
  updatedAt: string;
}

export interface AdminJobContentWarning {
  field: string;
  severity: 'SEVERE' | 'MILD';
  terms: string[];
}

export interface AdminJobDailyCount {
  date: string;
  count: number;
}

export interface AdminReportedJob {
  jobId: number;
  title: string;
  companyName: string;
  pendingReports: number;
}

export interface AdminJobInsights {
  days: number;
  pendingReview: number;
  submitted: number;
  approved: number;
  rejected: number;
  approvalRate: number | null;
  avgReviewHours: number | null;
  publishedPerDay: AdminJobDailyCount[];
  mostReported: AdminReportedJob[];
}

export const ADMIN_JOB_INSIGHT_WINDOWS = [7, 30, 90] as const;

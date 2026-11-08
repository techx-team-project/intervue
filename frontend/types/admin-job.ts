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

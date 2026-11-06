export type AlertFrequency = 'DAILY' | 'WEEKLY' | 'INSTANT';

export interface JobAlert {
  id: number;
  userId: number;
  title: string;
  keyword?: string | null;
  city?: string | null;
  careerLevel?: string | null;
  workMode?: string | null;
  salaryMin?: number | null;
  currency: string;
  frequency: AlertFrequency;
  isActive: boolean;
  unsubscribeToken: string;
  lastSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deliveredCount: number;
}

export interface JobAlertSummary {
  totalAlerts: number;
  activeAlerts: number;
  pausedAlerts: number;
  totalDeliveries: number;
}

export interface CreateJobAlertInput {
  title: string;
  keyword?: string;
  city?: string;
  careerLevel?: string;
  workMode?: string;
  salaryMin?: number;
  currency?: string;
  frequency?: AlertFrequency;
}

export interface UpdateJobAlertInput {
  title: string;
  keyword?: string;
  city?: string;
  careerLevel?: string;
  workMode?: string;
  salaryMin?: number;
  currency?: string;
  frequency?: AlertFrequency;
  isActive?: boolean;
}

export interface JobAlertUnsubscribeInfo {
  alertId: number;
  title: string;
  keyword?: string | null;
  city?: string | null;
  frequency: AlertFrequency;
  isActive: boolean;
  token: string;
}

export interface UnsubscribeActionInput {
  token: string;
  action: 'PAUSE' | 'DELETE';
}

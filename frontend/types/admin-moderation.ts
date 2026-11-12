import type { ConnectFilterSeverity, ReportReasonCode } from '@/types/connect';

export type { ConnectFilterSeverity, ReportReasonCode };

export type ReporterType = 'CANDIDATE' | 'RECRUITER' | 'SYSTEM';
export type ReportTargetType = 'CONVERSATION' | 'JOB_POST' | 'CANDIDATE';
export type ReportStatus = 'PENDING' | 'DISMISSED' | 'ACTION_TAKEN';
export type ReportResolveAction = 'NONE' | 'HIDE_CONTENT' | 'LOCK_ACCOUNT';
export type FilterScope = 'CONNECT' | 'JOB';

export interface AdminReportSummary {
  id: number;
  reporterType: ReporterType;
  reporterId: number;
  targetType: ReportTargetType;
  targetId: number;
  reasonCode: ReportReasonCode;
  status: ReportStatus;
  createdAt: string;
}

export interface AdminReportDetail {
  id: number;
  reporterType: ReporterType;
  reporterId: number;
  targetType: ReportTargetType;
  targetId: number;
  reasonCode: ReportReasonCode;
  reasonNote?: string;
  status: ReportStatus;
  adminNote?: string;
  reviewedByUserId?: number;
  reviewedAt?: string;
  createdAt: string;
}

export interface AdminDismissReportPayload {
  note?: string;
}

export interface AdminResolveReportPayload {
  action: ReportResolveAction;
  note?: string;
  lockActorType?: 'CANDIDATE' | 'RECRUITER';
  lockActorId?: number;
}

export interface ConnectFilterWord {
  id: number;
  pattern: string;
  scope: FilterScope;
  regex: boolean;
  severity: ConnectFilterSeverity;
  active: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFilterWordPayload {
  pattern: string;
  scope?: FilterScope;
  regex: boolean;
  severity: ConnectFilterSeverity;
  active: boolean;
  note?: string;
}

export interface UpdateFilterWordPayload {
  pattern: string;
  regex: boolean;
  severity: ConnectFilterSeverity;
  active: boolean;
  note?: string;
}

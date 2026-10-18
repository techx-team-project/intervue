import type { LucideIcon } from 'lucide-react';

export type VerificationLevel = 'unverified' | 'basic' | 'verified';

export interface RecruiterVerificationStatus {
  level: VerificationLevel;
  stepsCompleted: number;
  stepsTotal: number;
  nextStepLabel: string;
}

export type DashboardStatKind = 'activeJobPosts' | 'newApplications' | 'scheduledInterviews' | 'creditBalance';

export interface RecruiterDashboardStat {
  kind: DashboardStatKind;
  label: string;
  value: number;
  trendPercent?: number;
  trendDirection?: 'up' | 'down';
  sparkline?: number[];
}

export interface SuggestedServicePackage {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  highlight?: string;
}

export type RecentApplicationStatus =
  'APPLIED' | 'IN_REVIEW' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' | 'WITHDRAWN' | 'NO_AGREEMENT';

export interface RecentApplicationPreview {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: RecentApplicationStatus;
  appliedAt: string;
}

export interface RecruiterCompanySummary {
  name: string;
  logoUrl?: string;
}

export interface RecruiterPipelineStage {
  status: RecentApplicationStatus;
  label: string;
  count: number;
}

export interface RecruiterPriorityItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone?: 'default' | 'warning';
}

export interface RecruiterDashboardData {
  company: RecruiterCompanySummary;
  verification: RecruiterVerificationStatus;
  stats: RecruiterDashboardStat[];
  pipeline: RecruiterPipelineStage[];
  priorities: RecruiterPriorityItem[];
  suggestedServices: SuggestedServicePackage[];
  recentApplications: RecentApplicationPreview[];
}

export interface RecruiterBannerSlide {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: LucideIcon;
  gradientClassName: string;
}

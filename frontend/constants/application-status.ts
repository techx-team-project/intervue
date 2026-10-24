import type {
  AiMatchBand,
  ApplicationColumnId,
  ApplicationSortKey,
  ApplicationSource,
  ApplicationStatus,
} from '@/types/recruiter-application';

export interface ApplicationStatusMeta {
  label: string;
  textClassName: string;
  chipClassName: string;
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, ApplicationStatusMeta> = {
  APPLIED: {
    label: 'New',
    textClassName: 'text-sky-700',
    chipClassName: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  IN_REVIEW: {
    label: 'In review',
    textClassName: 'text-amber-700',
    chipClassName: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  INTERVIEW: {
    label: 'Interview',
    textClassName: 'text-violet-700',
    chipClassName: 'border-violet-200 bg-violet-50 text-violet-700',
  },
  OFFER: {
    label: 'Offer sent',
    textClassName: 'text-indigo-700',
    chipClassName: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  },
  HIRED: {
    label: 'Hired',
    textClassName: 'text-emerald-700',
    chipClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  REJECTED: {
    label: 'Rejected',
    textClassName: 'text-rose-700',
    chipClassName: 'border-rose-200 bg-rose-50 text-rose-700',
  },
  WITHDRAWN: {
    label: 'Withdrawn by candidate',
    textClassName: 'text-slate-600',
    chipClassName: 'border-slate-200 bg-slate-100 text-slate-600',
  },
  NO_AGREEMENT: {
    label: 'No agreement',
    textClassName: 'text-orange-700',
    chipClassName: 'border-orange-200 bg-orange-50 text-orange-700',
  },
};

export interface ApplicationColumnMeta {
  id: ApplicationColumnId;
  label: string;
  description: string;
  statuses: ApplicationStatus[];
  accentTextClassName: string;
  accentDotClassName: string;
  accentBarClassName: string;
  accentSurfaceClassName: string;
  accentRingClassName: string;
}

export const APPLICATION_COLUMNS: ApplicationColumnMeta[] = [
  {
    id: 'APPLIED',
    label: 'New',
    description: 'Just applied, not reviewed yet',
    statuses: ['APPLIED'],
    accentTextClassName: 'text-sky-700',
    accentDotClassName: 'bg-sky-500',
    accentBarClassName: 'bg-linear-to-r from-sky-400 to-sky-500',
    accentSurfaceClassName: 'from-sky-50/80',
    accentRingClassName: 'ring-sky-300',
  },
  {
    id: 'IN_REVIEW',
    label: 'In review',
    description: 'Reviewing the CV and screening answers',
    statuses: ['IN_REVIEW'],
    accentTextClassName: 'text-amber-700',
    accentDotClassName: 'bg-amber-500',
    accentBarClassName: 'bg-linear-to-r from-amber-400 to-amber-500',
    accentSurfaceClassName: 'from-amber-50/80',
    accentRingClassName: 'ring-amber-300',
  },
  {
    id: 'INTERVIEW',
    label: 'Interview',
    description: 'Interview scheduled or in progress',
    statuses: ['INTERVIEW'],
    accentTextClassName: 'text-violet-700',
    accentDotClassName: 'bg-violet-500',
    accentBarClassName: 'bg-linear-to-r from-violet-400 to-violet-500',
    accentSurfaceClassName: 'from-violet-50/80',
    accentRingClassName: 'ring-violet-300',
  },
  {
    id: 'OFFER',
    label: 'Offer sent',
    description: 'Waiting for the candidate to respond',
    statuses: ['OFFER'],
    accentTextClassName: 'text-indigo-700',
    accentDotClassName: 'bg-indigo-500',
    accentBarClassName: 'bg-linear-to-r from-indigo-400 to-indigo-500',
    accentSurfaceClassName: 'from-indigo-50/80',
    accentRingClassName: 'ring-indigo-300',
  },
  {
    id: 'HIRED',
    label: 'Hired',
    description: 'Both sides confirmed the candidate joined',
    statuses: ['HIRED'],
    accentTextClassName: 'text-emerald-700',
    accentDotClassName: 'bg-emerald-500',
    accentBarClassName: 'bg-linear-to-r from-emerald-400 to-emerald-500',
    accentSurfaceClassName: 'from-emerald-50/80',
    accentRingClassName: 'ring-emerald-300',
  },
  {
    id: 'CLOSED',
    label: 'Closed',
    description: 'Rejected, withdrawn or no agreement reached',
    statuses: ['REJECTED', 'WITHDRAWN', 'NO_AGREEMENT'],
    accentTextClassName: 'text-slate-600',
    accentDotClassName: 'bg-slate-400',
    accentBarClassName: 'bg-linear-to-r from-slate-300 to-slate-400',
    accentSurfaceClassName: 'from-slate-100/80',
    accentRingClassName: 'ring-slate-300',
  },
];

export const ACTIVE_APPLICATION_STATUSES: ApplicationStatus[] = ['APPLIED', 'IN_REVIEW', 'INTERVIEW', 'OFFER', 'HIRED'];

export const CLOSING_APPLICATION_STATUSES: ApplicationStatus[] = ['REJECTED', 'NO_AGREEMENT'];

export const APPLICATION_SOURCE_LABEL: Record<ApplicationSource, string> = {
  DIRECT: 'Applied directly',
  AI_RECOMMENDATION: 'Recommended by InterVue AI',
  INVITED: 'Invited by recruiter',
  REFERRAL: 'Internal referral',
};

export const APPLICATION_SORT_OPTIONS: { value: ApplicationSortKey; label: string }[] = [
  { value: 'NEWEST', label: 'Newest applications' },
  { value: 'OLDEST', label: 'Oldest applications' },
  { value: 'AI_MATCH', label: 'Highest AI match' },
  { value: 'LAST_ACTIVITY', label: 'Latest activity' },
  { value: 'NAME', label: 'Candidate name (A→Z)' },
];

export const AI_MATCH_BAND_OPTIONS: { value: AiMatchBand; label: string }[] = [
  { value: 'ALL', label: 'Any match level' },
  { value: 'HIGH', label: 'Strong match (85+)' },
  { value: 'MEDIUM', label: 'Good match (70 – 84)' },
  { value: 'LOW', label: 'Needs a closer look (under 70)' },
];

export const REJECTION_REASON_PRESETS: string[] = [
  'Experience does not meet the requirements of the role',
  'Technical skills do not match our current stack',
  'Salary expectation is above the budget for this role',
  'Location or working arrangement does not fit',
  'The role has already been filled',
];

export const AI_MATCH_HIGH_THRESHOLD = 85;
export const AI_MATCH_MEDIUM_THRESHOLD = 70;

export function getColumnIdForStatus(status: ApplicationStatus): ApplicationColumnId {
  const column = APPLICATION_COLUMNS.find((item) => item.statuses.includes(status));
  return column ? column.id : 'CLOSED';
}

export function getColumnMeta(columnId: ApplicationColumnId): ApplicationColumnMeta {
  return APPLICATION_COLUMNS.find((column) => column.id === columnId) ?? APPLICATION_COLUMNS[0];
}

export function isWithinAiMatchBand(score: number, band: AiMatchBand): boolean {
  if (band === 'HIGH') return score >= AI_MATCH_HIGH_THRESHOLD;
  if (band === 'MEDIUM') return score >= AI_MATCH_MEDIUM_THRESHOLD && score < AI_MATCH_HIGH_THRESHOLD;
  if (band === 'LOW') return score < AI_MATCH_MEDIUM_THRESHOLD;
  return true;
}

export function isMovableStatus(status: ApplicationStatus): boolean {
  return status !== 'WITHDRAWN';
}

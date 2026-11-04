import type {
  ContractType,
  JobLevel,
  JobStatus,
  RecruiterJobSegment,
  RecruiterJobSort,
  WorkingArrangement,
} from '@/types/recruiter-job';

export const JOB_PAGE_SIZE = 8;

export const JOB_SEGMENT_META: Record<RecruiterJobSegment, { label: string }> = {
  all: { label: 'All posts' },
  published: { label: 'Published' },
  pending: { label: 'Pending review' },
  paused: { label: 'Paused' },
  expired: { label: 'Expired' },
  draft: { label: 'Drafts' },
  closed: { label: 'Closed' },
};

export const JOB_SORT_OPTIONS: Array<{ value: RecruiterJobSort; label: string }> = [
  { value: 'newest', label: 'Newest updated' },
  { value: 'expiringSoon', label: 'Expiring soon' },
  { value: 'mostApplicants', label: 'Most applicants' },
  { value: 'highestSalary', label: 'Highest salary' },
];

export const JOB_LEVEL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'All levels' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead / Principal' },
];

export const JOB_LEVEL_LABELS: Record<JobLevel, string> = {
  INTERN: 'Intern',
  JUNIOR: 'Junior',
  MID: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

export const JOB_ARRANGEMENT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'All arrangements' },
  { value: 'ON_SITE', label: 'On-site' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'FLEXIBLE', label: 'Flexible' },
];

export const JOB_ARRANGEMENT_LABELS: Record<WorkingArrangement, string> = {
  ON_SITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
  FLEXIBLE: 'Flexible',
};

export const JOB_CONTRACT_LABELS: Record<ContractType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship',
};

export const JOB_LOCATION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'All locations' },
  { value: 'Hanoi', label: 'Hanoi' },
  { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
  { value: 'Da Nang', label: 'Da Nang' },
];

export function getJobExpiryDetails(expiresAt?: string, status?: JobStatus) {
  if (!expiresAt || status === 'DRAFT') {
    return {
      daysLeft: null,
      isExpired: false,
      label: 'No expiry',
      tone: 'muted' as const,
      progressPercent: 0,
    };
  }

  const now = Date.now();
  const target = new Date(expiresAt).getTime();
  const diffMs = target - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0 || status === 'EXPIRED') {
    return {
      daysLeft: 0,
      isExpired: true,
      label: 'Expired',
      tone: 'danger' as const,
      progressPercent: 100,
    };
  }

  const progressPercent = Math.min(100, Math.max(0, Math.round(((30 - Math.min(30, daysLeft)) / 30) * 100)));

  if (daysLeft <= 7) {
    return {
      daysLeft,
      isExpired: false,
      label: daysLeft === 1 ? '1 day left' : `${daysLeft} days left`,
      tone: 'warning' as const,
      progressPercent,
    };
  }

  return {
    daysLeft,
    isExpired: false,
    label: `${daysLeft} days left`,
    tone: 'normal' as const,
    progressPercent,
  };
}

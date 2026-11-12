import type {
  ContractType,
  JobBenefitTag,
  JobHistoryAction,
  JobLevel,
  JobRole,
  JobStatus,
  SalaryBasis,
  RecruiterJobSegment,
  RecruiterJobSort,
  SkillGroup,
  WorkingArrangement,
} from '@/types/recruiter-job';
import { VN_LOCATIONS } from '@/constants/vn-locations';

export const JOB_PAGE_SIZE = 8;

export const JOB_SEGMENT_META: Record<RecruiterJobSegment, { label: string; status?: JobStatus }> = {
  all: { label: 'All' },
  published: { label: 'Hiring', status: 'PUBLISHED' },
  paused: { label: 'Paused', status: 'PAUSED' },
  expired: { label: 'Expired', status: 'EXPIRED' },
  draft: { label: 'Draft', status: 'DRAFT' },
  closed: { label: 'Closed', status: 'CLOSED' },
};

export const JOB_SORT_OPTIONS: Array<{ value: RecruiterJobSort; label: string; param: string }> = [
  { value: 'newest', label: 'Recently updated', param: 'updatedAt,desc' },
  { value: 'expiringSoon', label: 'Expiring soon', param: 'deadline,asc' },
  { value: 'highestSalary', label: 'Highest salary', param: 'salaryMax,desc' },
];

export const JOB_LEVEL_LABELS: Record<JobLevel, string> = {
  INTERN: 'Intern',
  JUNIOR: 'Junior',
  MID: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

export const JOB_ROLE_LABELS: Record<JobRole, string> = {
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  FULLSTACK: 'Fullstack',
  MOBILE: 'Mobile',
  DEVOPS: 'DevOps / Cloud',
  QA: 'QA / Tester',
  DATA_AI: 'Data / AI',
  BA: 'Business Analyst',
  PM: 'Project / Product',
  UIUX: 'UI/UX Design',
  SECURITY: 'Security',
  OTHER: 'Other',
};

export const JOB_BENEFIT_TAG_LABELS: Record<JobBenefitTag, string> = {
  HEALTH_INSURANCE: 'Health insurance',
  BONUS_13TH_MONTH: '13th-month salary',
  PERFORMANCE_BONUS: 'Performance bonus',
  LAPTOP: 'Laptop & equipment',
  TRAINING: 'Training & certifications',
  TEAM_BUILDING: 'Team building & trips',
  FLEXIBLE_HOURS: 'Flexible hours',
  REMOTE_DAYS: 'Remote days',
  ANNUAL_LEAVE: 'Annual leave',
  MEALS: 'Meals & allowance',
};

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

export function getJobExpiryDetails(expiresAt?: string, status?: JobStatus) {
  if (!expiresAt || status === 'DRAFT') {
    return {
      daysLeft: null,
      isExpired: false,
      label: 'No deadline set',
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
      label: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`,
      tone: 'warning' as const,
      progressPercent,
    };
  }

  return {
    daysLeft,
    isExpired: false,
    label: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`,
    tone: 'normal' as const,
    progressPercent,
  };
}

export const JOB_FORM_LEVEL_OPTIONS: Array<{ value: JobLevel; label: string }> = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead / Principal' },
];

export const JOB_FORM_CONTRACT_OPTIONS: Array<{ value: ContractType; label: string }> = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export const JOB_FORM_ARRANGEMENT_OPTIONS: Array<{ value: WorkingArrangement; label: string }> = [
  { value: 'ON_SITE', label: 'On-site' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'FLEXIBLE', label: 'Flexible' },
];

export const JOB_FORM_ROLE_OPTIONS: Array<{ value: JobRole; label: string }> = (
  Object.entries(JOB_ROLE_LABELS) as Array<[JobRole, string]>
).map(([value, label]) => ({ value, label: value === 'OTHER' ? 'Other' : label }));

export const JOB_FORM_SALARY_BASIS_OPTIONS: Array<{ value: SalaryBasis; label: string }> = [
  { value: 'GROSS', label: 'Gross (before tax)' },
  { value: 'NET', label: 'Net (after tax)' },
];

export const JOB_FORM_BENEFIT_OPTIONS: Array<{ value: JobBenefitTag; label: string }> = [
  { value: 'HEALTH_INSURANCE', label: 'Health insurance' },
  { value: 'BONUS_13TH_MONTH', label: '13th-month bonus' },
  { value: 'PERFORMANCE_BONUS', label: 'Performance bonus' },
  { value: 'LAPTOP', label: 'Laptop / equipment' },
  { value: 'TRAINING', label: 'Training & certifications' },
  { value: 'TEAM_BUILDING', label: 'Team building / trips' },
  { value: 'FLEXIBLE_HOURS', label: 'Flexible hours' },
  { value: 'REMOTE_DAYS', label: 'Some remote days' },
  { value: 'ANNUAL_LEAVE', label: 'Annual leave' },
  { value: 'MEALS', label: 'Meal allowance' },
];

export const JOB_HISTORY_ACTION_LABELS: Record<JobHistoryAction, string> = {
  JOB_CREATED: 'Job created',
  JOB_UPDATED: 'Job edited',
  JOB_PUBLISHED: 'Job published',
  JOB_PAUSED: 'Job paused',
  JOB_RESUMED: 'Job reopened',
  JOB_CLOSED: 'Job closed',
  JOB_RENEWED: 'Renewed and republished',
  JOB_HIDDEN: 'Hidden by admin',
  JOB_RESTORED: 'Restored by admin',
};

export const JOB_FIELD_LABELS: Record<string, string> = {
  title: 'Title',
  level: 'Level',
  jobRole: 'Job role',
  experience: 'Experience',
  contractType: 'Contract type',
  workingArrangement: 'Working arrangement',
  location: 'Location',
  salary: 'Salary',
  skills: 'Skills',
  description: 'Description',
  requirements: 'Requirements',
  benefits: 'Benefits',
  benefitTags: 'Benefit tags',
  hiringSteps: 'Hiring process',
  screeningQuestions: 'Screening questions',
  deadline: 'Deadline',
  openings: 'Openings',
};

export const JOB_FORM_CURRENCY_OPTIONS = [
  { value: 'VND', label: 'million VND' },
  { value: 'USD', label: 'USD' },
];

export const JOB_CITY_SUGGESTIONS = VN_LOCATIONS;

export const SKILL_GROUP_LABELS: Record<SkillGroup, string> = {
  CORE: 'Core',
  AI_DATA: 'AI & Data',
  TOOLS_DEVOPS: 'Tools & DevOps',
  SOFT_SKILLS: 'Soft skills',
};

export const JOB_MAX_SKILLS = 20;

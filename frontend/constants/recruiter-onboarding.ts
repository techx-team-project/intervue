import { JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import type { RecruiterNeedsFormData, RecruiterProfileFormData } from '@/schemas/recruiter.schema';

export const RECRUITER_GENDER_OPTIONS: { value: RecruiterProfileFormData['gender']; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const RECRUITER_CITY_OPTIONS = [
  { value: 'Hanoi', label: 'Hanoi' },
  { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
  { value: 'Da Nang', label: 'Da Nang' },
  { value: 'Hai Phong', label: 'Hai Phong' },
  { value: 'Can Tho', label: 'Can Tho' },
  { value: 'Binh Duong', label: 'Binh Duong' },
  { value: 'Dong Nai', label: 'Dong Nai' },
  { value: 'Ba Ria - Vung Tau', label: 'Ba Ria - Vung Tau' },
  { value: 'Bac Ninh', label: 'Bac Ninh' },
  { value: 'Quang Ninh', label: 'Quang Ninh' },
  { value: 'Other', label: 'Other city / province' },
];

export const RECRUITER_POSITION_OPTIONS = [
  { value: 'BACKEND', label: 'Backend developer' },
  { value: 'FRONTEND', label: 'Frontend developer' },
  { value: 'FULLSTACK', label: 'Fullstack developer' },
  { value: 'MOBILE', label: 'Mobile developer' },
  { value: 'DEVOPS', label: 'DevOps / Cloud engineer' },
  { value: 'QA', label: 'QA / QC engineer' },
  { value: 'DATA', label: 'Data engineer / Data analyst' },
  { value: 'AI_ML', label: 'AI / Machine learning engineer' },
  { value: 'UI_UX', label: 'UI/UX designer' },
  { value: 'PM_BA', label: 'Project manager / Business analyst' },
  { value: 'OTHER', label: 'Other role' },
];

export const RECRUITER_LEVEL_OPTIONS = Object.entries(JOB_LEVEL_LABELS).map(([value, label]) => ({ value, label }));

export const RECRUITER_BUDGET_SOURCE_OPTIONS = [
  { value: 'COMPANY', label: 'Company' },
  { value: 'PERSONAL', label: 'Personal' },
] as const;

export const RECRUITER_CONSULTATION_OPTIONS = [
  { value: 'POSTING', label: 'Writing effective IT job posts' },
  { value: 'AI_SCREENING', label: 'AI-assisted candidate screening' },
  { value: 'COMPANY_VERIFICATION', label: 'Company verification' },
  { value: 'SERVICE_PACKAGES', label: 'Service packages and pricing' },
  { value: 'OTHER', label: 'Something else' },
];

export const HIRING_NEED_DEFAULT_VALUES: RecruiterNeedsFormData = {
  position: '',
  level: '',
  hireBy: '',
  continuous: false,
  headcount: 1,
  budgetFrom: '',
  budgetTo: '',
  budgetSource: 'COMPANY',
  consultation: '',
};

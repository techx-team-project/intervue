export type ReviewLevel = 1 | 2 | 3;
export type CvSource = 'resume' | 'upload' | 'text';

export const MAX_CV_FILE_BYTES = 10 * 1024 * 1024;
export const BYTES_PER_KB = 1024;
export const PAID_LEVEL: ReviewLevel = 3;

export const POPULAR_POSITIONS = [
  'Backend Java Developer',
  'Frontend React Developer',
  'Fullstack Engineer',
  'Mobile Flutter Developer',
  'Data Analyst / Engineer',
  'DevOps / Cloud Engineer',
];

export const REVIEW_LEVELS: Array<{
  level: ReviewLevel;
  title: string;
  description: string;
  cost: string;
  isPaid: boolean;
}> = [
  {
    level: 1,
    title: 'General review',
    description: 'ATS score, formatting and basic language checks for your CV.',
    cost: 'Free · 3 per day',
    isPaid: false,
  },
  {
    level: 2,
    title: 'Target role',
    description: 'Keyword and STAR improvements tailored to the role you want.',
    cost: 'Free · 3 per day',
    isPaid: false,
  },
  {
    level: 3,
    title: 'Job match',
    description: 'Compare every requirement of a real job post with evidence from your CV.',
    cost: '1 credit per run',
    isPaid: true,
  },
];

export const CV_SOURCE_OPTIONS: Array<{ value: CvSource; label: string }> = [
  { value: 'resume', label: 'My saved CVs' },
  { value: 'upload', label: 'Upload a PDF' },
  { value: 'text', label: 'Paste text' },
];

export const TOPUP_PACKAGES = [
  { amount: 5, price: '50,000đ', popular: false, description: '5 job match reviews' },
  { amount: 10, price: '90,000đ', popular: true, description: 'Save 10%. Good for an active job search' },
  { amount: 20, price: '160,000đ', popular: false, description: 'Save 20%. For a full application campaign' },
];

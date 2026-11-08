import { ROUTES } from '@/constants/routes';

export const SUPPORT_EMAIL = 'hotro@intervue.vn';
export const SUPPORT_PHONE = '0812.665.001';
export const SUPPORT_PHONE_HREF = 'tel:0812665001';

export const CANDIDATE_JOBS_MENU = [
  { href: ROUTES.JOBS, label: 'Find jobs' },
  { href: ROUTES.CANDIDATE_JOB_ALERTS, label: 'Job alerts' },
  { href: ROUTES.CANDIDATE_SAVED_JOBS, label: 'Saved jobs' },
  { href: ROUTES.CANDIDATE_INTERVIEWS, label: 'Interviews' },
];

export const CANDIDATE_CV_MENU = [
  { href: '/cv-templates', label: 'CV templates' },
  { href: ROUTES.CANDIDATE_CVS, label: 'Manage CVs' },
  { href: ROUTES.CANDIDATE_PROFILE, label: 'My profile' },
];

export const CANDIDATE_GUIDE_MENU = [
  { href: '/blog', label: 'Career guides' },
  { href: '/career-orientation', label: 'Career orientation' },
];

export const RECRUITER_NAV_LINKS = [
  { href: '/recruiter#features', label: 'AI solutions' },
  { href: '/recruiter#job-posting', label: 'Post a job' },
  { href: '/recruiter#candidate-sourcing', label: 'Find candidates' },
  { href: '/recruiter#pricing', label: 'Pricing' },
  { href: '/recruiter#testimonials', label: 'Customers' },
];

// TEMP: replace with API
import { ROUTES } from '@/constants/routes';
import type { RecruiterBannerSlide } from '@/types/recruiter';
import { Megaphone, ShieldCheck, Users } from 'lucide-react';

export const MOCK_RECRUITER_BANNERS: RecruiterBannerSlide[] = [
  {
    id: 'banner-post-job',
    eyebrow: 'Start hiring',
    title: 'Publish your first job post',
    description: 'Create a job post with AI assistance and reach the right IT candidates.',
    ctaLabel: 'Post a job',
    href: ROUTES.RECRUITER_JOBS_CREATE,
    icon: Megaphone,
    gradientClassName: 'bg-linear-to-br from-[#0c2e24] via-[#103a2e] to-primary',
  },
  {
    id: 'banner-ai-screening',
    eyebrow: 'AI assisted',
    title: 'Let AI help you screen applications',
    description: 'Review the match score of every application before you interview.',
    ctaLabel: 'View applications',
    href: ROUTES.RECRUITER_APPLICATIONS,
    icon: Users,
    gradientClassName: 'bg-linear-to-br from-[#0f2a4a] via-[#163a63] to-[#1e63b8]',
  },
  {
    id: 'banner-verification',
    eyebrow: 'Company verification',
    title: 'Complete verification to build trust',
    description: 'Verified companies rank higher and reach candidates more easily.',
    ctaLabel: 'Verify now',
    href: ROUTES.RECRUITER_COMPANY_VERIFICATION,
    icon: ShieldCheck,
    gradientClassName: 'bg-linear-to-br from-[#4a2c0f] via-[#6b3f14] to-amber-600',
  },
];

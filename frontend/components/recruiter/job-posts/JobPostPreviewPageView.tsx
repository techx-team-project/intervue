'use client';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import JobDetailView from '@/components/job-detail/JobDetailView';
import { ROUTES } from '@/constants/routes';
import { MOCK_RELATED_JOBS } from '@/mocks/job-detail.mock';
import type { JobDetail } from '@/types/job';
import type { RecruiterJobPost } from '@/types/recruiter-job';
import { ArrowLeft, Check, Copy, Pencil, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface JobPostPreviewPageViewProps {
  initialJob: RecruiterJobPost;
}

export function recruiterJobToCandidateJobDetail(job: RecruiterJobPost): JobDetail {
  const formatter = new Intl.NumberFormat('en-US');
  let salaryDisplay = 'Negotiable';
  if (!job.salary.negotiable && (job.salary.min || job.salary.max)) {
    const curr = job.salary.currency || 'VND';
    if (job.salary.min && job.salary.max) {
      salaryDisplay = `${formatter.format(job.salary.min)} - ${formatter.format(job.salary.max)} ${curr}`;
    } else if (job.salary.min) {
      salaryDisplay = `From ${formatter.format(job.salary.min)} ${curr}`;
    } else if (job.salary.max) {
      salaryDisplay = `Up to ${formatter.format(job.salary.max)} ${curr}`;
    }
  }

  const splitLines = (text?: string): string[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.startsWith('• ') || s.startsWith('- ') || s.startsWith('* ') ? s.substring(2) : s));
  };

  const levelLabels: Record<string, string> = {
    INTERN: 'Intern',
    JUNIOR: 'Junior (1-2 years of experience)',
    MID: 'Mid-level (2-4 years of experience)',
    SENIOR: 'Senior (4+ years of experience)',
    LEAD: 'Team lead / Manager (Lead)',
  };

  const arrangementLabels: Record<string, string> = {
    ON_SITE: 'On-site at the office',
    HYBRID: 'Hybrid',
    REMOTE: 'Fully remote',
    FLEXIBLE: 'Flexible hours',
  };

  const contractLabels: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    INTERNSHIP: 'Internship',
  };

  return {
    id: job.id,
    slug: job.id,
    title: job.title || 'Untitled Job Post',
    company: {
      name: job.companyName ?? 'Your company',
      logo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/68d4fafca98ba1758788348.png',
      size: '50 - 150 employees',
      industry: 'Information technology / Software',
      address: [job.location.address, job.location.city].filter(Boolean).join(', '),
      website: 'https://intervue.vn',
      isVerified: true,
      followers: '3.5k',
      description:
        'InterVue is a leading AI-powered IT recruitment platform in Vietnam, connecting tens of thousands of tech professionals with top technology companies.',
    },
    salary: {
      display: salaryDisplay,
      min: job.salary.min ?? undefined,
      max: job.salary.max ?? undefined,
      currency: job.salary.currency || 'VND',
      negotiable: job.salary.negotiable,
    },
    location: {
      city: job.location.city ?? '',
      specificAddress: [job.location.address, job.location.city].filter(Boolean).join(', '),
    },
    experience: (job.level && levelLabels[job.level]) || 'All levels',
    deadline: job.expiresAt ? new Date(job.expiresAt).toLocaleDateString('en-US') : 'Next 30 days',
    daysRemaining: 30,
    level: (job.level && levelLabels[job.level]) || job.level || '',
    recruitsCount: `${job.recruitsCount || 1} people`,
    workingType: (job.workingArrangement && arrangementLabels[job.workingArrangement]) || job.workingArrangement || '',
    employmentType: (job.contractType && contractLabels[job.contractType]) || job.contractType || '',
    gender: 'Not required',
    isPro: false,
    isUrgent: false,
    tags: job.skills || [],
    skills: job.skills || [],
    jobDescription: splitLines(job.description),
    requirements: splitLines(job.requirements),
    benefits: splitLines(job.benefits),
    workSchedule: {
      time: '08:30 - 18:00',
      days: 'Monday - Friday (weekends off)',
    },
    categories: [{ name: 'IT - Software', link: '/jobs' }],
    verifiedBadges: ['Business license verified', 'Verified recruiter'],
    screeningQuestions: (job.screeningQuestions ?? []).map((question) => ({
      id: String(question.id),
      question: question.prompt,
      type: question.type === 'CHOICE' ? 'MULTIPLE_CHOICE' : 'TEXT',
      required: question.required,
      options: question.options,
    })),
  };
}

export default function JobPostPreviewPageView({ initialJob }: JobPostPreviewPageViewProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const job = initialJob;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/jobs/${job.id}`;
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    toast.success('Public link copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const editUrl = `${ROUTES.RECRUITER_JOBS}/${job.id}/edit`;
  const candidateJobDetail = recruiterJobToCandidateJobDetail(job);

  const handlePreviewClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) return;

    // 1. Allow actions on the recruiter preview control banner
    if (anchor.closest('#recruiter-preview-banner')) {
      return;
    }

    const href = anchor.getAttribute('href') || '';

    // 2. Allow in-page anchor jump links (#job-description, #job-requirements, etc.)
    if (href.startsWith('#')) {
      return;
    }

    // 3. For all other links, intercept and prevent navigation away from the preview
    e.preventDefault();
    e.stopPropagation();

    // If company profile, open in new tab so preview context isn't lost
    if (href.startsWith('/companies/')) {
      toast.info('Opening the company page in a new tab so your preview is not interrupted.');
      window.open(href, '_blank');
      return;
    }

    // If related job, open in new tab
    if (href.startsWith('/jobs/')) {
      toast.info('Opening the related job in a new tab so your preview is not interrupted.');
      window.open(href, '_blank');
      return;
    }

    // Candidate navigation links (Header, Breadcrumb, Footer)
    toast.warning(
      'You are previewing this job post. Navigation away from this page is temporarily disabled so you do not lose context.',
      {
        description: 'To return to job management, click "Back to job posts" in the top bar.',
        duration: 3500,
      },
    );
  };

  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col" onClickCapture={handlePreviewClickCapture}>
      {/* 1. Sticky Recruiter Preview Mode Banner */}
      <div
        id="recruiter-preview-banner"
        className="sticky top-0 z-50 border-b border-amber-300 bg-amber-50/95 px-4 py-2.5 shadow-sm backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.RECRUITER_JOBS}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300/80 bg-white px-2.5 py-1 font-semibold text-amber-900 transition-colors hover:bg-amber-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to job posts</span>
            </Link>

            <div className="flex items-center gap-1.5 font-medium text-amber-950">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="font-bold">Candidate view (1:1 live preview):</span>
              <span className="hidden text-amber-800 md:inline">This is exactly what candidates see on InterVue.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-amber-300/80 bg-white px-3 py-1 font-semibold text-amber-900 transition-colors hover:bg-amber-100"
            >
              {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{hasCopied ? 'Link copied' : 'Copy job link'}</span>
            </button>

            <Link
              href={editUrl}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white shadow-xs transition-colors hover:bg-emerald-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit this job post</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Candidate Header */}
      <Header />

      {/* 3. Candidate 100% JobDetailView */}
      <main className="flex-1">
        <JobDetailView job={candidateJobDetail} relatedJobs={MOCK_RELATED_JOBS} isPreviewMode={true} />
      </main>

      {/* 4. Candidate Footer */}
      <Footer />
    </div>
  );
}

'use client';

import { getJobExpiryDetails } from '@/constants/recruiter-job';
import type { RecruiterJobPost, RecruiterJobSegment, RecruiterJobSort } from '@/types/recruiter-job';
import { AlertCircle, CheckCircle2, Eye, FileText, Users } from 'lucide-react';
import { useMemo } from 'react';

interface JobPostsStatsRowProps {
  jobs: RecruiterJobPost[];
  currentSegment: RecruiterJobSegment;
  onSelectSegment: (segment: RecruiterJobSegment) => void;
  onSelectSort: (sort: RecruiterJobSort) => void;
}

export default function JobPostsStatsRow({
  jobs,
  currentSegment,
  onSelectSegment,
  onSelectSort,
}: JobPostsStatsRowProps) {
  const stats = useMemo(() => {
    let publishedCount = 0;
    let pendingCount = 0;
    let draftCount = 0;
    let expiringSoonCount = 0;
    let totalApplicants = 0;
    let totalNewApplicants = 0;
    let totalViews = 0;

    for (const job of jobs) {
      if (job.status === 'PUBLISHED') {
        publishedCount += 1;
        const expiry = getJobExpiryDetails(job.expiresAt, job.status);
        if (expiry.daysLeft !== null && expiry.daysLeft <= 7 && expiry.daysLeft >= 0) {
          expiringSoonCount += 1;
        }
      } else if (job.status === 'PENDING_REVIEW') {
        pendingCount += 1;
      } else if (job.status === 'DRAFT') {
        draftCount += 1;
      }

      totalApplicants += job.applicantsCount || 0;
      totalNewApplicants += job.newApplicantsCount || 0;
      totalViews += job.viewsCount || 0;
    }

    return {
      publishedCount,
      pendingCount,
      draftCount,
      expiringSoonCount,
      totalApplicants,
      totalNewApplicants,
      totalViews,
    };
  }, [jobs]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {/* 1. Active Jobs */}
      <button
        type="button"
        onClick={() => onSelectSegment('published')}
        className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:shadow-md ${
          currentSegment === 'published'
            ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
            : 'border-slate-200 bg-white hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">Active Posts</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-navy text-2xl font-black">{stats.publishedCount}</p>
          <p className="mt-0.5 text-[11.5px] font-medium text-emerald-700">Open for applications</p>
        </div>
      </button>

      {/* 2. Total Applicants */}
      <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">Applicants</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <p className="text-navy text-2xl font-black">{stats.totalApplicants}</p>
            {stats.totalNewApplicants > 0 && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                +{stats.totalNewApplicants} new
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">Across all jobs</p>
        </div>
      </div>

      {/* 3. Expiring Soon */}
      <button
        type="button"
        onClick={() => {
          onSelectSegment('published');
          onSelectSort('expiringSoon');
        }}
        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-amber-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">Expiring Soon</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-110">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-2xl font-black ${stats.expiringSoonCount > 0 ? 'text-amber-600' : 'text-navy'}`}>
            {stats.expiringSoonCount}
          </p>
          <p className="mt-0.5 text-[11.5px] font-medium text-amber-700">Within next 7 days</p>
        </div>
      </button>

      {/* 4. Total Views */}
      <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-purple-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">Job Views</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">
            <Eye className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-navy text-2xl font-black">{stats.totalViews.toLocaleString('en-US')}</p>
          <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">Candidate views</p>
        </div>
      </div>

      {/* 5. In Review & Drafts */}
      <button
        type="button"
        onClick={() => onSelectSegment(stats.pendingCount > 0 ? 'pending' : 'draft')}
        className={`group col-span-2 flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:shadow-md sm:col-span-1 ${
          currentSegment === 'pending' || currentSegment === 'draft'
            ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
            : 'border-slate-200 bg-white hover:border-indigo-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">Pipeline</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-transform group-hover:scale-110">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-navy text-2xl font-black">{stats.pendingCount + stats.draftCount}</p>
          <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">
            {stats.pendingCount} review · {stats.draftCount} drafts
          </p>
        </div>
      </button>
    </div>
  );
}

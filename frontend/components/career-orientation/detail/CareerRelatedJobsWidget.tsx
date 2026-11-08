'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';

export default function CareerRelatedJobsWidget() {
  const { badge, title, description, viewAllCta, deadlinePrefix, applyNowCta, jobs } =
    CAREER_ORIENTATION_MESSAGES.relatedJobsWidget;

  return (
    <div className="border-primary/30 bg-primary-light my-10 rounded-3xl border p-6 shadow-xs sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-primary bg-primary-container mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
          <h3 className="text-on-surface text-xl font-bold sm:text-2xl">{title}</h3>
          <p className="text-on-surface-variant mt-1 text-xs sm:text-sm">{description}</p>
        </div>

        <Link
          href="/jobs"
          className="border-primary text-primary hover:bg-primary inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition hover:text-white"
        >
          <span>{viewAllCta}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group hover:border-primary/60 hover:shadow-elevation-1 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition duration-200 sm:p-5"
          >
            <div>
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  loading="lazy"
                  decoding="async"
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="h-12 w-12 shrink-0 rounded-xl border border-gray-100 bg-white object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/jobs/${job.id}`}>
                    <h4 className="group-hover:text-primary text-on-surface line-clamp-1 text-sm font-bold transition-colors">
                      {job.title}
                    </h4>
                  </Link>
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="hover:text-primary text-on-surface-variant mt-0.5 line-clamp-1 text-xs"
                  >
                    {job.companyName}
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-primary bg-primary-light rounded-md px-2 py-0.5 text-xs font-bold">
                  {job.salary}
                </span>
                <span className="text-on-surface-variant flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {job.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-label-sm text-on-surface-variant rounded bg-gray-100 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {deadlinePrefix} {job.deadline}
              </span>

              <Link
                href={`/jobs/${job.id}`}
                className="bg-primary hover:bg-primary rounded-lg px-3.5 py-1.5 font-bold text-white shadow-xs transition"
              >
                {applyNowCta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import type { CompanyJobItem } from '@/types/company';
import { foldDiacritics } from '@/utils/text';
import { Clock, MapPin, Search, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CompanyJobsSectionProps {
  jobs: CompanyJobItem[];
  companyName: string;
}

export default function CompanyJobsSection({ jobs, companyName }: CompanyJobsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const needle = foldDiacritics(searchTerm.trim());
  const filteredJobs = jobs.filter(
    (job) => foldDiacritics(job.title).includes(needle) || job.tags.some((tag) => foldDiacritics(tag).includes(needle)),
  );

  return (
    <section id="section-jobs" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-title-lg text-on-surface font-bold">Open positions</h2>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} at {companyName}
          </p>
        </div>
        <label className="relative block w-full sm:w-72">
          <Search
            className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by title or skill"
            aria-label="Search open positions"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="text-body-md text-on-surface placeholder:text-on-surface-variant border-outline hover:border-on-surface-variant/60 focus:border-primary h-10 w-full rounded-full border bg-white pr-4 pl-10 transition-colors outline-none focus:ring-2 focus:ring-emerald-600/15"
          />
        </label>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-surface border-outline-variant flex flex-col items-center gap-2 rounded-2xl border px-6 py-14 text-center">
          <SearchX className="text-outline h-9 w-9" aria-hidden />
          <p className="text-title-md text-on-surface font-semibold">No open positions match your search</p>
          <p className="text-body-md text-on-surface-variant">Try a different keyword.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li key={job.id}>
              <article className="group bg-surface border-outline-variant ease-standard hover:border-primary hover:shadow-card relative flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5">
                <div className="min-w-0 flex-1 space-y-3">
                  <h3 className="font-display text-title-md text-on-surface font-bold">
                    <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:content-['']">
                      {job.title}
                    </Link>
                  </h3>
                  <ul className="text-body-md text-on-surface-variant flex flex-wrap gap-x-5 gap-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <MapPin className="text-primary h-4 w-4" aria-hidden />
                      {job.location}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Clock className="text-primary h-4 w-4" aria-hidden />
                      {job.deadline}
                    </li>
                  </ul>
                  {job.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
                      {job.tags.map((tag) => (
                        <li
                          key={tag}
                          className="border-outline-variant text-label-md text-on-surface-variant rounded-md border px-2 py-0.5 font-medium"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="font-display text-title-md text-primary font-bold">{job.salary}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

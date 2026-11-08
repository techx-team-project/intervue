'use client';

import PageHero from '@/components/common/PageHero';
import FollowCompanyButton from '@/components/candidate/saved/FollowCompanyButton';
import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import { Button } from '@/components/ui/Button';
import type { PublicJobResource } from '@/types/public-job';
import { formatDate } from '@/utils/datetime';
import { formatSalary } from '@/utils/public-company';
import { deadlineLabel, jobFacts, textLines } from '@/utils/public-job';
import { Clock, FileQuestion, MapPin, Send, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CandidateApplyModal from './apply/CandidateApplyModal';
import CompanyLogo from './CompanyLogo';

interface PublicJobDetailViewProps {
  job: PublicJobResource;
}

function Section({ title, text }: { title: string; text?: string }) {
  const lines = textLines(text);
  if (lines.length === 0) return null;
  return (
    <section className="bg-surface shadow-card rounded-3xl p-6 sm:p-8">
      <h2 className="text-on-surface text-headline-sm mb-4 font-bold">{title}</h2>
      <ul className="text-body-md text-on-surface space-y-2 leading-relaxed">
        {lines.map((line, index) => (
          <li key={index} className="flex gap-2.5">
            <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PublicJobDetailView({ job }: PublicJobDetailViewProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const facts = jobFacts({
    city: job.location.city,
    level: job.level,
    workingArrangement: job.workingArrangement,
    contractType: job.contractType,
  });
  const address = [job.location.address, job.location.city].filter(Boolean).join(', ');
  const hasQuestions = job.screening.questionCount > 0;

  return (
    <>
      <PageHero
        id="job-title"
        eyebrow={job.company.name}
        title={job.title}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Jobs', href: '/jobs' }, { label: job.title }]}
        overlap
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white">
          <span className="font-display text-headline-sm text-primary-bright font-bold">
            {formatSalary(job.salary)}
          </span>
          {job.location.city && (
            <span className="text-body-lg flex items-center gap-2 text-white/80">
              <MapPin className="h-4 w-4" aria-hidden />
              {job.location.city}
            </span>
          )}
          {job.deadline && (
            <span className="text-body-lg flex items-center gap-2 text-white/80">
              <Clock className="h-4 w-4" aria-hidden />
              {deadlineLabel(job.deadline)} · {formatDate(job.deadline)}
            </span>
          )}
          <Button size="2xl" leftIcon={<Send className="h-4 w-4" />} onClick={() => setIsApplyOpen(true)}>
            Apply now
          </Button>
          <SaveJobButton
            jobId={job.id}
            variant="labeled"
            className="border-white/40 bg-transparent text-white hover:bg-white/10"
          />
        </div>
        {hasQuestions && (
          <p className="text-body-md mt-5 flex items-center gap-2 text-white/70">
            <FileQuestion className="h-4 w-4" aria-hidden />
            The recruiter has {job.screening.questionCount} screening questions
            {job.screening.requiredCount > 0 && ` (${job.screening.requiredCount} required)`}, about{' '}
            {job.screening.estimatedMinutes} minutes.
          </p>
        )}
      </PageHero>

      <div className="container-page relative -mt-16 space-y-5 pb-16">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <Section title="Job description" text={job.description} />
            <Section title="Requirements" text={job.requirements} />
            <Section title="Benefits" text={job.benefits} />

            {job.skills.length > 0 && (
              <section className="bg-surface shadow-card rounded-3xl p-6 sm:p-8">
                <h2 className="text-on-surface text-headline-sm mb-4 font-bold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-surface-container-high text-on-surface rounded-lg px-3 py-1 text-xs font-semibold"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <div className="border-primary/30 rounded-2xl border bg-emerald-50/60 p-5 text-center">
              <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => setIsApplyOpen(true)}>
                Apply for this position
              </Button>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
            <div className="bg-surface shadow-card rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <CompanyLogo name={job.company.name} src={job.company.logoUrl} />
                <p className="text-on-surface text-sm font-bold">{job.company.name}</p>
              </div>
              {job.company.address && (
                <p className="text-on-surface-variant mt-3 text-xs leading-relaxed">{job.company.address}</p>
              )}
              <Link
                href={`/companies/${job.company.id}`}
                className="text-primary mt-3 inline-block text-xs font-bold hover:underline"
              >
                View company page
              </Link>
              <FollowCompanyButton companyId={job.company.id} className="mt-3 w-full" />
            </div>

            <div className="border-outline-variant space-y-3 rounded-2xl border bg-white p-5 shadow-2xs">
              <h3 className="text-on-surface text-sm font-bold">General information</h3>
              <dl className="text-body-md space-y-2.5">
                {facts.map((fact) => (
                  <dd key={fact} className="text-on-surface font-medium">
                    {fact}
                  </dd>
                ))}
                <div className="text-on-surface-variant flex items-center gap-1.5">
                  <Users className="text-outline h-4 w-4" aria-hidden />
                  Openings: {job.openings}
                </div>
                {address && (
                  <div className="text-on-surface-variant flex items-start gap-1.5">
                    <MapPin className="text-outline mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {address}
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>

        <CandidateApplyModal
          job={{
            id: job.id,
            title: job.title,
            companyName: job.company.name,
            requirements: textLines(job.requirements),
            description: job.description,
          }}
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
        />
      </div>
    </>
  );
}

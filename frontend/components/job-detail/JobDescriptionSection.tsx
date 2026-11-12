'use client';

import {
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
  Gift,
  ShieldCheck,
  Send,
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  Award,
  Plane,
  TrendingUp,
  Laptop,
  Coffee,
} from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobDescriptionSectionProps {
  job: JobDetail;
  onApply: () => void;
  onReport?: () => void;
}

const PERK_ICONS: Record<string, React.ElementType> = {
  ShieldCheck,
  Gift,
  Plane,
  TrendingUp,
  Laptop,
  Coffee,
};

export default function JobDescriptionSection({ job, onApply, onReport }: JobDescriptionSectionProps) {
  return (
    <div className="space-y-6">
      <section
        id="job-description"
        className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7"
      >
        <div className="border-outline-variant flex items-center gap-2.5 border-b pb-4">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-on-surface text-lg font-bold sm:text-xl">Job description</h2>
        </div>

        <div className="mt-5 space-y-3">
          {job.jobDescription.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-primary mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100/70">
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              </div>
              <p className="text-body-md text-on-surface leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="job-requirements"
        className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7"
      >
        <div className="border-outline-variant flex items-center gap-2.5 border-b pb-4">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-on-surface text-lg font-bold sm:text-xl">Candidate requirements</h2>
        </div>

        <div className="mt-5">
          <div className="text-on-surface-variant mb-2.5 text-xs font-bold tracking-wider uppercase">
            Preferred skills & expertise
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="border-primary/30 text-on-primary-container hover:bg-primary-container inline-flex items-center rounded-lg border bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {job.requirements.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-0.5 h-4.5 w-4.5 shrink-0" />
              <p className="text-body-md text-on-surface leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="job-benefits"
        className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7"
      >
        <div className="border-outline-variant flex items-center gap-2.5 border-b pb-4">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <Gift className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-on-surface text-lg font-bold sm:text-xl">Candidate benefits</h2>
        </div>

        {job.perks && job.perks.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {job.perks.map((perk, index) => {
              const IconComp = PERK_ICONS[perk.icon] || Award;
              return (
                <div
                  key={index}
                  className="border-outline-variant/80 bg-surface-container-low/70 hover:border-primary/30 rounded-xl border p-3.5 transition hover:bg-emerald-50/40"
                >
                  <div className="text-primary border-outline-variant/60 flex h-8 w-8 items-center justify-center rounded-lg border bg-white shadow-2xs">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div className="text-body-md text-on-surface mt-2 font-bold">{perk.title}</div>
                  <div className="text-label-sm text-on-surface-variant mt-0.5 leading-snug">{perk.desc}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {job.benefits.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-primary bg-primary-container mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              </div>
              <p className="text-body-md text-on-surface leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="job-location"
        className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7"
      >
        <div className="border-outline-variant flex items-center gap-2.5 border-b pb-4">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <MapPin className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-on-surface text-lg font-bold sm:text-xl">Location & working hours</h2>
        </div>

        <div className="mt-5 space-y-4">
          <div className="border-outline-variant bg-surface-container-low/60 rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="text-body-md text-on-surface font-bold">Work location:</div>
                <div className="text-body-md text-on-surface-variant mt-1">{job.location.specificAddress}</div>
                {job.location.allLocations && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-on-surface-variant mr-1 text-xs">Related areas:</span>
                    {job.location.allLocations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="border-outline-variant text-on-surface-variant rounded border bg-white px-2 py-0.5 text-xs font-medium"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-outline-variant bg-surface-container-low/60 rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <div className="text-body-md text-on-surface font-bold">Working hours:</div>
                <div className="text-body-md text-on-surface mt-1 font-medium">{job.workSchedule.days}</div>
                <div className="text-body-md text-on-surface-variant mt-0.5">Hours: {job.workSchedule.time}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-primary/30 bg-primary-light rounded-2xl border p-5 shadow-xs sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="bg-primary-container text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold">
              <Calendar className="h-3.5 w-3.5" />
              <span>Application deadline: {job.deadline}</span>
              {job.daysRemaining && (
                <span className="ml-1 font-bold text-amber-700">({job.daysRemaining} days left)</span>
              )}
            </div>

            <h3 className="text-on-surface mt-2.5 text-lg font-bold sm:text-xl">
              Ready to join the {job.company.name} team?
            </h3>
            <p className="text-on-surface-variant mt-1 text-sm">
              The recruiter responds to applications within 24 - 48 business hours.
            </p>
          </div>

          <button
            type="button"
            onClick={onApply}
            className="shadow-primary/30 hover:shadow-primary/40 bg-primary text-body-lg shadow-elevation-1 hover:shadow-elevation-2 flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white transition active:translate-y-0"
          >
            <Send className="h-4 w-4" />
            <span>Apply now</span>
            <Sparkles className="h-4 w-4 text-emerald-200" />
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="leading-relaxed">
              <span className="font-bold">Safety warning from InterVue:</span> Genuine employers never ask candidates to
              pay recruitment fees, uniform deposits or take part in online top-up activities. If you notice anything
              suspicious, please click{' '}
              <button
                type="button"
                onClick={onReport}
                className="cursor-pointer font-semibold text-amber-900 underline hover:text-amber-700"
              >
                Report bad post
              </button>{' '}
              so we can help protect your rights.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

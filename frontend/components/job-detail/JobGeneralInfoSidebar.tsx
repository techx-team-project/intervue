'use client';

import { Award, Briefcase, Users, Building, Clock, User, Tag, MapPin, ShieldCheck } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobGeneralInfoSidebarProps {
  job: JobDetail;
}

export default function JobGeneralInfoSidebar({ job }: JobGeneralInfoSidebarProps) {
  const specs = [
    {
      icon: Award,
      label: 'Level',
      value: job.level,
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: job.experience,
    },
    {
      icon: Users,
      label: 'Openings',
      value: job.recruitsCount,
    },
    {
      icon: Building,
      label: 'Working arrangement',
      value: job.workingType,
    },
    {
      icon: Clock,
      label: 'Contract type',
      value: job.employmentType,
    },
    {
      icon: User,
      label: 'Gender',
      value: job.gender,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs">
        <h3 className="border-outline-variant text-on-surface border-b pb-3 text-sm font-bold">General information</h3>

        <div className="mt-4 space-y-3.5">
          {specs.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="border-outline-variant/80 bg-surface-container-low text-on-surface-variant flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-label-sm text-outline font-medium">{item.label}</div>
                  <div className="text-body-md text-on-surface mt-0.5 truncate font-bold">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs">
        <h3 className="border-outline-variant text-on-surface flex items-center gap-1.5 border-b pb-3 text-sm font-bold">
          <Tag className="text-primary h-4 w-4" />
          <span>Occupation & Industry</span>
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              className="hover:text-primary border-outline-variant bg-surface-container-low text-on-surface hover:border-primary/40 cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:bg-emerald-50/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {job.location.allLocations && (
          <div className="border-outline-variant mt-4 border-t pt-4">
            <div className="text-on-surface-variant mb-2 flex items-center gap-1 text-xs font-bold">
              <MapPin className="text-outline h-3.5 w-3.5" />
              <span>Related search areas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.location.allLocations.map((loc, idx) => (
                <span
                  key={idx}
                  className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-medium"
                >
                  {loc} - Hà Nội
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-primary-light text-on-surface rounded-2xl border border-emerald-100 p-4 text-xs">
        <div className="text-on-primary-container mb-1 flex items-center gap-2 font-bold">
          <ShieldCheck className="text-primary h-4 w-4" />
          <span>InterVue transparency commitment</span>
        </div>
        <p className="text-label-sm text-on-surface-variant leading-relaxed">
          Every job post goes through business license review and company identity verification before it is published.
        </p>
      </div>
    </div>
  );
}

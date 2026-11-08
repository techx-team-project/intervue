'use client';

import {
  CAREER_LEVEL_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
  optionLabel,
} from '@/constants/candidate-profile';
import type { CandidateProfileResponse } from '@/types/candidate-profile';
import { formatSalaryRange } from '@/utils/candidate-profile';
import { Banknote, Briefcase, Building, Compass, Edit3, MapPin } from 'lucide-react';

type CandidateJobPreferencesSidebarProps = {
  profile: CandidateProfileResponse;
  onEdit: () => void;
};

const NOT_SET = 'Not set';

export default function CandidateJobPreferencesSidebar({ profile, onEdit }: CandidateJobPreferencesSidebarProps) {
  const salary = formatSalaryRange(profile);
  const details = [
    optionLabel(WORK_MODE_OPTIONS, profile.workMode),
    optionLabel(CONTRACT_TYPE_OPTIONS, profile.contractType),
    optionLabel(CAREER_LEVEL_OPTIONS, profile.desiredLevel),
  ].filter((item): item is string => item !== null);

  return (
    <section className="border-outline-variant rounded-3xl border bg-white p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-xl">
            <Compass className="h-4 w-4" />
          </div>
          <h2 className="text-navy text-body-lg font-bold">Job preferences</h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-primary text-body-sm flex cursor-pointer items-center gap-1 font-semibold hover:underline"
        >
          <Edit3 className="h-3 w-3" />
          Update
        </button>
      </div>

      <div className="text-body-md space-y-4">
        <div className="flex items-start gap-3">
          <Briefcase className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-label-sm text-on-surface-variant font-medium">Desired role</div>
            <div className="text-on-surface font-semibold">{profile.desiredRole ?? NOT_SET}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Banknote className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-label-sm text-on-surface-variant font-medium">Expected salary</div>
            <div className="text-primary font-bold">{salary ?? NOT_SET}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Building className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-label-sm text-on-surface-variant font-medium">Work mode, contract and level</div>
            <div className="text-on-surface font-semibold">{details.length > 0 ? details.join(' / ') : NOT_SET}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-label-sm text-on-surface-variant font-medium">Preferred locations</div>
            {profile.preferredLocations.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.preferredLocations.map((location) => (
                  <span
                    key={location}
                    className="bg-surface-container-low text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-medium"
                  >
                    {location}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-on-surface font-semibold">{NOT_SET}</div>
            )}
          </div>
        </div>

        <div className="border-outline-variant border-t pt-3">
          <div className="text-label-sm text-on-surface-variant mb-1.5 font-medium">Industries of interest</div>
          {profile.preferredIndustries.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredIndustries.map((industry) => (
                <span
                  key={industry}
                  className="border-primary/30 text-label-sm text-primary rounded-full border bg-emerald-50/60 px-2.5 py-0.5 font-semibold"
                >
                  {industry}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-on-surface font-semibold">{NOT_SET}</div>
          )}
        </div>
      </div>
    </section>
  );
}

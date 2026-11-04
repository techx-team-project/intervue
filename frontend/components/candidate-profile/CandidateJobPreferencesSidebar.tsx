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
    <section className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
            <Compass className="h-4 w-4" />
          </div>
          <h2 className="text-navy text-[15.5px] font-bold">Job preferences</h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-primary flex cursor-pointer items-center gap-1 text-[12px] font-semibold hover:underline"
        >
          <Edit3 className="h-3 w-3" />
          Update
        </button>
      </div>

      <div className="space-y-4 text-[13px]">
        <div className="flex items-start gap-3">
          <Briefcase className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Desired role</div>
            <div className="font-semibold text-[#1e293b]">{profile.desiredRole ?? NOT_SET}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Banknote className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Expected salary</div>
            <div className="text-primary font-bold">{salary ?? NOT_SET}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Building className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Work mode, contract and level</div>
            <div className="font-semibold text-[#1e293b]">{details.length > 0 ? details.join(' / ') : NOT_SET}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Preferred locations</div>
            {profile.preferredLocations.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.preferredLocations.map((location) => (
                  <span
                    key={location}
                    className="rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[11.5px] font-medium text-[#475569]"
                  >
                    {location}
                  </span>
                ))}
              </div>
            ) : (
              <div className="font-semibold text-[#1e293b]">{NOT_SET}</div>
            )}
          </div>
        </div>

        <div className="border-t border-[#f1f5f9] pt-3">
          <div className="mb-1.5 text-[11.5px] font-medium text-[#64748b]">Industries of interest</div>
          {profile.preferredIndustries.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredIndustries.map((industry) => (
                <span
                  key={industry}
                  className="rounded-full border border-emerald-200 bg-emerald-50/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#00873c]"
                >
                  {industry}
                </span>
              ))}
            </div>
          ) : (
            <div className="font-semibold text-[#1e293b]">{NOT_SET}</div>
          )}
        </div>
      </div>
    </section>
  );
}

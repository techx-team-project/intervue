'use client';

import { Banknote, Briefcase, Building, Compass, Edit3, MapPin, Sparkles } from 'lucide-react';
import type { JobPreferences } from '@/types/candidate';

interface CandidateJobPreferencesSidebarProps {
  preferences: JobPreferences;
  isOwner?: boolean;
  onEdit?: () => void;
}

export default function CandidateJobPreferencesSidebar({
  preferences,
  isOwner = true,
  onEdit,
}: CandidateJobPreferencesSidebarProps) {
  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
            <Compass className="h-4 w-4" />
          </div>
          <h2 className="text-[15.5px] font-bold text-[#263a4d]">Kỳ vọng công việc</h2>
        </div>

        {isOwner && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#00b14f] hover:underline"
          >
            <Edit3 className="h-3 w-3" />
            Cập nhật
          </button>
        )}
      </div>

      <div className="space-y-4 text-[13px]">
        {/* Desired Role */}
        <div className="flex items-start gap-3">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Vị trí mong muốn:</div>
            <div className="font-semibold text-[#1e293b]">{preferences.desiredRole}</div>
          </div>
        </div>

        {/* Expected Salary */}
        <div className="flex items-start gap-3">
          <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Mức lương kỳ vọng:</div>
            <div className="font-bold text-[#00b14f]">{preferences.desiredSalary}</div>
          </div>
        </div>

        {/* Work Mode & Type */}
        <div className="flex items-start gap-3">
          <Building className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Hình thức & Cấp bậc:</div>
            <div className="font-semibold text-[#1e293b]">
              {preferences.workMode} • {preferences.jobType} • {preferences.level}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
          <div>
            <div className="text-[11.5px] font-medium text-[#64748b]">Địa điểm làm việc:</div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferences.desiredLocation.map((loc, i) => (
                <span key={i} className="rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[11.5px] font-medium text-[#475569]">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="border-t border-[#f1f5f9] pt-3">
          <div className="mb-1.5 text-[11.5px] font-medium text-[#64748b]">Lĩnh vực quan tâm:</div>
          <div className="flex flex-wrap gap-1.5">
            {preferences.industries.map((ind, i) => (
              <span
                key={i}
                className="rounded-full border border-emerald-200 bg-emerald-50/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#00873c]"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Briefcase, Building2, Calendar, CheckCircle2, MapPin, Plus } from 'lucide-react';
import type { WorkExperience } from '@/types/candidate';

interface CandidateExperienceSectionProps {
  experiences: WorkExperience[];
  isOwner?: boolean;
  onAddExperience?: () => void;
}

export default function CandidateExperienceSection({
  experiences,
  isOwner = true,
  onAddExperience,
}: CandidateExperienceSectionProps) {
  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#263a4d] sm:text-xl">Kinh nghiệm làm việc</h2>
            <p className="text-[12.5px] text-[#6f7882]">Hành trình sự nghiệp và các dấu ấn nổi bật</p>
          </div>
        </div>

        {isOwner && onAddExperience && (
          <button
            type="button"
            onClick={onAddExperience}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e9eaec] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#00b14f] transition-all hover:border-[#00b14f] hover:bg-[#f2fbf6]"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm kinh nghiệm</span>
          </button>
        )}
      </div>

      {/* Timeline List */}
      <div className="-before:translate-x-1/2 relative space-y-8 before:absolute before:top-7 before:bottom-8 before:left-4 before:w-0.5 before:bg-[#e2e8f0] sm:before:left-5">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-10 sm:pl-12">
            {/* Timeline Bullet */}
            <div
              className={`absolute top-7 left-4 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-2xs sm:left-5 ${
                exp.isCurrent ? 'bg-[#00b14f] ring-4 ring-emerald-100' : 'bg-[#94a3b8]'
              }`}
            >
              {exp.isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
            </div>

            {/* Experience Card */}
            <div className="rounded-2xl border border-[#f1f5f9] bg-[#fbfcfd] p-5 transition-all hover:border-[#cbd5e1] hover:bg-white hover:shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16px] font-bold text-[#1e293b]">{exp.role}</h3>
                    {exp.isCurrent && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-[#00873c]">
                        Đang làm việc
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[13.5px] text-[#475569]">
                    <span className="flex items-center gap-1 font-semibold text-[#00b14f]">
                      <Building2 className="h-3.5 w-3.5" />
                      {exp.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#64748b]">
                      <MapPin className="h-3.5 w-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-[#64748b] shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 text-[#00b14f]" />
                  <span>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
              </div>

              {/* Responsibilities */}
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#334155]">{exp.description}</p>

              {/* Quantified Achievements */}
              {exp.achievements.length > 0 && (
                <div className="mt-3.5 space-y-1.5 rounded-xl border border-[#f1f5f9] bg-white p-3.5">
                  <div className="text-[12px] font-bold tracking-wider text-[#00b14f] uppercase">
                    Thành tựu chính & Đóng góp tiêu biểu:
                  </div>
                  <ul className="space-y-1.5 text-[13px] text-[#334155]">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00b14f]" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Pills */}
              {exp.skills.length > 0 && (
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-[#f1f5f9] pt-2">
                  <span className="text-[11.5px] font-medium text-[#64748b]">Công nghệ:</span>
                  {exp.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-[#e2e8f0] bg-white px-2 py-0.5 text-[11.5px] font-medium text-[#334155]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

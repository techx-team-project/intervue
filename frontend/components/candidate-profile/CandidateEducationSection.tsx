'use client';

import { Award, Calendar, GraduationCap } from 'lucide-react';
import type { Education } from '@/types/candidate';

interface CandidateEducationSectionProps {
  educations: Education[];
  isOwner?: boolean;
  onAddEducation?: () => void;
}

export default function CandidateEducationSection({
  educations,
  isOwner = true,
  onAddEducation,
}: CandidateEducationSectionProps) {
  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-navy text-lg font-bold sm:text-xl">Học vấn & Bằng cấp</h2>
            <p className="text-[12.5px] text-[#6f7882]">Trường đào tạo và các thành tích học thuật</p>
          </div>
        </div>

        {isOwner && onAddEducation && (
          <button
            type="button"
            onClick={onAddEducation}
            className="text-primary hover:border-primary hover:bg-primary-light inline-flex items-center gap-1.5 rounded-xl border border-[#e9eaec] bg-white px-3 py-1.5 text-[12.5px] font-semibold transition-all"
          >
            <span>+ Thêm học vấn</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="rounded-2xl border border-[#f1f5f9] bg-[#fbfcfd] p-5 transition-all hover:border-[#cbd5e1] hover:bg-white"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-[16px] font-bold text-[#1e293b]">{edu.school}</h3>
                <div className="text-primary text-[14px] font-semibold">{edu.degree}</div>
                <div className="text-[13px] text-[#64748b]">Chuyên ngành: {edu.major}</div>
                {edu.gpa && (
                  <div className="mt-1 text-[13px] font-medium text-[#334155]">
                    Điểm trung bình (GPA): <strong className="text-primary">{edu.gpa}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 self-start rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-[#64748b] shadow-2xs">
                <Calendar className="text-primary h-3.5 w-3.5" />
                <span>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>

            {edu.achievements && edu.achievements.length > 0 && (
              <div className="mt-3 space-y-1 rounded-xl border border-[#f1f5f9] bg-white p-3">
                {edu.achievements.map((ach, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12.5px] text-[#475569]">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

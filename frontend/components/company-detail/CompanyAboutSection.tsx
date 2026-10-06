'use client';

import { Sparkles, Award, HeartPulse, Users, MapPin, Building } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanyAboutSectionProps {
  company: CompanyDetail;
}

const HIGHLIGHT_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Award,
  HeartPulse,
  Users,
};

export default function CompanyAboutSection({ company }: CompanyAboutSectionProps) {
  return (
    <div className="space-y-6">
      {/* 1. GIỚI THIỆU CÔNG TY */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#00b14f]">
            <Building className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Giới thiệu công ty</h2>
        </div>

        {/* Text descriptions */}
        <div className="mt-5 space-y-3.5 text-[14.5px] leading-relaxed text-slate-700">
          {company.description.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Core Highlights 4-Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {company.highlights.map((item, idx) => {
            const IconComp = HIGHLIGHT_ICONS[item.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-white text-[#00b14f] shadow-2xs">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <h3 className="text-[13.5px] font-bold text-slate-800">{item.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. HỆ THỐNG CHI NHÁNH & VĂN PHÒNG */}
      {company.branches && company.branches.length > 0 && (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#00b14f]">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Hệ thống chi nhánh & văn phòng</h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {company.branches.map((branch, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/50 to-teal-50/20 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00b14f] text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{branch.name}</h3>
                </div>

                <div className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-600">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{branch.address}</span>
                </div>

                {branch.phone && (
                  <div className="mt-2 text-xs font-semibold text-[#00873c]">Hotline: {branch.phone}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. PHÚC LỢI KHI LÀM VIỆC TẠI MẸ GẤU PILATES */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#00b14f]">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Quyền lợi & Đãi ngộ nhân sự</h2>
        </div>

        <div className="mt-5 space-y-3">
          {company.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#00b14f]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00b14f]" />
              </div>
              <p className="text-[14px] leading-relaxed text-slate-700">{benefit}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

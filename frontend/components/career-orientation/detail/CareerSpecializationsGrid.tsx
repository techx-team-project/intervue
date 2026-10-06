'use client';

import React from 'react';
import { CareerSpecialization } from '@/types/career';
import { Layers, TrendingUp, Check } from 'lucide-react';

interface CareerSpecializationsGridProps {
  specializations: CareerSpecialization[];
}

export default function CareerSpecializationsGrid({ specializations }: CareerSpecializationsGridProps) {
  if (!specializations || specializations.length === 0) return null;

  return (
    <div className="my-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#171717] sm:text-2xl">
            Các chuyên ngành Marketing tiềm năng nhất 2026
          </h3>
          <p className="mt-0.5 text-xs text-[#7f878f] sm:text-sm">
            Lựa chọn chuyên ngành phù hợp với sở trường phân tích hay sáng tạo nghệ thuật
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {specializations.map((spec, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition duration-200 hover:border-[#00b14f]/50 hover:shadow-md sm:p-6"
          >
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-base font-bold text-[#171717]">{spec.title}</h4>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#00b14f]">
                  {spec.avgSalary}
                </span>
              </div>

              <p className="mb-4 text-xs leading-relaxed text-[#526475] sm:text-sm">{spec.description}</p>

              {/* Skills */}
              <div className="mb-3">
                <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-[#263a4d] uppercase">
                  Kỹ năng cốt lõi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spec.keySkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-[#263a4d]"
                    >
                      <Check className="h-3 w-3 text-[#00b14f]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-[#263a4d] uppercase">
                  Công cụ thường dùng:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spec.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md border border-emerald-200/50 bg-emerald-50/60 px-2 py-0.5 text-[11px] font-medium text-[#00b14f]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                {spec.growthRate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

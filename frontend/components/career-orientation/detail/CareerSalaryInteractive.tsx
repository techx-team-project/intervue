'use client';

import React, { useState } from 'react';
import { CareerSalaryTier } from '@/types/career';
import { Banknote, Award, Briefcase } from 'lucide-react';

interface CareerSalaryInteractiveProps {
  salaryTiers: CareerSalaryTier[];
}

export default function CareerSalaryInteractive({ salaryTiers }: CareerSalaryInteractiveProps) {
  const [activeTierIndex, setActiveTierIndex] = useState(1); // Default Fresher

  if (!salaryTiers || salaryTiers.length === 0) return null;

  const currentTier = salaryTiers[activeTierIndex];

  return (
    <div className="my-8 rounded-3xl border border-emerald-200 bg-linear-to-b from-[#f2fbf6] via-white to-white p-6 shadow-xs sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#00b14f]">
            <Banknote className="h-3.5 w-3.5" />
            <span>Thống Kê Khảo Sát Thu Nhập 2026</span>
          </div>
          <h3 className="text-xl font-bold text-[#171717] sm:text-2xl">Bảng mức lương ngành Marketing theo cấp bậc</h3>
          <p className="mt-1 text-xs text-[#526475] sm:text-sm">
            Dữ liệu khảo sát từ hơn 5.000 tin tuyển dụng thực tế và báo cáo tiền lương của InterVue.
          </p>
        </div>
      </div>

      {/* Seniority tabs selector */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
        {salaryTiers.map((tier, idx) => {
          const isSelected = activeTierIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTierIndex(idx)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isSelected
                  ? 'scale-102 bg-[#00b14f] text-white shadow-md shadow-[#00b14f]/25'
                  : 'border border-gray-200 bg-white text-[#526475] hover:border-[#00b14f] hover:text-[#00b14f]'
              }`}
            >
              {tier.level.split('(')[0].trim()}
            </button>
          );
        })}
      </div>

      {/* Selected Tier Spotlight Card */}
      <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#7f878f] uppercase">Cấp bậc kinh nghiệm</span>
            <h4 className="mt-0.5 text-lg font-bold text-[#171717] sm:text-xl">{currentTier.level}</h4>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-[#526475]">
              <Briefcase className="h-3.5 w-3.5 text-[#00b14f]" />
              <span>
                Yêu cầu kinh nghiệm: <strong>{currentTier.experience}</strong>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-[#f2fbf6] p-4 text-center md:min-w-64">
            <span className="text-xs font-medium text-[#526475]">Khoảng thu nhập bình quân</span>
            <div className="mt-1 text-xl font-black text-[#00b14f] sm:text-2xl">{currentTier.range}</div>
            <span className="mt-0.5 block text-[11px] text-[#7f878f]">+ Thưởng KPI & Hoa hồng theo doanh thu</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <h5 className="mb-2 text-xs font-bold tracking-wider text-[#263a4d] uppercase">
              Mô tả trách nhiệm cốt lõi
            </h5>
            <p className="text-sm leading-relaxed text-[#526475]">{currentTier.description}</p>
          </div>

          <div>
            <h5 className="mb-2 text-xs font-bold tracking-wider text-[#263a4d] uppercase">
              Các chức danh việc làm tiêu biểu
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentTier.popularRoles.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-[#00b14f]"
                >
                  <Award className="h-3 w-3" />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

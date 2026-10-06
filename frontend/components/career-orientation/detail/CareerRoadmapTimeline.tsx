'use client';

import React from 'react';
import { CareerRoadmapStage } from '@/types/career';
import { Milestone, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

interface CareerRoadmapTimelineProps {
  stages: CareerRoadmapStage[];
}

export default function CareerRoadmapTimeline({ stages }: CareerRoadmapTimelineProps) {
  if (!stages || stages.length === 0) return null;

  return (
    <div className="my-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
          <Milestone className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#171717] sm:text-2xl">Lộ trình thăng tiến trong ngành Marketing</h3>
          <p className="mt-0.5 text-xs text-[#7f878f] sm:text-sm">
            5 giai đoạn chuẩn hóa từ Thực tập sinh đến Giám đốc Tiếp thị (CMO)
          </p>
        </div>
      </div>

      <div className="relative ml-4 space-y-8 border-l-2 border-[#00b14f]/30 pl-6 sm:ml-6 sm:pl-8">
        {stages.map((stage) => (
          <div key={stage.step} className="group relative">
            {/* Step marker bubble */}
            <div className="absolute top-0 -left-8.75 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#00b14f] text-xs font-black text-white shadow-md transition-transform duration-300 group-hover:scale-110 sm:-left-10.75 sm:h-9 sm:w-9 sm:text-sm">
              {stage.step}
            </div>

            {/* Stage card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#00b14f]/50 hover:shadow-lg sm:p-6">
              <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center">
                <h4 className="text-base font-bold text-[#171717] sm:text-lg">{stage.title}</h4>

                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 font-medium text-[#526475]">
                    <Clock className="h-3 w-3 text-[#00b14f]" />
                    {stage.duration}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-bold text-[#00b14f]">
                    {stage.salaryEstimate}
                  </span>
                </div>
              </div>

              {/* Responsibilities & Skills */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h5 className="mb-2 flex items-center gap-1 text-xs font-semibold tracking-wider text-[#263a4d] uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#00b14f]" />
                    Trách nhiệm chính
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#526475]">
                    {stage.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00b14f]" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="mb-2 flex items-center gap-1 text-xs font-semibold tracking-wider text-[#263a4d] uppercase">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                    Kỹ năng & Năng lực cần có
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-[#263a4d]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { CV_STEPS } from '@/mocks/cv-template.mock';
import { MousePointerClick, Edit3, Download, Sparkles } from 'lucide-react';

const STEP_ICONS = [MousePointerClick, Edit3, Download];

export default function CvStepGuideSection() {
  return (
    <section className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="text-primary mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Quy Trình Tạo CV Đơn Giản & Nhanh Chóng</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#171717] sm:text-3xl">
            Tạo CV online miễn phí chỉ với 3 bước
          </h2>
          <p className="mt-2 text-xs text-[#526475] sm:text-sm">
            Hơn 850.000 ứng viên đã tạo thành công CV chuẩn ATS và tìm được công việc ưng ý cùng InterVue.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CV_STEPS.map((step, idx) => {
            const IconComponent = STEP_ICONS[idx] || Sparkles;
            return (
              <div
                key={step.step}
                className="hover:border-primary/50 relative flex flex-col items-center rounded-3xl border border-gray-100 bg-[#f8faf9] p-6 text-center transition duration-300 hover:shadow-lg"
              >
                {/* Step badge */}
                <div className="bg-primary absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white shadow-md">
                  {step.step}
                </div>

                <div className="text-primary mt-3 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-xs">
                  <IconComponent className="h-7 w-7" />
                </div>

                <h3 className="mb-2 text-base font-bold text-[#171717]">{step.title}</h3>

                <p className="text-xs leading-relaxed text-[#526475] sm:text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { CV_BENEFITS } from '@/mocks/cv-template.mock';
import { ShieldCheck, Eye, Sliders, FileCheck2, Sparkles } from 'lucide-react';

const BENEFIT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Eye,
  Sliders,
  FileCheck2,
};

export default function CvBenefitsSection() {
  return (
    <section className="border-t border-gray-200 bg-linear-to-b from-[#f8faf9] to-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-[#00b14f]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ưu Điểm Vượt Trội Của Mẫu CV Đơn Giản</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#171717] sm:text-3xl">
            Tại sao nên chọn mẫu CV xin việc đơn giản của InterVue?
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#526475] sm:text-sm">
            Thiết kế tối giản không có nghĩa là sơ sài. Đây là tiêu chuẩn được các nhà tuyển dụng hàng đầu và chuyên gia
            nhân sự quốc tế khuyến khích.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CV_BENEFITS.map((b, idx) => {
            const IconComponent = BENEFIT_ICONS[b.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#00b14f]/50 hover:shadow-xl"
              >
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#00b14f]">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-base leading-snug font-bold text-[#171717]">{b.title}</h3>
                  <p className="text-xs leading-relaxed text-[#526475] sm:text-sm">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

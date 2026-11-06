'use client';

import { Building, Sparkles } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanyAboutSectionProps {
  company: CompanyDetail;
}

export default function CompanyAboutSection({ company }: CompanyAboutSectionProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Building className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Giới thiệu công ty</h2>
        </div>

        <div className="mt-5 space-y-3.5 text-[14.5px] leading-relaxed text-slate-700">
          {company.description.length > 0 ? (
            company.description.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
          ) : (
            <p className="text-slate-500">Doanh nghiệp chưa cập nhật phần giới thiệu.</p>
          )}
        </div>
      </section>

      {company.benefits.length > 0 && (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Quyền lợi & Đãi ngộ nhân sự</h2>
          </div>

          <div className="mt-5 space-y-3">
            {company.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="text-primary mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                </div>
                <p className="text-[14px] leading-relaxed text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

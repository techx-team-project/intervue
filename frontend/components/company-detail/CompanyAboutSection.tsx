'use client';

import { Building, Sparkles } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';

interface CompanyAboutSectionProps {
  company: CompanyDetail;
}

export default function CompanyAboutSection({ company }: CompanyAboutSectionProps) {
  return (
    <div className="space-y-6">
      <section className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7">
        <div className="border-outline-variant flex items-center gap-2.5 border-b pb-4">
          <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
            <Building className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-on-surface text-lg font-bold sm:text-xl">Giới thiệu công ty</h2>
        </div>

        <div className="text-body-md text-on-surface mt-5 space-y-3.5 leading-relaxed">
          {company.description.length > 0 ? (
            company.description.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
          ) : (
            <p className="text-on-surface-variant">Doanh nghiệp chưa cập nhật phần giới thiệu.</p>
          )}
        </div>
      </section>

      {company.benefits.length > 0 && (
        <section className="border-outline-variant/90 rounded-2xl border bg-white p-5 shadow-2xs sm:p-7">
          <div className="border-outline-variant flex items-center gap-2.5 border-b pb-4">
            <div className="text-primary bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-on-surface text-lg font-bold sm:text-xl">Quyền lợi & Đãi ngộ nhân sự</h2>
          </div>

          <div className="mt-5 space-y-3">
            {company.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="text-primary bg-primary-container mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                </div>
                <p className="text-body-md text-on-surface leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

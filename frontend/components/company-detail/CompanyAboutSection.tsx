'use client';

import type { CompanyDetail } from '@/types/company';

interface CompanyAboutSectionProps {
  company: CompanyDetail;
}

export default function CompanyAboutSection({ company }: CompanyAboutSectionProps) {
  return (
    <div className="space-y-6">
      <section className="border-outline-variant bg-surface rounded-2xl border p-6 sm:p-8">
        <h2 className="font-display text-title-lg text-on-surface font-bold">About the company</h2>

        <div className="text-body-lg text-on-surface mt-4 space-y-3.5 leading-relaxed">
          {company.description.length > 0 ? (
            company.description.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
          ) : (
            <p className="text-on-surface-variant">This company has not added an introduction yet.</p>
          )}
        </div>
      </section>

      {company.benefits.length > 0 && (
        <section className="border-outline-variant bg-surface rounded-2xl border p-6 sm:p-8">
          <h2 className="font-display text-title-lg text-on-surface font-bold">Benefits & perks</h2>

          <div className="mt-4 space-y-3">
            {company.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="bg-outline mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                <p className="text-body-lg text-on-surface leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

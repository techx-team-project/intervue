'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '@/types/upgrade';
import { cn } from '@/lib/utils';

interface PricingFaqSectionProps {
  faqs: FaqItem[];
}

export function PricingFaqSection({ faqs }: PricingFaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (id: number) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>GIẢI ĐÁP THẮC MẮC</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Câu hỏi thường gặp</h2>
          <p className="mt-1 text-sm text-slate-500">
            Những thắc mắc phổ biến nhất của ứng viên khi nâng cấp tài khoản
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div
                key={faq.id}
                className={cn(
                  'overflow-hidden rounded-2xl border transition-all duration-200',
                  isOpen
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-base font-bold text-slate-800"
                >
                  <span className={cn(isOpen && 'text-emerald-600')}>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                      isOpen && 'rotate-180 text-emerald-600',
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="animate-in fade-in px-5 pb-5 text-sm leading-relaxed text-slate-600 duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PricingFaqSection;

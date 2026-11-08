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
          <div className="border-primary/30 bg-primary-light text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>GIẢI ĐÁP THẮC MẮC</span>
          </div>
          <h2 className="text-on-surface mt-2 text-2xl font-extrabold sm:text-3xl">Câu hỏi thường gặp</h2>
          <p className="text-on-surface-variant mt-1 text-sm">
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
                  'overflow-hidden rounded-2xl border transition duration-200',
                  isOpen
                    ? 'border-primary/40 bg-emerald-50/20 shadow-xs'
                    : 'border-outline-variant hover:border-outline bg-white',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="text-on-surface flex w-full cursor-pointer items-center justify-between p-5 text-left text-base font-bold"
                >
                  <span className={cn(isOpen && 'text-primary')}>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'text-outline h-4 w-4 shrink-0 transition-transform duration-200',
                      isOpen && 'text-primary rotate-180',
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="text-on-surface-variant px-5 pb-5 text-sm leading-relaxed">{faq.answer}</div>
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

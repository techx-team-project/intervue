'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { GiftFaqItem } from '@/types/gift';
import { cn } from '@/lib/utils';

interface GiftFaqSectionProps {
  faqs: GiftFaqItem[];
}

export function GiftFaqSection({ faqs }: GiftFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto mt-14 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="border-primary/30 bg-primary-light text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>HỖ TRỢ</span>
        </div>
        <h2 className="text-on-surface mt-2 text-2xl font-extrabold sm:text-3xl">Câu hỏi về mã quà tặng</h2>
        <p className="text-on-surface-variant mt-1 text-sm">Giải đáp các vấn đề thường gặp khi sử dụng mã ưu đãi</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={cn(
                'overflow-hidden rounded-2xl border bg-white transition duration-200',
                isOpen ? 'border-primary/40 bg-emerald-50/10 shadow-xs' : 'border-outline-variant hover:border-outline',
              )}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="text-on-surface flex w-full cursor-pointer items-center justify-between p-5 text-left text-base font-bold"
              >
                <span className={cn(isOpen && 'text-primary')}>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'text-outline h-4 w-4 shrink-0 transition-transform duration-200',
                    isOpen && 'text-primary rotate-180',
                  )}
                />
              </button>

              {isOpen && <div className="text-on-surface-variant px-5 pb-5 text-sm leading-relaxed">{faq.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GiftFaqSection;

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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>HỖ TRỢ</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Câu hỏi về mã quà tặng</h2>
        <p className="mt-1 text-sm text-slate-500">Giải đáp các vấn đề thường gặp khi sử dụng mã ưu đãi</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={cn(
                'overflow-hidden rounded-2xl border bg-white transition-all duration-200',
                isOpen ? 'border-emerald-300 bg-emerald-50/10 shadow-xs' : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-base font-bold text-slate-800"
              >
                <span className={cn(isOpen && 'text-emerald-600')}>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                    isOpen && 'rotate-180 text-emerald-600',
                  )}
                />
              </button>

              {isOpen && (
                <div className="animate-in fade-in px-5 pb-5 text-sm leading-relaxed text-slate-600 duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GiftFaqSection;

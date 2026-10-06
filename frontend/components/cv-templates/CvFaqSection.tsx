'use client';

import React, { useState } from 'react';
import { CV_FAQS } from '@/mocks/cv-template.mock';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function CvFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-t border-gray-200 bg-white py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-[#00b14f]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Giải Đáp Thắc Mắc</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#171717] sm:text-3xl">
            Câu hỏi thường gặp về Mẫu CV đơn giản
          </h2>
        </div>

        <div className="space-y-3.5">
          {CV_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:border-[#00b14f]/50"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-[#171717] transition hover:text-[#00b14f] sm:text-base"
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-[#f8faf9]/50 p-5 pt-3 text-xs leading-relaxed text-[#526475] sm:text-sm">
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

'use client';

import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { CV_FAQS } from '@/mocks/cv-template.mock';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function CvFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { title } = CV_TEMPLATE_MESSAGES.faq;

  return (
    <section aria-labelledby="cv-faq-title" className="bg-surface border-outline-variant border-t py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <h2
          id="cv-faq-title"
          className="font-display text-headline-lg text-on-surface font-bold tracking-tight lg:sticky lg:top-28 lg:self-start"
        >
          {title}
        </h2>

        <ul className="border-outline-variant divide-outline-variant divide-y border-y">
          {CV_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={faq.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="text-title-md text-on-surface hover:text-primary flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-semibold transition-colors"
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      'text-on-surface-variant h-5 w-5 shrink-0 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen && <p className="text-body-lg text-on-surface-variant pb-5 leading-relaxed">{faq.answer}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

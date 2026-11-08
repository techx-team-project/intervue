'use client';

import React from 'react';
import { CV_STEPS } from '@/mocks/cv-template.mock';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { MousePointerClick, Edit3, Download, Sparkles } from 'lucide-react';

const STEP_ICONS = [MousePointerClick, Edit3, Download];

export default function CvStepGuideSection() {
  const { badge, title, description } = CV_TEMPLATE_MESSAGES.stepGuide;

  return (
    <section className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="text-primary bg-primary-container mb-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-on-surface text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="text-on-surface-variant mt-2 text-xs sm:text-sm">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CV_STEPS.map((step, idx) => {
            const IconComponent = STEP_ICONS[idx] || Sparkles;
            return (
              <div
                key={step.step}
                className="hover:border-primary/50 bg-surface-container-low hover:shadow-elevation-2 relative flex flex-col items-center rounded-3xl border border-gray-100 p-6 text-center transition duration-300"
              >
                <div className="bg-primary shadow-elevation-1 absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
                  {step.step}
                </div>

                <div className="text-primary mt-3 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-xs">
                  <IconComponent className="h-7 w-7" />
                </div>

                <h3 className="text-on-surface mb-2 text-base font-bold">{step.title}</h3>

                <p className="text-on-surface-variant text-xs leading-relaxed sm:text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

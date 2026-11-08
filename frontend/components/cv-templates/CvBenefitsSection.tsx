'use client';

import React from 'react';
import { CV_BENEFITS } from '@/mocks/cv-template.mock';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { ShieldCheck, Eye, Sliders, FileCheck2, Sparkles } from 'lucide-react';

const BENEFIT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Eye,
  Sliders,
  FileCheck2,
};

export default function CvBenefitsSection() {
  const { badge, title, description } = CV_TEMPLATE_MESSAGES.benefits;

  return (
    <section className="bg-surface border-t border-gray-200 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="text-primary bg-primary-container mb-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-on-surface text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="text-on-surface-variant mt-2 text-xs leading-relaxed sm:text-sm">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CV_BENEFITS.map((b, idx) => {
            const IconComponent = BENEFIT_ICONS[b.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="hover:border-primary/50 hover:shadow-elevation-2 flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-xs transition duration-300"
              >
                <div>
                  <div className="text-primary bg-primary-container mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-on-surface mb-2 text-base leading-snug font-bold">{b.title}</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed sm:text-sm">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

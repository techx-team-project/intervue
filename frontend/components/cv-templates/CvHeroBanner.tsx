'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileCheck, ShieldCheck, Sparkles, DownloadCloud } from 'lucide-react';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';

export default function CvHeroBanner() {
  const {
    homeBreadcrumb,
    styleBreadcrumb,
    currentBreadcrumb,
    badge,
    title,
    titleHighlight,
    titleSuffix,
    description,
    badges,
    ctaCard,
  } = CV_TEMPLATE_MESSAGES.hero;

  return (
    <div className="bg-primary-light relative overflow-hidden border-b border-gray-200 py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="text-on-surface-variant mb-4 flex items-center gap-1.5 text-xs">
          <Link href="/" className="hover:text-primary transition-colors">
            {homeBreadcrumb}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cv-templates" className="hover:text-primary transition-colors">
            {styleBreadcrumb}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-semibold">{currentBreadcrumb}</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="max-w-3xl lg:col-span-8">
            <div className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>

            <h1 className="text-on-surface text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title} <span className="text-primary">{titleHighlight}</span> {titleSuffix}
            </h1>

            <p className="text-on-surface-variant mt-3 text-base leading-relaxed sm:text-lg">{description}</p>

            <div className="text-navy mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs">
                <ShieldCheck className="text-primary h-4 w-4" />
                <span>{badges.atsPass}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs">
                <FileCheck className="text-primary h-4 w-4" />
                <span>{badges.a4Standard}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs">
                <DownloadCloud className="text-primary h-4 w-4" />
                <span>{badges.freeExport}</span>
              </div>
            </div>
          </div>

          <div className="hidden justify-end lg:col-span-4 lg:flex">
            <div className="shadow-elevation-2 relative max-w-sm rounded-3xl border border-emerald-200/80 bg-white/80 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="text-primary bg-primary-container flex h-10 w-10 items-center justify-center rounded-2xl">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-on-surface text-sm font-bold">{ctaCard.title}</h3>
                  <p className="text-on-surface-variant text-xs">{ctaCard.subtitle}</p>
                </div>
              </div>

              <div className="text-on-surface-variant space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span>{ctaCard.availableLabel}</span>
                  <span className="text-on-surface font-bold">{ctaCard.availableValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{ctaCard.usersLabel}</span>
                  <span className="text-primary font-bold">850.000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{ctaCard.interviewRateLabel}</span>
                  <span className="text-primary font-bold">{ctaCard.interviewRateValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

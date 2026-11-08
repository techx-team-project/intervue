'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Sparkles, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';

export default function CareerAiInterviewCta() {
  const { badge, title, description, standardQuestions, strengthsWeaknesses, practiceCta, createCvCta } =
    CAREER_ORIENTATION_MESSAGES.aiInterviewCta;

  return (
    <div className="border-primary/30 bg-primary-deeper shadow-elevation-2 relative my-10 overflow-hidden rounded-3xl border p-6 text-white sm:p-8">
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-xl">
          <div className="text-primary-bright mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>

          <h3 className="text-xl leading-tight font-bold text-white sm:text-2xl">{title}</h3>

          <p className="mt-2 text-xs leading-relaxed text-emerald-100/80 sm:text-sm">{description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="text-primary h-4 w-4" />
              {standardQuestions}
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="text-primary h-4 w-4" />
              {strengthsWeaknesses}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
          <Link
            href="/jobs"
            className="bg-primary shadow-elevation-2 hover:bg-primary inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition hover:shadow-emerald-500/25"
          >
            <Bot className="h-4 w-4" />
            <span>{practiceCta}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/candidate/profile"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/20"
          >
            <span>{createCvCta}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

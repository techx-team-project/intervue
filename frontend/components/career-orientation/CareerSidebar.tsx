'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CareerTrendingIndustry } from '@/types/career';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';
import { TrendingUp, FileText, Brain, Calculator, Bot, Mail, CheckCircle2, ChevronRight } from 'lucide-react';

interface CareerSidebarProps {
  trendingIndustries: CareerTrendingIndustry[];
}

export default function CareerSidebar({ trendingIndustries }: CareerSidebarProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    topIndustriesTitle,
    jobCountSuffix,
    careerToolsTitle,
    careerToolsDesc,
    tools,
    newsletterTitle,
    newsletterDesc,
    newsletterPlaceholder,
    newsletterSubmit,
    newsletterSuccess,
  } = CAREER_ORIENTATION_MESSAGES.sidebar;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <aside className="space-y-6">
      <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <div className="text-primary bg-primary-container flex h-7 w-7 items-center justify-center rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-on-surface text-base font-bold">{topIndustriesTitle}</h3>
        </div>

        <div className="space-y-3">
          {trendingIndustries.map((item, idx) => (
            <Link
              key={item.id}
              href={`/blog/kien-thuc-chuyen-nganh/${item.slug}`}
              className="group hover:border-primary/30 hover:bg-primary-light flex items-center justify-between rounded-xl border border-transparent p-2.5 transition"
            >
              <div className="flex items-center gap-3">
                <span className="group-hover:bg-primary text-on-surface-variant flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold transition-colors group-hover:text-white">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="group-hover:text-primary text-on-surface text-xs font-semibold transition-colors sm:text-sm">
                    {item.name}
                  </h4>
                  <div className="text-label-sm text-on-surface-variant mt-0.5 flex items-center gap-2">
                    <span className="text-primary font-semibold">{item.avgSalary}</span>
                    <span>•</span>
                    <span>
                      {item.jobCount} {jobCountSuffix}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-primary bg-primary-light text-label-sm rounded-md px-2 py-0.5 font-bold">
                {item.demandRate}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-xs">
        <h3 className="text-on-surface mb-1 text-base font-bold">{careerToolsTitle}</h3>
        <p className="text-on-surface-variant mb-4 text-xs">{careerToolsDesc}</p>

        <div className="space-y-2.5">
          <Link
            href="/candidate/profile"
            className="group hover:border-primary hover:bg-primary-light flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafafa] p-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary bg-primary-container flex h-9 w-9 items-center justify-center rounded-lg">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="group-hover:text-primary text-on-surface text-xs font-bold transition-colors sm:text-sm">
                  {tools.cvTitle}
                </p>
                <p className="text-label-sm text-on-surface-variant">{tools.cvDesc}</p>
              </div>
            </div>
            <ChevronRight className="group-hover:text-primary text-outline h-4 w-4 transition-colors" />
          </Link>

          <Link
            href="#self-growth"
            className="group hover:border-primary hover:bg-primary-light flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafafa] p-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-light text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-on-surface group-hover:text-primary text-xs font-bold transition-colors sm:text-sm">
                  {tools.mbtiTitle}
                </p>
                <p className="text-label-sm text-on-surface-variant">{tools.mbtiDesc}</p>
              </div>
            </div>
            <ChevronRight className="text-outline group-hover:text-primary h-4 w-4 transition-colors" />
          </Link>

          <Link
            href="#salary-calculator"
            className="group hover:border-primary hover:bg-primary-light flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafafa] p-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-light text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <Calculator className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-on-surface group-hover:text-primary text-xs font-bold transition-colors sm:text-sm">
                  {tools.salaryTitle}
                </p>
                <p className="text-label-sm text-on-surface-variant">{tools.salaryDesc}</p>
              </div>
            </div>
            <ChevronRight className="text-outline group-hover:text-primary h-4 w-4 transition-colors" />
          </Link>

          <Link
            href="/jobs"
            className="group hover:bg-primary-light border-primary/30 flex items-center justify-between rounded-xl border bg-emerald-50/60 p-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg text-white">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-primary text-xs font-bold sm:text-sm">{tools.aiTitle}</p>
                <p className="text-label-sm text-on-surface-variant">{tools.aiDesc}</p>
              </div>
            </div>
            <ChevronRight className="text-primary h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-primary/30 bg-primary-light rounded-2xl border p-5 shadow-xs">
        <div className="mb-2 flex items-center gap-2">
          <Mail className="text-primary h-5 w-5" />
          <h3 className="text-on-surface text-sm font-bold">{newsletterTitle}</h3>
        </div>
        <p className="text-on-surface-variant mb-3 text-xs leading-relaxed">{newsletterDesc}</p>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletterPlaceholder}
              required
              className="focus:border-primary focus:ring-primary text-on-surface w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs placeholder:text-gray-400 focus:ring-1 focus:outline-hidden"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-xs transition"
            >
              {newsletterSubmit}
            </button>
          </form>
        ) : (
          <div className="text-primary flex items-center gap-2 rounded-xl bg-emerald-100/60 p-3 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{newsletterSuccess}</span>
          </div>
        )}
      </div>
    </aside>
  );
}

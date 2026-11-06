'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Calculator, FileText, Sparkles, ArrowRight, Compass, Tag, Mail } from 'lucide-react';
import { BlogArticle, BlogTrendingIndustry } from '@/types/blog';

interface BlogSidebarProps {
  popularArticles: BlogArticle[];
  trendingIndustries?: BlogTrendingIndustry[];
  selectedTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
}

const SIDEBAR_TAGS = [
  'Gross Net Salary',
  'ATS Resume',
  'Job Interview',
  'Marketing',
  'IT / AI',
  'Labor Law',
  'STAR Method',
  'Probation',
  'Salary Negotiation',
  'B2B Sales',
  'Cloud Architecture',
  'Compensation & Benefits',
];

export default function BlogSidebar({ popularArticles, selectedTag, onSelectTag }: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-b from-emerald-50/60 to-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Career Toolkit</h3>
            <p className="text-[11px] text-[#7f878f]">Free career accelerators</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/blog/che-do-luong-thuong"
            className="group hover:border-primary flex items-center justify-between rounded-xl border border-emerald-200/60 bg-white p-3 text-xs transition hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Calculator className="text-primary h-4 w-4" />
              <span className="text-navy group-hover:text-primary font-semibold">Gross ➔ Net Calculator</span>
            </div>
            <ArrowRight className="group-hover:text-primary h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/cv-templates"
            className="group flex items-center justify-between rounded-xl border border-blue-200/60 bg-white p-3 text-xs transition hover:border-blue-500 hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-navy font-semibold group-hover:text-blue-600">Build ATS Resume</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </Link>

          <Link
            href="/blog/dinh-huong-nghe-nghiep"
            className="group flex items-center justify-between rounded-xl border border-purple-200/60 bg-white p-3 text-xs transition hover:border-purple-500 hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-purple-600" />
              <span className="text-navy font-semibold group-hover:text-purple-600">Ikigai Career Quiz</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-purple-600" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold text-[#171717]">Trending Articles</h3>
          </div>
          <span className="text-[11px] text-[#7f878f]">This week</span>
        </div>

        <div className="space-y-3.5">
          {popularArticles.slice(0, 5).map((article, idx) => (
            <Link
              key={article.id}
              href={`/blog/${article.categorySlug}/${article.slug}`}
              className="group flex items-start gap-3 transition"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="group-hover:text-primary line-clamp-2 text-xs font-bold text-[#171717] transition-colors">
                  {article.title}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#7f878f]">
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.viewsCount} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-[#171717]">Popular Topics</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SIDEBAR_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag?.(isSelected ? null : tag)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-gray-100 text-[#475569] hover:bg-gray-200 hover:text-black'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-emerald-400">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Career Newsletter</h4>
            <p className="text-[11px] text-gray-400">Weekly job market trends</p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-300">
          Join 45,000+ software engineers receiving weekly tech insights and interview tips.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-3 space-y-2">
          <input
            type="email"
            placeholder="Enter your email address..."
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-emerald-400 focus:bg-white/20 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary w-full rounded-xl py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </aside>
  );
}

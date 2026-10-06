'use client';

import React from 'react';
import Link from 'next/link';
import { CareerArticle } from '@/types/career';
import CareerDetailBreadcrumb from './CareerDetailBreadcrumb';
import CareerTableOfContents from './CareerTableOfContents';
import CareerSalaryInteractive from './CareerSalaryInteractive';
import CareerRoadmapTimeline from './CareerRoadmapTimeline';
import CareerSpecializationsGrid from './CareerSpecializationsGrid';
import CareerRelatedJobsWidget from './CareerRelatedJobsWidget';
import CareerAiInterviewCta from './CareerAiInterviewCta';
import CareerDetailSidebar from './CareerDetailSidebar';
import { Clock, Eye, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

interface CareerDetailViewProps {
  article: CareerArticle;
}

export default function CareerDetailView({ article }: CareerDetailViewProps) {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* 1. Breadcrumb & Actions Bar */}
      <CareerDetailBreadcrumb article={article} />

      {/* 2. Article Header Hero */}
      <div className="border-b border-gray-200 bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Category badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#00b14f] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#00b14f]">
                <Sparkles className="h-3 w-3" />
                Cập nhật chuẩn 2026
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-[#171717] sm:text-3xl lg:text-4xl">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#7f878f]">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-50"
                />
                <span className="font-semibold text-[#263a4d]">{article.author.name}</span>
              </div>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.viewsCount} lượt xem
              </span>
            </div>

            {/* Excerpt callout */}
            <div className="mt-6 rounded-2xl border-l-4 border-[#00b14f] bg-[#f2fbf6] p-4 text-xs leading-relaxed text-[#263a4d] italic sm:p-5 sm:text-sm">
              &ldquo;{article.excerpt}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main 3-Column Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Sticky Table of Contents (3 cols on lg) */}
          <div className="lg:col-span-3">
            <CareerTableOfContents items={article.tableOfContents} />
          </div>

          {/* Middle Column: Main Article Body (6 cols on lg) */}
          <article className="space-y-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-6 lg:p-10">
            {/* Featured Image */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.coverImage} alt={article.title} className="h-auto w-full object-cover" />
            </div>

            {/* Render Sections */}
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                <h2 className="border-b border-gray-100 pb-3 text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                  {section.title}
                </h2>

                {section.leadText && (
                  <p className="text-sm leading-relaxed font-medium text-[#263a4d] sm:text-base">{section.leadText}</p>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm leading-relaxed text-[#526475] sm:text-[15px]">
                    {p}
                  </p>
                ))}

                {/* Highlights */}
                {section.highlights && section.highlights.length > 0 && (
                  <div className="my-4 space-y-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 sm:p-5">
                    {section.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs text-[#065f46] sm:text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
                        <span className="leading-relaxed font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="mt-5 space-y-4">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                        <h3 className="mb-2 text-sm font-bold text-[#171717] sm:text-base">{sub.title}</h3>
                        <div className="space-y-1.5">
                          {sub.content.map((c, cIdx) => (
                            <p key={cIdx} className="text-xs leading-relaxed text-[#526475] sm:text-sm">
                              {c}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Embed Specializations Grid under Section 3 */}
                {section.id === 'nganh-marketing-gom-nhung-chuyen-nganh-nao' && article.specializations && (
                  <CareerSpecializationsGrid specializations={article.specializations} />
                )}

                {/* Embed Interactive Salary under Section 6 */}
                {section.id === 'muc-luong-nganh-marketing' && article.salaryTiers && (
                  <CareerSalaryInteractive salaryTiers={article.salaryTiers} />
                )}

                {/* Embed Roadmap Timeline under Section 7 */}
                {section.id === 'lo-trinh-thang-tien-nganh-marketing' && article.careerRoadmap && (
                  <CareerRoadmapTimeline stages={article.careerRoadmap} />
                )}

                {/* Embed AI Interview CTA under Section 8 */}
                {section.id === 'nhung-to-chat-ky-nang-can-co' && <CareerAiInterviewCta />}

                {/* Embed Live Marketing Jobs under Section 10 */}
                {section.id === 'tim-viec-lam-nganh-marketing-o-dau' && <CareerRelatedJobsWidget />}
              </section>
            ))}

            {/* Tags Box */}
            <div className="border-t border-gray-100 pt-6">
              <span className="mb-3 block text-xs font-bold tracking-wider text-[#263a4d] uppercase">
                Chủ đề liên quan:
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/career-orientation?tag=${encodeURIComponent(tag)}`}
                    className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-[#526475] transition hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Right Column: Author, Quick tools, Related (3 cols on lg) */}
          <div className="lg:col-span-3">
            <CareerDetailSidebar article={article} />
          </div>
        </div>
      </div>
    </div>
  );
}

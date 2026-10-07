'use client';

import React from 'react';
import Link from 'next/link';
import { BlogArticle } from '@/types/blog';
import BlogDetailBreadcrumb from './BlogDetailBreadcrumb';
import CareerTableOfContents from '@/components/career-orientation/detail/CareerTableOfContents';
import CareerSalaryInteractive from '@/components/career-orientation/detail/CareerSalaryInteractive';
import CareerRoadmapTimeline from '@/components/career-orientation/detail/CareerRoadmapTimeline';
import CareerSpecializationsGrid from '@/components/career-orientation/detail/CareerSpecializationsGrid';
import CareerRelatedJobsWidget from '@/components/career-orientation/detail/CareerRelatedJobsWidget';
import CareerAiInterviewCta from '@/components/career-orientation/detail/CareerAiInterviewCta';
import BlogDetailSidebar from './BlogDetailSidebar';
import { Clock, Eye, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

interface BlogDetailViewProps {
  article: BlogArticle;
}

export default function BlogDetailView({ article }: BlogDetailViewProps) {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* 1. Breadcrumb & Actions Bar */}
      <BlogDetailBreadcrumb article={article} />

      {/* 2. Article Header Hero */}
      <div className="border-b border-gray-200 bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Category badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/blog/${article.categorySlug}`}
                className="rounded-full bg-[#00b14f] px-3.5 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-600"
              >
                {article.category}
              </Link>
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

            {/* Excerpt */}
            <p className="mt-5 rounded-2xl border-l-4 border-[#00b14f] bg-gray-50/70 p-4 text-sm leading-relaxed text-[#526475] italic sm:text-base">
              &ldquo;{article.excerpt}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Article Body + Table of Contents + Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Sticky Table of Contents (3 cols on lg) */}
          <div className="lg:col-span-3">
            <CareerTableOfContents items={article.tableOfContents} />
          </div>

          {/* Center Column: Article Sections & Rich Components (6 cols on lg) */}
          <article className="space-y-10 lg:col-span-6">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 space-y-4">
                <h2 className="border-b border-gray-100 pb-2 text-xl font-bold text-[#171717] sm:text-2xl">
                  {section.title}
                </h2>

                {section.leadText && <p className="leading-relaxed font-medium text-[#263a4d]">{section.leadText}</p>}

                <div className="space-y-3.5 text-sm leading-relaxed text-[#374151]">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {/* Highlights Callout Box */}
                {section.highlights && section.highlights.length > 0 && (
                  <div className="rounded-2xl border border-emerald-100 bg-[#f2fbf6] p-4 text-xs text-[#263a4d] sm:text-sm">
                    <div className="mb-2 font-bold text-[#00b14f]">Điểm cốt lõi cần nhớ:</div>
                    <ul className="space-y-1.5">
                      {section.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00b14f]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-4 space-y-4 pl-2">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
                        <h3 className="font-bold text-[#171717] sm:text-base">{sub.title}</h3>
                        <div className="mt-2 space-y-2 text-xs leading-relaxed text-[#526475] sm:text-sm">
                          {sub.content.map((c, cIdx) => (
                            <p key={cIdx}>{c}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Embed Specializations Grid under Section 3 if available */}
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
                    href={`/blog/${article.categorySlug}?tag=${encodeURIComponent(tag)}`}
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
            <BlogDetailSidebar article={article} />
          </div>
        </div>
      </div>
    </div>
  );
}

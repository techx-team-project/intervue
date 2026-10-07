'use client';

import React from 'react';
import Link from 'next/link';
import { BlogArticle } from '@/types/blog';
import { FileText, Calculator, Bot, Compass, Clock, Sparkles } from 'lucide-react';

interface BlogDetailSidebarProps {
  article: BlogArticle;
}

export default function BlogDetailSidebar({ article }: BlogDetailSidebarProps) {
  return (
    <aside className="sticky top-24 space-y-6">
      {/* 1. Author Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        <h4 className="text-xs font-bold tracking-wider text-[#7f878f] uppercase">Tác giả bài viết</h4>
        <div className="mt-3 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100"
          />
          <div>
            <h5 className="text-sm font-bold text-[#171717]">{article.author.name}</h5>
            <p className="text-primary mt-0.5 text-xs">{article.author.role}</p>
          </div>
        </div>
        {article.author.bio && <p className="mt-3 text-xs leading-relaxed text-[#526475]">{article.author.bio}</p>}
      </div>

      {/* 2. Quick Career Tools */}
      <div className="rounded-2xl border border-emerald-100 bg-linear-to-b from-emerald-50/50 to-white p-5 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-lg text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-sm font-bold text-[#171717]">Công cụ hỗ trợ</h4>
        </div>

        <div className="space-y-2">
          <Link
            href="/cv-templates"
            className="group text-navy hover:border-primary hover:text-primary flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-2.5 text-xs transition"
          >
            <div className="text-primary flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold">Tạo CV xin việc chuẩn ATS</span>
          </Link>

          <Link
            href="/blog/che-do-luong-thuong"
            className="group text-navy flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-2.5 text-xs transition hover:border-purple-400 hover:text-purple-600"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Calculator className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold">Tính lương Gross ➔ Net 2026</span>
          </Link>

          <Link
            href="/blog/dinh-huong-nghe-nghiep"
            className="group text-navy flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-2.5 text-xs transition hover:border-blue-400 hover:text-blue-600"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold">Trắc nghiệm định hướng nghề</span>
          </Link>

          <Link
            href="/jobs"
            className="group bg-primary-light text-primary flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-bold transition hover:bg-emerald-100/70"
          >
            <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-lg text-white">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <span>Luyện phỏng vấn cùng AI</span>
          </Link>
        </div>
      </div>

      {/* 3. Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <h4 className="mb-3 text-sm font-bold text-[#171717]">Bài viết liên quan</h4>

          <div className="space-y-4">
            {article.relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${article.categorySlug}/${rel.slug}`}
                className="group flex gap-3 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  className="h-16 w-20 shrink-0 rounded-xl object-cover group-hover:opacity-90"
                />
                <div className="flex flex-col justify-between">
                  <h5 className="group-hover:text-primary line-clamp-2 text-xs leading-snug font-bold text-[#171717] transition-colors">
                    {rel.title}
                  </h5>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-[#7f878f]">
                    <span>{rel.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {rel.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

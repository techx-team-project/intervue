'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Calculator, FileText, Sparkles, ArrowRight, Compass, Tag, Mail } from 'lucide-react';
import { BlogArticle, BlogTrendingIndustry } from '@/types/blog';
import { TRENDING_INDUSTRIES } from '@/mocks/career-orientation.mock';

interface BlogSidebarProps {
  popularArticles: BlogArticle[];
  trendingIndustries?: BlogTrendingIndustry[];
  selectedTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
}

const SIDEBAR_TAGS = [
  'Lương Gross Net',
  'CV chuẩn ATS',
  'Phỏng vấn',
  'Marketing',
  'IT / AI',
  'Bảo hiểm xã hội',
  'Mô hình Ikigai',
  'Thử việc',
  'Đàm phán lương',
  'B2B Sales',
  'Logistics',
  'C&B Nhân sự',
];

export default function BlogSidebar({
  popularArticles,
  trendingIndustries = TRENDING_INDUSTRIES,
  selectedTag,
  onSelectTag,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* 1. Quick Career Tools Widget */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-b from-emerald-50/60 to-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00b14f] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Công cụ sự nghiệp</h3>
            <p className="text-[11px] text-[#7f878f]">Tiện ích miễn phí cho ứng viên</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/blog/che-do-luong-thuong"
            className="group flex items-center justify-between rounded-xl border border-emerald-200/60 bg-white p-3 text-xs transition hover:border-[#00b14f] hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Calculator className="h-4 w-4 text-[#00b14f]" />
              <span className="font-semibold text-[#263a4d] group-hover:text-[#00b14f]">Tính Lương Gross ➔ Net</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-[#00b14f]" />
          </Link>

          <Link
            href="/cv-templates"
            className="group flex items-center justify-between rounded-xl border border-blue-200/60 bg-white p-3 text-xs transition hover:border-blue-500 hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-[#263a4d] group-hover:text-blue-600">Tạo CV chuẩn ATS</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </Link>

          <Link
            href="/blog/dinh-huong-nghe-nghiep"
            className="group flex items-center justify-between rounded-xl border border-purple-200/60 bg-white p-3 text-xs transition hover:border-purple-500 hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-[#263a4d] group-hover:text-purple-600">
                Trắc nghiệm Ikigai & Nghề
              </span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-purple-600" />
          </Link>
        </div>
      </div>

      {/* 2. Most Read Articles */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold text-[#171717]">Xem nhiều nhất</h3>
          </div>
          <span className="text-[11px] text-[#7f878f]">Tuần này</span>
        </div>

        <div className="space-y-3.5">
          {popularArticles.slice(0, 5).map((article, idx) => (
            <Link
              key={article.id}
              href={`/blog/${article.categorySlug}/${article.slug}`}
              className="group flex items-start gap-3 transition"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[#7f878f] group-hover:bg-[#00b14f] group-hover:text-white">
                {idx + 1}
              </span>
              <div className="flex-1">
                <h4 className="line-clamp-2 text-xs font-semibold text-[#263a4d] transition-colors group-hover:text-[#00b14f]">
                  {article.title}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#7f878f]">
                  <span>{article.viewsCount} lượt xem</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Trending Industries Radar */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#00b14f]" />
            <h3 className="text-sm font-bold text-[#171717]">Ngành nghề khát nhân lực</h3>
          </div>
        </div>

        <div className="space-y-3">
          {trendingIndustries.slice(0, 4).map((ind) => (
            <div
              key={ind.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs transition hover:bg-gray-100"
            >
              <div>
                <div className="font-semibold text-[#171717]">{ind.name}</div>
                <div className="text-[11px] text-[#7f878f]">Lương: {ind.avgSalary}</div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-[#00b14f]">
                {ind.demandRate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Popular Tags Cloud */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-[#00b14f]" />
          <h3 className="text-sm font-bold text-[#171717]">Chủ đề quan tâm</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SIDEBAR_TAGS.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag && onSelectTag(isSelected ? null : tag)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-[#00b14f] text-white shadow-2xs'
                    : 'bg-gray-100 text-[#526475] hover:bg-gray-200 hover:text-[#171717]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Newsletter / Job Alert Box */}
      <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400">
          <Mail className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider uppercase">Bản tin tuyển dụng</span>
        </div>
        <h4 className="mt-2 text-sm font-bold text-white">Nhận cẩm nang nghề nghiệp mới nhất</h4>
        <p className="mt-1 text-xs text-gray-300">
          Cập nhật xu hướng việc làm, mẫu CV mới và báo cáo lương định kỳ hàng tuần.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-3.5 space-y-2">
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:border-[#00b14f] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#00b14f] py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
          >
            Đăng ký nhận tin
          </button>
        </form>
      </div>
    </aside>
  );
}

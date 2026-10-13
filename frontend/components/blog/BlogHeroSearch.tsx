'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  TrendingUp,
  X,
  Compass,
  Briefcase,
  Calculator,
  GraduationCap,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { BlogCategoryMeta } from '@/types/blog';

interface BlogHeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  categoryMeta?: BlogCategoryMeta;
}

const DEFAULT_POPULAR_TAGS = [
  'Lương Gross Net',
  'CV chuẩn ATS',
  'Phỏng vấn',
  'Marketing',
  'IT / AI',
  'Mô hình Ikigai',
  'Bảo hiểm xã hội',
  'Thử việc',
];

export default function BlogHeroSearch({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  categoryMeta,
}: BlogHeroSearchProps) {
  const getCategoryIcon = () => {
    if (!categoryMeta) return null;
    switch (categoryMeta.iconName) {
      case 'Compass':
        return <Compass className="h-7 w-7 text-emerald-400" />;
      case 'Briefcase':
        return <Briefcase className="h-7 w-7 text-blue-400" />;
      case 'Calculator':
        return <Calculator className="h-7 w-7 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="h-7 w-7 text-purple-400" />;
      default:
        return <BookOpen className="h-7 w-7 text-emerald-400" />;
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 text-white sm:py-16">
      {/* Decorative blurred background shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Category breadcrumb if in sub-category */}
        {categoryMeta && (
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="transition hover:text-white">
              Cẩm nang nghề nghiệp
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-emerald-400">{categoryMeta.name}</span>
          </nav>
        )}

        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold ring-1 ring-white/15 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-300">
              {categoryMeta ? categoryMeta.badge : 'Cẩm nang nghề nghiệp & Tuyển dụng 2026'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            {categoryMeta ? (
              <span className="inline-flex items-center justify-center gap-3">
                {getCategoryIcon()}
                <span>{categoryMeta.name}</span>
              </span>
            ) : (
              <>
                Phát triển sự nghiệp cùng <span className="text-primary">InterVue</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            {categoryMeta
              ? categoryMeta.description
              : 'Trang bị kiến thức chuyên ngành, bí quyết phỏng vấn chinh phục nhà tuyển dụng, tính lương Gross - Net và định hướng phát triển bản thân vững chắc.'}
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  categoryMeta
                    ? `Tìm kiếm bài viết trong "${categoryMeta.name}"...`
                    : 'Tìm kiếm bí quyết viết CV, tính lương, câu hỏi phỏng vấn, ngành nghề...'
                }
                className="focus:border-primary w-full rounded-2xl border-2 border-white/15 bg-white/10 py-4 pr-12 pl-12 text-sm text-white placeholder-gray-400 backdrop-blur-md transition focus:bg-white/20 focus:outline-none sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 rounded-full p-1 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Popular / Filter Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-gray-400">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Từ khóa nổi bật:
              </span>
              {DEFAULT_POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onSelectTag(isSelected ? null : tag)}
                    className={`rounded-full px-3 py-1 font-medium transition ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white/10 text-gray-300 ring-1 ring-white/10 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

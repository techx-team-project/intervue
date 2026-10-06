'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Compass, TrendingUp } from 'lucide-react';

interface CareerHeroSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const TRENDING_TAGS = [
  'Marketing',
  'Digital Marketing',
  'Sales',
  'Logistics',
  'Công nghệ thông tin (IT)',
  'Tài chính - Ngân hàng',
  'Mức lương',
];

export default function CareerHeroSearch({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
}: CareerHeroSearchProps) {
  return (
    <div className="relative overflow-hidden border-b border-[#e9eaec] bg-linear-to-b from-[#00b14f]/10 via-[#f4fbf7] to-white py-10 lg:py-14">
      {/* Background ambient blurs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#00b14f]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#7f878f]">
          <Link href="/" className="transition-colors hover:text-[#00b14f]">
            Trang chủ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-[#263a4d]">Cẩm nang nghề nghiệp</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-[#00b14f]">Định hướng nghề nghiệp</span>
        </nav>

        {/* Hero Title & Description */}
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#00b14f]/10 px-3.5 py-1 text-xs font-semibold text-[#00b14f]">
            <Compass className="h-3.5 w-3.5" />
            <span>Cẩm Nang & Lộ Trình Sự Nghiệp Toàn Diện</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
            Định hướng nghề nghiệp
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#526475] sm:text-lg">
            Chia sẻ thông tin, phân tích thị trường và lộ trình thăng tiến cần thiết giúp bạn sớm định hình sự nghiệp,
            lựa chọn ngành nghề phù hợp với năng lực và bứt phá mức thu nhập.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm bài viết, chuyên ngành, mức lương, kỹ năng nghề nghiệp..."
              className="w-full rounded-2xl border border-[#d1d5db] bg-white py-3.5 pr-10 pl-12 text-sm text-[#171717] shadow-sm transition placeholder:text-[#9ca3af] focus:border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 rounded-full p-1 text-xs text-[#9ca3af] hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Trending tags */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-medium text-[#7f878f]">
              <TrendingUp className="h-3.5 w-3.5 text-[#00b14f]" />
              Xu hướng:
            </span>
            {TRENDING_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(isSelected ? null : tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#00b14f] text-white shadow-sm'
                      : 'border border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#00b14f] hover:text-[#00b14f]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

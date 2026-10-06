'use client';

import React from 'react';
import { CvTemplateStyle, CvTemplateIndustry } from '@/types/cv-template';
import { Search, Filter, Globe } from 'lucide-react';

interface CvFilterBarProps {
  styles: CvTemplateStyle[];
  industries: CvTemplateIndustry[];
  selectedStyleSlug: string;
  onSelectStyle: (slug: string) => void;
  selectedIndustrySlug: string;
  onSelectIndustry: (slug: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CvFilterBar({
  styles,
  industries,
  selectedStyleSlug,
  onSelectStyle,
  selectedIndustrySlug,
  onSelectIndustry,
  selectedLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
}: CvFilterBarProps) {
  return (
    <div className="sticky top-18 z-20 border-b border-gray-200 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Row 1: Style Tabs */}
        <div className="no-scrollbar flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex shrink-0 items-center gap-1.5">
            {styles.map((style) => {
              const isActive = selectedStyleSlug === style.slug;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectStyle(style.slug)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    isActive
                      ? 'bg-[#00b14f] text-white shadow-xs'
                      : 'text-[#526475] hover:bg-[#f2fbf6] hover:text-[#00b14f]'
                  }`}
                >
                  <span>{style.name}</span>
                  <span
                    className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-[#7f878f]'
                    }`}
                  >
                    {style.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input on Desktop */}
          <div className="relative hidden w-72 shrink-0 md:block">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên mẫu, ngành nghề..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pr-8 pl-9.5 text-xs text-[#171717] placeholder:text-[#9ca3af] focus:border-[#00b14f] focus:bg-white focus:ring-1 focus:ring-[#00b14f] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-[#9ca3af] hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Secondary Filters (Industry, Language) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-[#7f878f]">
              <Filter className="h-3.5 w-3.5 text-[#00b14f]" />
              Ngành nghề:
            </span>
            <select
              value={selectedIndustrySlug}
              onChange={(e) => onSelectIndustry(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-[#263a4d] focus:border-[#00b14f] focus:outline-hidden"
            >
              {industries.map((ind) => (
                <option key={ind.id} value={ind.slug}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language filters */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-[#7f878f]">
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              Ngôn ngữ:
            </span>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {['all', 'Tiếng Việt', 'Tiếng Anh'].map((lang) => {
                const isSelected = selectedLanguage === lang;
                const label = lang === 'all' ? 'Tất cả' : lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => onSelectLanguage(lang)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      isSelected ? 'bg-white font-bold text-[#00b14f] shadow-xs' : 'text-[#526475] hover:text-[#171717]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

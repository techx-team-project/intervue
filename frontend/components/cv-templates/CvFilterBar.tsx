'use client';

import React from 'react';
import { CvTemplateStyle, CvTemplateIndustry } from '@/types/cv-template';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
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
  const { searchPlaceholder, industryLabel, languageLabel, allLanguageLabel, languages } =
    CV_TEMPLATE_MESSAGES.filterBar;

  const languageOptions = [
    { key: 'all', label: allLanguageLabel },
    { key: languages.vi, label: languages.vi },
    { key: languages.en, label: languages.en },
  ];

  return (
    <div className="sticky top-18 z-20 border-b border-gray-200 bg-white/95 shadow-xs">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex shrink-0 items-center gap-1.5">
            {styles.map((style) => {
              const isActive = selectedStyleSlug === style.slug;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectStyle(style.slug)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'hover:bg-primary-light hover:text-primary text-on-surface-variant'
                  }`}
                >
                  <span>{style.name}</span>
                  <span
                    className={`py-0.2 text-label-sm rounded-full px-1.5 font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'text-on-surface-variant bg-gray-100'
                    }`}
                  >
                    {style.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative hidden w-72 shrink-0 md:block">
            <Search className="text-outline absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="focus:border-primary focus:ring-primary text-on-surface placeholder:text-outline w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pr-8 pl-9.5 text-xs focus:bg-white focus:ring-1 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-outline absolute top-1/2 right-2.5 -translate-y-1/2 text-xs hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-on-surface-variant flex items-center gap-1 font-semibold">
              <Filter className="text-primary h-3.5 w-3.5" />
              {industryLabel}
            </span>
            <select
              value={selectedIndustrySlug}
              onChange={(e) => onSelectIndustry(e.target.value)}
              className="text-navy focus:border-primary rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium focus:outline-hidden"
            >
              {industries.map((ind) => (
                <option key={ind.id} value={ind.slug}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant flex items-center gap-1 font-semibold">
              <Globe className="text-primary h-3.5 w-3.5" />
              {languageLabel}
            </span>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {languageOptions.map((opt) => {
                const isSelected = selectedLanguage === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onSelectLanguage(opt.key)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      isSelected
                        ? 'text-primary bg-white font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {opt.label}
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

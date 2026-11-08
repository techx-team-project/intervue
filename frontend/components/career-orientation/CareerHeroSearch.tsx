'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Compass, TrendingUp } from 'lucide-react';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';

interface CareerHeroSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function CareerHeroSearch({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
}: CareerHeroSearchProps) {
  const {
    breadcrumbHome,
    breadcrumbHandbook,
    breadcrumbCurrent,
    badge,
    title,
    description,
    searchPlaceholder,
    trendingLabel,
    trendingTags,
  } = CAREER_ORIENTATION_MESSAGES.hero;

  return (
    <div className="border-outline-variant bg-primary-light relative overflow-hidden border-b py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="text-on-surface-variant mb-4 flex items-center gap-1.5 text-xs">
          <Link href="/" className="hover:text-primary transition-colors">
            {breadcrumbHome}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-navy font-medium">{breadcrumbHandbook}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-semibold">{breadcrumbCurrent}</span>
        </nav>

        <div className="max-w-3xl">
          <div className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold">
            <Compass className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>

          <h1 className="text-on-surface text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="text-on-surface-variant mt-3 text-base leading-relaxed sm:text-lg">{description}</p>
        </div>

        <div className="mt-8 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="text-outline absolute left-4 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="focus:border-primary focus:ring-primary/20 text-on-surface placeholder:text-outline w-full rounded-2xl border border-[#d1d5db] bg-white py-3.5 pr-10 pl-12 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-outline absolute right-3.5 rounded-full p-1 text-xs hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-on-surface-variant flex items-center gap-1 font-medium">
              <TrendingUp className="text-primary h-3.5 w-3.5" />
              {trendingLabel}
            </span>
            {trendingTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(isSelected ? null : tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'hover:border-primary hover:text-primary border-outline-variant border bg-white text-[#4b5563]'
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

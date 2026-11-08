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
  'Gross Net Salary',
  'ATS Resume',
  'Job Interview',
  'Marketing',
  'IT / AI',
  'STAR Method',
  'Labor Law',
  'Probation',
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
        return <Compass className="text-primary-bright h-7 w-7" />;
      case 'Briefcase':
        return <Briefcase className="text-primary h-7 w-7" />;
      case 'Calculator':
        return <Calculator className="h-7 w-7 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="text-primary h-7 w-7" />;
      default:
        return <BookOpen className="text-primary-bright h-7 w-7" />;
    }
  };

  return (
    <section className="bg-primary-deeper relative overflow-hidden py-12 text-white sm:py-16">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {categoryMeta && (
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="transition hover:text-white">
              Career Guides
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary-bright font-semibold">{categoryMeta.name}</span>
          </nav>
        )}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold ring-1 ring-white/15 backdrop-blur-md">
            <Sparkles className="text-primary-bright h-3.5 w-3.5" />
            <span className="text-primary-bright">
              {categoryMeta ? categoryMeta.badge : 'Career Guides & Recruitment 2026'}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            {categoryMeta ? (
              <span className="inline-flex items-center justify-center gap-3">
                {getCategoryIcon()}
                <span>{categoryMeta.name}</span>
              </span>
            ) : (
              <>
                Accelerate Your Tech Career with <span className="text-primary">InterVue</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            {categoryMeta
              ? categoryMeta.description
              : 'Equip yourself with industry domain knowledge, interview playbooks, take-home salary calculations, and strategic career advancement playbooks.'}
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  categoryMeta
                    ? `Search articles in "${categoryMeta.name}"...`
                    : 'Search career guides, ATS resumes, interview questions, salary tools...'
                }
                className="focus:border-primary w-full rounded-2xl border-2 border-white/15 bg-white/10 py-4 pr-12 pl-12 text-sm text-white placeholder-gray-400 backdrop-blur-md transition focus:bg-white/20 focus:outline-none sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 rounded-full p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-300">
              <span className="inline-flex items-center gap-1 text-gray-400">
                <TrendingUp className="text-primary-bright h-3 w-3" />
                Trending topics:
              </span>
              {DEFAULT_POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onSelectTag(isSelected ? null : tag)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
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

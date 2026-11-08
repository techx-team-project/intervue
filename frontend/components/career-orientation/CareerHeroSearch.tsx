'use client';

import PageHero from '@/components/common/PageHero';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

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
    <PageHero
      id="career-hero-title"
      eyebrow={badge}
      title={title}
      description={description}
      crumbs={[{ label: breadcrumbHome, href: '/' }, { label: breadcrumbHandbook }, { label: breadcrumbCurrent }]}
    >
      <div className="max-w-2xl">
        <div className="bg-surface shadow-float relative flex h-14 items-center rounded-full">
          <Search className="text-on-surface-variant absolute left-5 h-5 w-5" aria-hidden />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="text-body-lg text-on-surface placeholder:text-on-surface-variant h-full w-full rounded-full bg-transparent pr-12 pl-13 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Xóa từ khóa"
              onClick={() => onSearchChange('')}
              className="state-layer text-on-surface-variant absolute right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-label-lg text-white/60">{trendingLabel}</span>
          {trendingTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={cn(
                  'text-label-lg ease-standard cursor-pointer rounded-full border px-3.5 py-1.5 transition-colors duration-150',
                  isSelected
                    ? 'text-primary-deeper border-white bg-white'
                    : 'hover:text-primary-deeper border-white/20 text-white/90 hover:border-white hover:bg-white',
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </PageHero>
  );
}

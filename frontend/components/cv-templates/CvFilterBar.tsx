'use client';

import ListboxSelect from '@/components/ui/ListboxSelect';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { cn } from '@/lib/utils';
import type { CvTemplateIndustry, CvTemplateStyle } from '@/types/cv-template';
import { Search, X } from 'lucide-react';

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

const ALL_INDUSTRIES = 'all';

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
  const industryOptions = industries.map((industry) => ({ value: industry.slug, label: industry.name }));

  return (
    <div className="bg-surface border-outline-variant sticky top-16 z-20 border-y">
      <div className="container-page space-y-3 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="CV style" className="no-scrollbar flex gap-2 overflow-x-auto">
            {styles.map((style) => {
              const isActive = selectedStyleSlug === style.slug;
              return (
                <button
                  key={style.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectStyle(style.slug)}
                  className={cn(
                    'text-label-lg ease-standard flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 font-semibold transition-colors duration-150',
                    isActive
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary',
                  )}
                >
                  {style.name}
                  <span className={cn('text-label-md', isActive ? 'text-on-primary/80' : 'text-on-surface-variant')}>
                    {style.count}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative block w-full md:w-96">
            <Search
              className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search templates"
              className="text-body-md text-on-surface placeholder:text-on-surface-variant border-outline hover:border-on-surface-variant/60 focus:border-primary h-10 w-full rounded-full border bg-white pr-9 pl-10 transition-colors outline-none focus:ring-2 focus:ring-emerald-600/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="text-on-surface-variant hover:text-on-surface absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-label-lg text-on-surface-variant font-semibold">{industryLabel}</span>
            <div className="border-outline-variant flex h-9 w-52 items-center rounded-full border px-4">
              <ListboxSelect
                ariaLabel="Industry"
                placeholder="All industries"
                searchable
                searchPlaceholder="Search industry"
                value={selectedIndustrySlug === ALL_INDUSTRIES ? '' : selectedIndustrySlug}
                onChange={(value) => onSelectIndustry(value || ALL_INDUSTRIES)}
                options={industryOptions.filter((option) => option.value !== ALL_INDUSTRIES)}
                className="h-full min-w-0 flex-1"
                triggerClassName="text-label-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-label-lg text-on-surface-variant font-semibold">{languageLabel}</span>
            <div role="group" aria-label="Language" className="flex gap-1.5">
              {languageOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={selectedLanguage === option.key}
                  onClick={() => onSelectLanguage(option.key)}
                  className={cn(
                    'text-label-lg h-8 cursor-pointer rounded-full border px-3.5 font-medium transition-colors',
                    selectedLanguage === option.key
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

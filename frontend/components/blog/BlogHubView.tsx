'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogArticle } from '@/types/blog';
import BlogHeroSearch from './BlogHeroSearch';
import BlogCategoryTabs from './BlogCategoryTabs';
import BlogArticleCard from './BlogArticleCard';
import BlogFeaturedGrid from './BlogFeaturedGrid';
import BlogCategoryShowcase from './BlogCategoryShowcase';
import BlogSidebar from './BlogSidebar';
import { BookOpen, SearchX, Calculator, Compass, ArrowRight } from 'lucide-react';

interface BlogHubViewProps {
  initialArticles: BlogArticle[];
  categories?: import('@/types/blog').BlogCategoryMeta[];
}

const ITEMS_PER_PAGE = 6;

export default function BlogHubView({ initialArticles }: BlogHubViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const art of initialArticles) {
      if (!map.has(art.categorySlug)) {
        map.set(art.categorySlug, art.category);
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ id: slug, name }));
  }, [initialArticles]);

  const featuredArticles = useMemo(() => {
    const featured = initialArticles.filter((a) => a.isFeatured);
    return featured.length > 0 ? featured : initialArticles.slice(0, 3);
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      if (activeCategoryId !== 'all' && article.categorySlug !== activeCategoryId) {
        return false;
      }

      if (selectedTag) {
        const matchesTag = article.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        const matchesTitle = article.title.toLowerCase().includes(selectedTag.toLowerCase());
        if (!matchesTag && !matchesTitle) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(query);
        const matchesTag = article.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesExcerpt && !matchesTag) return false;
      }

      return true;
    });
  }, [initialArticles, activeCategoryId, selectedTag, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <BlogHeroSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTag={selectedTag}
        onSelectTag={handleSelectTag}
      />

      <BlogCategoryTabs />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {!searchQuery && !selectedTag && activeCategoryId === 'all' && (
          <>
            <BlogCategoryShowcase />
            <BlogFeaturedGrid articles={featuredArticles} />

            <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-linear-to-r from-amber-500/10 via-orange-500/10 to-transparent p-6 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      Interactive Tool
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-[#0f172a]">Gross ➔ Net Salary Calculator</h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">
                  Instantly calculate take-home pay, mandatory insurance (10.5%), personal deductions, and 7-bracket PIT
                  tax.
                </p>
                <div className="mt-4">
                  <Link
                    href="/blog/che-do-luong-thuong"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
                  >
                    <span>Calculate Salary</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-6 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      3-Minute Quiz
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-[#0f172a]">Discover Your Ikigai Career Alignment</h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">
                  Pinpoint the sweet spot between your passions, strengths, and market demand for long-term growth.
                </p>
                <div className="mt-4">
                  <Link
                    href="/blog/dinh-huong-nghe-nghiep"
                    className="bg-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#171717] sm:text-2xl">All Articles ({filteredArticles.length})</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategoryId === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'hover:border-primary border border-gray-200 bg-white text-gray-600'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCategory(c.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategoryId === c.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'hover:border-primary border border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {paginatedArticles.map((article) => (
                      <BlogArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentPage(i + 1)}
                          className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                            currentPage === i + 1
                              ? 'bg-primary text-white'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                  <SearchX className="h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-base font-bold text-gray-700">No matching articles found</h3>
                  <p className="mt-1 text-xs text-gray-400">Try a different search keyword or reset filters</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategoryId('all');
                      setSelectedTag(null);
                    }}
                    className="text-primary mt-4 text-xs font-bold hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <BlogSidebar popularArticles={initialArticles} onSelectTag={handleSelectTag} selectedTag={selectedTag} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

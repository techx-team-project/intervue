'use client';

import React, { useState, useMemo } from 'react';
import { CareerArticle, CareerCategory, CareerTrendingIndustry } from '@/types/career';
import CareerHeroSearch from './CareerHeroSearch';
import CareerCategoryTabs from './CareerCategoryTabs';
import CareerFeaturedGrid from './CareerFeaturedGrid';
import CareerAssessmentBanner from './CareerAssessmentBanner';
import CareerArticleCard from './CareerArticleCard';
import CareerSidebar from './CareerSidebar';
import { BookOpen, SearchX } from 'lucide-react';

interface CareerHubViewProps {
  initialArticles: CareerArticle[];
  categories: CareerCategory[];
  trendingIndustries: CareerTrendingIndustry[];
}

const ITEMS_PER_PAGE = 6;

export default function CareerHubView({ initialArticles, categories, trendingIndustries }: CareerHubViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter articles based on category, search, tag
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      // Category filter
      if (activeCategoryId !== 'all') {
        const selectedCategory = categories.find((c) => c.id === activeCategoryId);
        if (selectedCategory && article.category !== selectedCategory.name) {
          return false;
        }
      }

      // Tag filter
      if (selectedTag) {
        const matchesTag = article.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        const matchesTitle = article.title.toLowerCase().includes(selectedTag.toLowerCase());
        if (!matchesTag && !matchesTitle) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(query);
        const matchesTag = article.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesExcerpt && !matchesTag) return false;
      }

      return true;
    });
  }, [initialArticles, activeCategoryId, selectedTag, searchQuery, categories]);

  // Featured articles (top 3)
  const featuredArticles = useMemo(() => {
    return initialArticles.filter((art) => art.isFeatured);
  }, [initialArticles]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    setCurrentPage(1);
  };

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* 1. Hero Search */}
      <CareerHeroSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTag={selectedTag}
        onSelectTag={handleSelectTag}
      />

      {/* 2. Category Tabs */}
      <CareerCategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* 3. Featured Articles (only show if no search/filter active) */}
        {!searchQuery && !selectedTag && activeCategoryId === 'all' && (
          <>
            <CareerFeaturedGrid articles={featuredArticles} />
            <CareerAssessmentBanner />
          </>
        )}

        {/* 4. Main Listing & Sidebar Section */}
        <div className="pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#171717] sm:text-2xl">Danh sách bài viết định hướng</h2>
            </div>
            <span className="text-xs text-[#7f878f]">{filteredArticles.length} bài viết</span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 8 cols: Articles list */}
            <div className="lg:col-span-8">
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {paginatedArticles.map((article) => (
                      <CareerArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#526475] transition hover:bg-gray-50 disabled:opacity-40"
                      >
                        Trang trước
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-9 w-9 rounded-xl text-xs font-bold transition ${
                              currentPage === pageNum
                                ? 'bg-[#00b14f] text-white shadow-xs'
                                : 'border border-gray-200 bg-white text-[#526475] hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#526475] transition hover:bg-gray-50 disabled:opacity-40"
                      >
                        Trang sau
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                  <SearchX className="mx-auto mb-3 h-12 w-12 text-[#9ca3af]" />
                  <h3 className="text-base font-bold text-[#171717]">Không tìm thấy bài viết phù hợp</h3>
                  <p className="mt-1 text-xs text-[#7f878f]">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                      setActiveCategoryId('all');
                    }}
                    className="mt-4 rounded-xl bg-[#00b14f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#009b44]"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>

            {/* Right 4 cols: Sidebar */}
            <div className="lg:col-span-4">
              <CareerSidebar trendingIndustries={trendingIndustries} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

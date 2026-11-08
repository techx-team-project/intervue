'use client';

import React, { useState, useMemo } from 'react';
import { BlogArticle, BlogCategoryMeta } from '@/types/blog';
import BlogHeroSearch from './BlogHeroSearch';
import BlogCategoryTabs from './BlogCategoryTabs';
import BlogArticleCard from './BlogArticleCard';
import BlogSidebar from './BlogSidebar';
import GrossNetCalculatorWidget from './GrossNetCalculatorWidget';
import InterviewPrepChecklist from './InterviewPrepChecklist';
import CareerAssessmentBanner from '@/components/career-orientation/CareerAssessmentBanner';
import { BookOpen, SearchX, Sparkles, Cpu, Megaphone, Briefcase, Coins, Truck, Users } from 'lucide-react';

interface BlogCategoryViewProps {
  categoryMeta: BlogCategoryMeta;
  articles: BlogArticle[];
  allArticles: BlogArticle[];
}

const ITEMS_PER_PAGE = 6;

const DOMAIN_HIGHLIGHTS = [
  {
    name: 'Công nghệ thông tin / AI',
    icon: <Cpu className="text-primary h-5 w-5" />,
    salary: '18 - 55 triệu',
    tag: 'Tăng trưởng +48%',
    skills: ['Python / LLM', 'Cloud AWS/GCP', 'DevOps & Microservices'],
  },
  {
    name: 'Marketing & Truyền thông',
    icon: <Megaphone className="text-primary h-5 w-5" />,
    salary: '12 - 35 triệu',
    tag: 'Tăng trưởng +34%',
    skills: ['Performance Ads', 'SEO & Data Analytics', 'Brand Storytelling'],
  },
  {
    name: 'Kinh doanh & Bán hàng (Sales)',
    icon: <Briefcase className="h-5 w-5 text-orange-600" />,
    salary: '15 - 50+ triệu',
    tag: 'Hoa hồng cao',
    skills: ['B2B Solution Selling', 'Đàm phán thương mại', 'Quản trị Key Account'],
  },
  {
    name: 'Tài chính - Kế toán & Fintech',
    icon: <Coins className="h-5 w-5 text-amber-600" />,
    salary: '14 - 38 triệu',
    tag: 'Ổn định & Bền vững',
    skills: ['Phân tích tài chính CFA', 'Kế toán quản trị', 'Fintech & Digital Banking'],
  },
  {
    name: 'Logistics & Chuỗi cung ứng',
    icon: <Truck className="text-primary h-5 w-5" />,
    salary: '12 - 32 triệu',
    tag: 'Xuất nhập khẩu',
    skills: ['Incoterms 2020', 'Thủ tục hải quan', 'Quản trị vận tải & kho'],
  },
  {
    name: 'Nhân sự (C&B & Tuyển dụng)',
    icon: <Users className="text-primary h-5 w-5" />,
    salary: '12 - 30 triệu',
    tag: 'Giữ chân nhân tài',
    skills: ['Lương 3P & KPI', 'Luật lao động', 'Employer Branding'],
  },
];

export default function BlogCategoryView({ categoryMeta, articles, allArticles }: BlogCategoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('Tất cả');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (selectedSubFilter !== 'Tất cả') {
        const matchesTag = article.tags.some((t) => t.toLowerCase() === selectedSubFilter.toLowerCase());
        const matchesTitle = article.title.toLowerCase().includes(selectedSubFilter.toLowerCase());
        const matchesExcerpt = article.excerpt.toLowerCase().includes(selectedSubFilter.toLowerCase());
        if (!matchesTag && !matchesTitle && !matchesExcerpt) return false;
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
  }, [articles, selectedSubFilter, selectedTag, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleSubFilterClick = (sub: string) => {
    setSelectedSubFilter(sub);
    setCurrentPage(1);
  };

  return (
    <div className="bg-surface-container-low min-h-screen">
      <BlogHeroSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedTag={selectedTag}
        onSelectTag={(t) => {
          setSelectedTag(t);
          setCurrentPage(1);
        }}
        categoryMeta={categoryMeta}
      />

      <BlogCategoryTabs currentCategorySlug={categoryMeta.slug} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {categoryMeta.slug === 'che-do-luong-thuong' && (
          <div className="mb-12">
            <GrossNetCalculatorWidget />
          </div>
        )}

        {categoryMeta.slug === 'bi-kip-tim-viec' && (
          <div className="mb-12">
            <InterviewPrepChecklist />
          </div>
        )}

        {categoryMeta.slug === 'dinh-huong-nghe-nghiep' && (
          <div className="mb-12">
            <CareerAssessmentBanner />
          </div>
        )}

        {categoryMeta.slug === 'kien-thuc-chuyen-nganh' && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary-light text-on-primary-container flex h-8 w-8 items-center justify-center rounded-lg">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h3 className="text-on-surface text-xl font-bold">
                  Key Skills & Salary Ranges Across High-Demand Sectors
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DOMAIN_HIGHLIGHTS.map((domain, i) => (
                <div
                  key={i}
                  className="hover:border-outline-variant hover:shadow-elevation-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                        {domain.icon}
                      </div>
                      <h4 className="text-on-surface font-bold">{domain.name}</h4>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Typical salary range:</span>
                    <span className="text-primary font-bold">{domain.salary}</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {domain.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-label-sm rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {categoryMeta.subFilters && categoryMeta.subFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Chủ đề con:</span>
            {categoryMeta.subFilters.map((sub) => {
              const isActive = selectedSubFilter === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSubFilterClick(sub)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'hover:border-primary hover:text-primary text-on-surface-variant border border-gray-200 bg-white'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-primary bg-primary-container flex h-8 w-8 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-on-surface text-xl font-bold">Articles ({filteredArticles.length})</h2>
              </div>
            </div>

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
                    setSelectedSubFilter('Tất cả');
                    setSelectedTag(null);
                  }}
                  className="bg-primary hover:bg-primary mt-4 rounded-xl px-4 py-2 text-xs font-bold text-white transition"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <BlogSidebar
              popularArticles={allArticles}
              selectedTag={selectedTag}
              onSelectTag={(t) => {
                setSelectedTag(t);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

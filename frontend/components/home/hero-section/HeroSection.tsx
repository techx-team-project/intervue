'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';

import {
  HERO_CATEGORIES_PAGE_1,
  HERO_CATEGORIES_PAGE_2,
  HERO_CATEGORY_TOTAL_PAGES,
  HERO_CITIES,
} from '@/constants/home/hero';

import CategoryPanel from './CategoryPanel';
import QrLoginPanel from './QrLoginPanel';
import RecruitmentBanner from './RecruitmentBanner';

export default function HeroSection() {
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Địa điểm');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [categoryPage, setCategoryPage] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto rotate banner every 5 seconds (2 banners)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = categoryPage === 1 ? HERO_CATEGORIES_PAGE_1 : HERO_CATEGORIES_PAGE_2;

  return (
    <section
      id="section-header"
      className="relative overflow-hidden pt-7 pb-10"
      style={{
        background:
          'linear-gradient(180deg, #002b33, rgba(0, 43, 51, 0.35)), linear-gradient(90deg, #008060 21.86%, #2bab60 78.13%)',
      }}
    >
      {/* Background Graphic Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/bg_header.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Decorative Angled Chevrons on Left and Right */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 hidden w-44 opacity-20 lg:block">
        <svg viewBox="0 0 200 400" className="h-full w-full fill-none stroke-white" strokeWidth="20">
          <path d="M-50,50 L80,200 L-50,350" />
          <path d="M-10,50 L120,200 L-10,350" />
        </svg>
      </div>
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-44 opacity-20 lg:block">
        <svg viewBox="0 0 200 400" className="h-full w-full fill-none stroke-white" strokeWidth="20">
          <path d="M250,50 L120,200 L250,350" />
          <path d="M210,50 L80,200 L210,350" />
        </svg>
      </div>

      <div className="container-topcv relative z-10 max-w-310">
        {/* 1. Centered Title */}
        <h1 className="mb-5 text-center text-xl font-bold tracking-wide text-white sm:text-2xl md:text-[25px]">
          InterVue - Tạo CV, Tìm việc làm, Tuyển dụng hiệu quả
        </h1>

        {/* 2. Balanced Search Bar (Same width as the 3 blocks below) */}
        <div className="mx-auto mb-6 flex w-full max-w-310 items-center justify-between gap-3 rounded-full border border-white/20 bg-white p-2 shadow-2xl">
          {/* Keyword Input */}
          <div className="flex flex-1 items-center pr-4 pl-6">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Vị trí tuyển dụng, tên công ty"
              className="text-navy w-full bg-transparent text-[15px] placeholder-[#7f878f] focus:outline-none"
            />
          </div>

          {/* Divider Line */}
          <div className="h-8 w-px bg-[#e2e8f0]" />

          {/* Location Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="text-navy hover:text-primary flex cursor-pointer items-center gap-2.5 px-6 py-2.5 text-[15px] transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#7f878f]" />
              <span className="max-w-37.5 truncate font-medium">{selectedCity}</span>
              <ChevronDown className="h-4 w-4 text-[#7f878f]" />
            </button>

            {/* Dropdown Options */}
            {isCityOpen && (
              <div className="absolute top-full right-0 z-50 mt-3 w-56 rounded-2xl border border-[#e9eaec] bg-white py-2 shadow-xl">
                {HERO_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityOpen(false);
                    }}
                    className={`hover:bg-primary-light hover:text-primary w-full px-4 py-2 text-left text-[14px] transition-colors ${
                      selectedCity === city ? 'bg-primary-tag text-primary font-semibold' : 'text-navy'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Green Search Button */}
          <button
            type="button"
            className="bg-primary hover:bg-primary-hover mr-1 flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-8 py-3 text-[15px] font-semibold text-white shadow-md transition-all"
          >
            <Search className="h-4 w-4" />
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* 3. Three-Block Layout Below Search Bar */}
        <div className="mx-auto grid max-w-310 grid-cols-1 items-stretch gap-4 md:grid-cols-12">
          <CategoryPanel
            categories={categories}
            page={categoryPage}
            totalPages={HERO_CATEGORY_TOTAL_PAGES}
            onPrevPage={() => setCategoryPage((p) => Math.max(1, p - 1))}
            onNextPage={() => setCategoryPage((p) => (p < HERO_CATEGORY_TOTAL_PAGES ? p + 1 : 1))}
          />

          <RecruitmentBanner
            current={currentBanner}
            onPrev={() => setCurrentBanner((prev) => (prev - 1 + 2) % 2)}
            onNext={() => setCurrentBanner((prev) => (prev + 1) % 2)}
            onSelect={setCurrentBanner}
          />

          <QrLoginPanel />
        </div>
      </div>
    </section>
  );
}

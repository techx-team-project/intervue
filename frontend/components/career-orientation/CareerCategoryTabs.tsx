'use client';

import React from 'react';
import { CareerCategory } from '@/types/career';

interface CareerCategoryTabsProps {
  categories: CareerCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function CareerCategoryTabs({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CareerCategoryTabsProps) {
  return (
    <div className="sticky top-18 z-20 border-b border-[#e9eaec] bg-white/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth py-2.5">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary shadow-primary/20 text-white shadow-sm'
                    : 'hover:bg-primary-light hover:text-primary text-[#526475]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#7f878f]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

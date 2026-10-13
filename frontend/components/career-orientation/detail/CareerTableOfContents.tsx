'use client';

import React, { useState, useEffect } from 'react';
import { CareerTableOfContentsItem } from '@/types/career';
import { ListFilter, ChevronDown, ChevronUp } from 'lucide-react';

interface CareerTableOfContentsProps {
  items: CareerTableOfContentsItem[];
}

export default function CareerTableOfContents({ items }: CareerTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="sticky top-24 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
      <div
        className="flex cursor-pointer items-center justify-between select-none"
        onClick={() => setIsOpenMobile(!isOpenMobile)}
      >
        <div className="flex items-center gap-2">
          <div className="text-primary flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
            <ListFilter className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-[#171717] sm:text-base">Mục lục bài viết</h3>
        </div>

        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 sm:hidden"
          aria-label="Toggle Table of Contents"
        >
          {isOpenMobile ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpenMobile && (
        <nav className="mt-4 max-h-[calc(100vh-220px)] space-y-1.5 overflow-y-auto border-t border-gray-100 pt-3 pr-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollToSection(e, item.id)}
                className={`block rounded-lg px-2.5 py-1.5 text-xs leading-relaxed font-medium transition-all duration-200 ${
                  item.level === 2 ? 'pl-6' : ''
                } ${
                  isActive
                    ? 'border-primary bg-primary-light text-primary border-l-3 font-semibold'
                    : 'text-[#526475] hover:bg-gray-50 hover:text-[#171717]'
                }`}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}

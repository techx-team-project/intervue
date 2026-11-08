'use client';

import { HERO_CATEGORY_PAGE_SIZE, HOME_CATEGORIES } from '@/constants/home/categories';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const TOTAL_PAGES = Math.ceil(HOME_CATEGORIES.length / HERO_CATEGORY_PAGE_SIZE);
const PAGER_BUTTON_CLASS =
  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-primary text-primary transition-colors duration-150 hover:bg-primary-light disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-outline disabled:hover:bg-transparent';

export default function CategoryPanel() {
  const [page, setPage] = useState(0);
  const items = HOME_CATEGORIES.slice(page * HERO_CATEGORY_PAGE_SIZE, (page + 1) * HERO_CATEGORY_PAGE_SIZE);

  return (
    <div className="bg-surface expanded:h-90 flex flex-col overflow-hidden rounded-2xl">
      <h2 className="sr-only">Nhóm ngành IT</h2>
      <ul key={page} className="animate-fade-in flex-1 px-3 py-2">
        {items.map(({ id, label, keyword }) => (
          <li key={id}>
            <Link
              href={`/jobs?q=${encodeURIComponent(keyword)}`}
              className="text-title-md text-on-surface hover:bg-primary-light hover:text-primary ease-standard flex h-12 items-center justify-between rounded-lg px-3 font-medium transition-colors duration-150"
            >
              <span className="truncate">{label}</span>
              <ChevronRight className="text-outline h-5 w-5 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-outline-variant flex items-center justify-between border-t px-5 py-3">
        <span className="text-title-md text-on-surface-variant" aria-live="polite">
          {page + 1}/{TOTAL_PAGES}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Trang trước"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className={PAGER_BUTTON_CLASS}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Trang sau"
            disabled={page === TOTAL_PAGES - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className={PAGER_BUTTON_CLASS}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

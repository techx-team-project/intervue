'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Briefcase, Calculator, GraduationCap, Sparkles } from 'lucide-react';

interface CategoryTabItem {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

const TABS: CategoryTabItem[] = [
  {
    id: 'all',
    name: 'Tất cả bài viết',
    href: '/blog',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'orientation',
    name: 'Định hướng nghề nghiệp',
    href: '/blog/dinh-huong-nghe-nghiep',
    icon: <Compass className="h-4 w-4" />,
    count: 6,
  },
  {
    id: 'tips',
    name: 'Bí quyết tìm việc',
    href: '/blog/bi-kip-tim-viec',
    icon: <Briefcase className="h-4 w-4" />,
    count: 6,
  },
  {
    id: 'salary',
    name: 'Chế độ lương thưởng',
    href: '/blog/che-do-luong-thuong',
    icon: <Calculator className="h-4 w-4" />,
    count: 6,
  },
  {
    id: 'skills',
    name: 'Kiến thức chuyên ngành',
    href: '/blog/kien-thuc-chuyen-nganh',
    icon: <GraduationCap className="h-4 w-4" />,
    count: 6,
  },
];

interface BlogCategoryTabsProps {
  currentCategorySlug?: string;
}

export default function BlogCategoryTabs({ currentCategorySlug }: BlogCategoryTabsProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-30 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mb-px flex items-center gap-2 overflow-x-auto py-2.5 sm:gap-3">
          {TABS.map((tab) => {
            const isActive =
              (!currentCategorySlug && tab.href === '/blog' && pathname === '/blog') ||
              (currentCategorySlug && tab.href.endsWith(currentCategorySlug));

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                  isActive
                    ? 'bg-[#00b14f] text-white shadow-md shadow-emerald-500/20'
                    : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0f172a]'
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? 'text-white' : 'text-[#64748b] group-hover:text-[#00b14f]'
                  }`}
                >
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#64748b] shadow-2xs'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

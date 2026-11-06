'use client';

import React from 'react';
import Link from 'next/link';
import type { BlogCategoryResource, BlogPostStatus } from '@/types/blog';
import { Search, Plus, Filter } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface AdminBlogFilterBarProps {
  categories: BlogCategoryResource[];
  keyword: string;
  onKeywordChange: (val: string) => void;
  categoryId?: number;
  onCategoryChange: (id?: number) => void;
  status?: BlogPostStatus;
  onStatusChange: (status?: BlogPostStatus) => void;
  isFeatured?: boolean;
  onFeaturedChange: (featured?: boolean) => void;
}

export function AdminBlogFilterBar({
  categories,
  keyword,
  onKeywordChange,
  categoryId,
  onCategoryChange,
  status,
  onStatusChange,
  isFeatured,
  onFeaturedChange,
}: AdminBlogFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm theo tiêu đề bài viết..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs font-medium text-slate-900 transition placeholder:text-slate-400 focus:border-[#00b14f] focus:bg-white focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryId ?? ''}
            onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : undefined)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 transition focus:border-[#00b14f] focus:bg-white focus:outline-none"
          >
            <option value="">Tất cả chuyên mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={status ?? ''}
            onChange={(e) => onStatusChange((e.target.value as BlogPostStatus) || undefined)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 transition focus:border-[#00b14f] focus:bg-white focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>

          <button
            type="button"
            onClick={() => onFeaturedChange(isFeatured ? undefined : true)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              isFeatured
                ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-2xs'
                : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Nổi bật</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.ADMIN_CONTENT_BLOG_CREATE}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#00b14f] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#009643]"
        >
          <Plus className="h-4 w-4" />
          <span>Viết bài mới</span>
        </Link>
      </div>
    </div>
  );
}

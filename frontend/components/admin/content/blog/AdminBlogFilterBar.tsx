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
    <div className="border-outline-variant/80 flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="text-outline absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search by article title, slug..."
            className="border-outline-variant bg-surface-container-low/50 text-on-surface placeholder:text-outline focus:border-primary w-full rounded-xl border py-2 pr-4 pl-9 text-xs font-medium transition focus:bg-white focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryId ?? ''}
            onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : undefined)}
            className="border-outline-variant bg-surface-container-low/50 text-on-surface focus:border-primary rounded-xl border px-3 py-2 text-xs font-medium transition focus:bg-white focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={status ?? ''}
            onChange={(e) => onStatusChange((e.target.value as BlogPostStatus) || undefined)}
            className="border-outline-variant bg-surface-container-low/50 text-on-surface focus:border-primary rounded-xl border px-3 py-2 text-xs font-medium transition focus:bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button
            type="button"
            onClick={() => onFeaturedChange(isFeatured ? undefined : true)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              isFeatured
                ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-2xs'
                : 'border-outline-variant bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Featured</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.ADMIN_CONTENT_BLOG_CREATE}
          className="bg-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#009643]"
        >
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </Link>
      </div>
    </div>
  );
}

export default AdminBlogFilterBar;

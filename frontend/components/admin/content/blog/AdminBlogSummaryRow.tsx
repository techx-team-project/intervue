'use client';

import React from 'react';
import type { AdminBlogSummaryResource } from '@/types/blog';
import { FileText, CheckCircle2, Clock, Eye } from 'lucide-react';

interface AdminBlogSummaryRowProps {
  summary?: AdminBlogSummaryResource;
}

export function AdminBlogSummaryRow({ summary }: AdminBlogSummaryRowProps) {
  const total = summary?.totalArticles ?? 0;
  const published = summary?.publishedArticles ?? 0;
  const drafts = summary?.draftArticles ?? 0;
  const views = summary?.totalViews ?? 0;

  const formattedViews =
    views >= 1000000
      ? `${(views / 1000000).toFixed(1)}M`
      : views >= 1000
        ? `${(views / 1000).toFixed(1)}K`
        : String(views);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="border-outline-variant/80 flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-2xs">
        <div className="bg-surface-container-high text-on-surface flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">Total Articles</p>
          <p className="text-on-surface mt-0.5 text-2xl font-bold tracking-tight">{total}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-2xs">
        <div className="text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">Published</p>
          <p className="text-primary mt-0.5 text-2xl font-bold tracking-tight">{published}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">Drafts</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-amber-600">{drafts}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Eye className="h-6 w-6" />
        </div>
        <div>
          <p className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">Total Views</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-indigo-600">{formattedViews}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminBlogSummaryRow;

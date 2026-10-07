'use client';

import React, { useState } from 'react';
import { CareerArticle } from '@/types/career';
import { Share2, Bookmark, Check, Copy } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CareerDetailBreadcrumbProps {
  article: CareerArticle;
}

export default function CareerDetailBreadcrumb({ article }: CareerDetailBreadcrumbProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const items = [
    { label: 'Cẩm nang nghề nghiệp', href: '/career-orientation' },
    { label: article.category, href: '/career-orientation' },
    { label: article.title },
  ];

  return (
    <div className="border-b border-slate-200 bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Breadcrumb links */}
          <Breadcrumb items={items} showHome className="text-xs" />

          {/* Social share & actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hover:text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-500"
            >
              {copied ? (
                <>
                  <Check className="text-primary h-3.5 w-3.5" />
                  <span className="text-primary font-semibold">Đã sao chép link</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Sao chép link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                bookmarked
                  ? 'text-primary border-emerald-300 bg-emerald-50'
                  : 'hover:text-primary border-slate-200 text-slate-600 hover:border-emerald-500'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
              <span>{bookmarked ? 'Đã lưu' : 'Lưu bài viết'}</span>
            </button>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.href : '',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
              title="Chia sẻ lên Facebook"
            >
              <Share2 className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

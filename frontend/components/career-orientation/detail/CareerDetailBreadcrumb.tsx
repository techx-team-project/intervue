'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CareerArticle } from '@/types/career';
import { ChevronRight, Share2, Bookmark, Check, Copy } from 'lucide-react';

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

  return (
    <div className="border-b border-gray-200 bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Breadcrumb links */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#7f878f]">
            <Link href="/" className="transition-colors hover:text-[#00b14f]">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/career-orientation" className="transition-colors hover:text-[#00b14f]">
              Cẩm nang nghề nghiệp
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link
              href="/career-orientation"
              className="font-medium text-[#263a4d] transition-colors hover:text-[#00b14f]"
            >
              {article.category}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1 max-w-xs font-semibold text-[#00b14f] sm:max-w-md">{article.title}</span>
          </nav>

          {/* Social share & actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#526475] transition hover:border-[#00b14f] hover:text-[#00b14f]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#00b14f]" />
                  <span className="font-semibold text-[#00b14f]">Đã sao chép link</span>
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
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                bookmarked
                  ? 'border-emerald-300 bg-emerald-50 text-[#00b14f]'
                  : 'border-gray-200 text-[#526475] hover:border-[#00b14f] hover:text-[#00b14f]'
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#526475] transition hover:border-blue-600 hover:text-blue-600"
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

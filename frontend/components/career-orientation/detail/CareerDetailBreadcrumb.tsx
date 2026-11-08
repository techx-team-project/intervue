'use client';

import React, { useState } from 'react';
import { CareerArticle } from '@/types/career';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';
import { Share2, Bookmark, Check, Copy } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CareerDetailBreadcrumbProps {
  article: CareerArticle;
}

export default function CareerDetailBreadcrumb({ article }: CareerDetailBreadcrumbProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { handbookLabel, copyLink, copiedLink, saveArticle, savedArticle, shareFacebook } =
    CAREER_ORIENTATION_MESSAGES.detailBreadcrumb;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const items = [
    { label: handbookLabel, href: '/career-orientation' },
    { label: article.category, href: '/career-orientation' },
    { label: article.title },
  ];

  return (
    <div className="border-outline-variant border-b bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Breadcrumb items={items} showHome className="text-xs" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hover:text-primary border-outline-variant text-on-surface-variant hover:border-primary inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="text-primary h-3.5 w-3.5" />
                  <span className="text-primary font-semibold">{copiedLink}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copyLink}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                bookmarked
                  ? 'text-primary border-primary/40 bg-primary-light'
                  : 'hover:text-primary border-outline-variant text-on-surface-variant hover:border-primary'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
              <span>{bookmarked ? savedArticle : saveArticle}</span>
            </button>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.href : '',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-outline-variant text-on-surface-variant hover:border-outline-variant hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border transition"
              title={shareFacebook}
            >
              <Share2 className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

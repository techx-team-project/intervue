'use client';

import React, { useState } from 'react';
import { BlogArticle } from '@/types/blog';
import { Bookmark, Check, Copy } from 'lucide-react';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';

interface BlogDetailBreadcrumbProps {
  article: BlogArticle;
}

export default function BlogDetailBreadcrumb({ article }: BlogDetailBreadcrumbProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Cẩm nang nghề nghiệp', href: '/blog' },
    { label: article.category, href: `/blog/${article.categorySlug}` },
    { label: article.title },
  ];

  return (
    <div className="border-b border-gray-200 bg-white py-3.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Breadcrumb items={breadcrumbItems} className="text-xs" />

          {/* Social share & actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="text-primary h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              {copied ? 'Đã sao chép link' : 'Sao chép link'}
            </Button>

            <Button
              type="button"
              variant={bookmarked ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              leftIcon={<Bookmark className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              {bookmarked ? 'Đã lưu' : 'Lưu bài viết'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

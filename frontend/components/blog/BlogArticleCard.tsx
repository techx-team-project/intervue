'use client';

import React from 'react';
import Link from 'next/link';
import { BlogArticle } from '@/types/blog';
import { Clock, Eye, ArrowUpRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface BlogArticleCardProps {
  article: BlogArticle;
}

export default function BlogArticleCard({ article }: BlogArticleCardProps) {
  const articleUrl = `/blog/${article.categorySlug}/${article.slug}`;

  return (
    <article className="group hover:border-primary/50 flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover Image */}
      <Link href={articleUrl} className="relative block aspect-video w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="success" size="sm" className="bg-primary border-transparent text-white">
            {article.category}
          </Badge>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Metadata */}
          <div className="mb-2.5 flex items-center gap-2 text-xs text-[#7f878f]">
            <span className="text-navy font-medium">{article.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewsCount}
            </span>
          </div>

          {/* Title */}
          <h3 className="group-hover:text-primary line-clamp-2 text-base font-bold text-[#171717] transition-colors">
            <Link href={articleUrl}>{article.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#526475]">{article.excerpt}</p>
        </div>

        {/* Card Footer: Author & Action */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-navy line-clamp-1 text-xs font-medium">{article.author.name}</span>
            </div>

            <Link
              href={articleUrl}
              className="text-primary inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
            >
              <span>Đọc tiếp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

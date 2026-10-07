'use client';

import React from 'react';
import Link from 'next/link';
import { CareerArticle } from '@/types/career';
import { Clock, Eye, ArrowUpRight } from 'lucide-react';

interface CareerArticleCardProps {
  article: CareerArticle;
}

export default function CareerArticleCard({ article }: CareerArticleCardProps) {
  return (
    <article className="group hover:border-primary/50 flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover Image */}
      <Link
        href={`/career-orientation/${article.slug}`}
        className="relative block aspect-video w-full overflow-hidden bg-gray-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-primary rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            {article.category}
          </span>
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
          <Link href={`/career-orientation/${article.slug}`}>
            <h3 className="group-hover:text-primary line-clamp-2 text-base leading-snug font-bold text-[#171717] transition-colors">
              {article.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#526475] sm:text-sm">{article.excerpt}</p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-[#526475]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3.5">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.author.avatar} alt={article.author.name} className="h-6 w-6 rounded-full object-cover" />
            <span className="text-navy line-clamp-1 text-xs font-medium">{article.author.name}</span>
          </div>

          <Link
            href={`/career-orientation/${article.slug}`}
            className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            <span>Chi tiết</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

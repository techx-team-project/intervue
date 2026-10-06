'use client';

import React from 'react';
import Link from 'next/link';
import { CareerArticle } from '@/types/career';
import { Clock, Eye, ArrowUpRight, Flame, Sparkles } from 'lucide-react';

interface CareerFeaturedGridProps {
  articles: CareerArticle[];
}

export default function CareerFeaturedGrid({ articles }: CareerFeaturedGridProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <Flame className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[#171717] sm:text-2xl">Bài viết nổi bật</h2>
        </div>
        <span className="hidden text-xs text-[#7f878f] sm:inline-block">Cập nhật xu hướng tuyển dụng mới nhất</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main large featured card */}
        {mainArticle && (
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#00b14f]/50 hover:shadow-xl lg:col-span-7">
            <Link
              href={`/career-orientation/${mainArticle.slug}`}
              className="relative block aspect-video w-full overflow-hidden bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainArticle.coverImage}
                alt={mainArticle.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-[#00b14f] px-3 py-1 text-xs font-semibold text-white shadow-md">
                  {mainArticle.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-xs">
                  <Sparkles className="h-3 w-3" />
                  Tiêu điểm
                </span>
              </div>
            </Link>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="mb-2.5 flex items-center gap-3 text-xs text-[#7f878f]">
                  <span className="font-medium text-[#263a4d]">{mainArticle.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {mainArticle.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {mainArticle.viewsCount} lượt xem
                  </span>
                </div>

                <Link href={`/career-orientation/${mainArticle.slug}`}>
                  <h3 className="line-clamp-2 text-lg leading-snug font-bold text-[#171717] transition-colors group-hover:text-[#00b14f] sm:text-xl">
                    {mainArticle.title}
                  </h3>
                </Link>

                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#526475]">{mainArticle.excerpt}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainArticle.author.avatar}
                    alt={mainArticle.author.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-50"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#171717]">{mainArticle.author.name}</p>
                    <p className="text-[11px] text-[#7f878f]">{mainArticle.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/career-orientation/${mainArticle.slug}`}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#f2fbf6] px-3.5 py-1.5 text-xs font-semibold text-[#00b14f] transition hover:bg-[#00b14f] hover:text-white"
                >
                  <span>Khám phá ngay</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Side 2 stacked articles */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {sideArticles.map((article) => (
            <div
              key={article.id}
              className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00b14f]/50 hover:shadow-lg sm:flex-row lg:flex-row"
            >
              <Link
                href={`/career-orientation/${article.slug}`}
                className="relative block aspect-video shrink-0 overflow-hidden bg-gray-100 sm:w-44 lg:w-48"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 rounded-md bg-[#00b14f] px-2 py-0.5 text-[10px] font-semibold text-white">
                  {article.category}
                </span>
              </Link>

              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="mb-1.5 flex items-center gap-2 text-[11px] text-[#7f878f]">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <Link href={`/career-orientation/${article.slug}`}>
                    <h4 className="line-clamp-2 text-sm leading-snug font-bold text-[#171717] transition-colors group-hover:text-[#00b14f] sm:text-base">
                      {article.title}
                    </h4>
                  </Link>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#526475]">{article.excerpt}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="line-clamp-1 text-[11px] font-medium text-[#263a4d]">{article.author.name}</span>
                  </div>

                  <Link
                    href={`/career-orientation/${article.slug}`}
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#00b14f] hover:underline"
                  >
                    Đọc tiếp
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

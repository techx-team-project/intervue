'use client';

import React from 'react';
import Link from 'next/link';
import { BlogArticle } from '@/types/blog';
import { Clock, Eye, ArrowUpRight, Flame, Sparkles } from 'lucide-react';

interface BlogFeaturedGridProps {
  articles: BlogArticle[];
}

export default function BlogFeaturedGrid({ articles }: BlogFeaturedGridProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  const getArticleUrl = (art: BlogArticle) => `/blog/${art.categorySlug}/${art.slug}`;

  return (
    <section className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <Flame className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[#171717] sm:text-2xl">Featured Articles</h2>
        </div>
        <span className="hidden text-xs text-[#7f878f] sm:inline-block">
          Latest recruitment trends & career insights
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {mainArticle && (
          <div className="group hover:border-primary/50 flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs transition duration-300 hover:shadow-xl lg:col-span-7">
            <Link
              href={getArticleUrl(mainArticle)}
              className="relative block aspect-video w-full overflow-hidden bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                decoding="async"
                src={mainArticle.coverImage}
                alt={mainArticle.title}
                className="h-full w-full object-cover transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-primary rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
                  {mainArticle.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Spotlight
                </span>
              </div>
            </Link>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="mb-2.5 flex items-center gap-3 text-xs text-[#7f878f]">
                  <span className="text-navy font-medium">{mainArticle.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {mainArticle.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {mainArticle.viewsCount}
                  </span>
                </div>

                <h3 className="group-hover:text-primary text-lg font-bold text-[#171717] transition-colors sm:text-xl">
                  <Link href={getArticleUrl(mainArticle)}>{mainArticle.title}</Link>
                </h3>

                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#526475]">{mainArticle.excerpt}</p>

                {mainArticle.tags && mainArticle.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mainArticle.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#526475]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    loading="lazy"
                    decoding="async"
                    src={mainArticle.author.avatar}
                    alt={mainArticle.author.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#171717]">{mainArticle.author.name}</div>
                    <div className="text-[11px] text-[#7f878f]">{mainArticle.author.role}</div>
                  </div>
                </div>

                <Link
                  href={getArticleUrl(mainArticle)}
                  className="bg-primary/10 text-primary hover:bg-primary inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:text-white"
                >
                  <span>Read full story</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:col-span-5">
          {sideArticles.map((article) => (
            <div
              key={article.id}
              className="group hover:border-primary/50 flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition duration-300 hover:shadow-xl sm:flex-row sm:gap-5"
            >
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs text-[#7f878f]">
                    <span className="text-primary font-semibold">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h4 className="group-hover:text-primary line-clamp-2 text-sm font-bold text-[#171717] transition-colors sm:text-base">
                    <Link href={getArticleUrl(article)}>{article.title}</Link>
                  </h4>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#526475]">{article.excerpt}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#7f878f]">
                  <span className="text-navy font-medium">{article.author.name}</span>
                  <Link
                    href={getArticleUrl(article)}
                    className="text-primary inline-flex items-center gap-1 font-semibold hover:underline"
                  >
                    <span>Read story</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <Link
                href={getArticleUrl(article)}
                className="relative mt-3 block aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:mt-0 sm:aspect-square sm:w-28"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  loading="lazy"
                  decoding="async"
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

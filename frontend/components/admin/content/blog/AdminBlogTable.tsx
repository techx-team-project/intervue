'use client';

import React from 'react';
import Link from 'next/link';
import type { BlogPostListResource } from '@/types/blog';
import { ExternalLink, Edit, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import Switch from '@/components/ui/Switch';

interface AdminBlogTableProps {
  posts: BlogPostListResource[];
  onToggleFeatured: (post: BlogPostListResource) => void;
  onToggleStatus: (post: BlogPostListResource) => void;
  onDelete: (post: BlogPostListResource) => void;
}

export function AdminBlogTable({ posts, onToggleFeatured, onToggleStatus, onDelete }: AdminBlogTableProps) {
  if (posts.length === 0) {
    return (
      <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center shadow-2xs">
        <div className="bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
          <Sparkles className="h-6 w-6" />
        </div>
        <h4 className="text-on-surface mt-3 text-sm font-bold">No articles found</h4>
        <p className="text-on-surface-variant mt-1 text-xs">
          Try adjusting your search criteria or create a new article.
        </p>
      </div>
    );
  }

  return (
    <div className="border-outline-variant/80 overflow-hidden rounded-2xl border bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="py-3.5 pr-4 pl-6">Article</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-4 py-3.5 text-center">Featured</th>
              <th className="px-4 py-3.5 text-right">Views</th>
              <th className="px-4 py-3.5">Published Date</th>
              <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-outline-variant divide-y">
            {posts.map((post) => {
              const isPublished = post.status === 'PUBLISHED';
              const candidateUrl = `/blog/${post.categorySlug}/${post.slug}`;

              return (
                <tr key={post.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 pr-4 pl-6">
                    <div className="flex items-center gap-3.5">
                      <div className="bg-surface-container-high relative h-12 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          loading="lazy"
                          decoding="async"
                          src={
                            post.coverImageUrl ||
                            'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-md min-w-0">
                        <Link
                          href={`/admin/content/blog/${post.id}/edit`}
                          className="text-on-surface hover:text-primary line-clamp-1 font-bold transition"
                          title={post.title}
                        >
                          {post.title}
                        </Link>
                        <p className="text-label-sm text-outline mt-0.5 line-clamp-1">/{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="bg-surface-container-high text-label-sm text-on-surface inline-flex items-center rounded-lg px-2.5 py-1 font-semibold">
                      {post.categoryName || post.categorySlug}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(post)}
                      title="Click to toggle status"
                      className={`text-label-sm inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 font-bold transition hover:opacity-80 ${
                        isPublished ? 'text-primary bg-emerald-50' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {isPublished ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span>{isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <Switch
                        size="sm"
                        checked={post.isFeatured}
                        onChange={() => onToggleFeatured(post)}
                        ariaLabel="Toggle featured"
                      />
                    </div>
                  </td>

                  <td className="text-on-surface px-4 py-4 text-right font-medium whitespace-nowrap">
                    {post.viewsCount.toLocaleString()}
                  </td>

                  <td className="text-on-surface-variant px-4 py-4 whitespace-nowrap">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Unpublished'}
                  </td>

                  <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={candidateUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View live candidate article"
                        className="text-outline hover:bg-surface-container-high hover:text-on-surface-variant rounded-lg p-1.5 transition"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/admin/content/blog/${post.id}/edit`}
                        title="Edit article"
                        className="text-outline hover:bg-surface-container-high hover:text-primary rounded-lg p-1.5 transition"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(post)}
                        title="Delete article"
                        className="text-outline rounded-lg p-1.5 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBlogTable;

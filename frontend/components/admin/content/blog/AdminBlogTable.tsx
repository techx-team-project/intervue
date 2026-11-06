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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-sm font-bold text-slate-900">Không tìm thấy bài viết nào</h4>
        <p className="mt-1 text-xs text-slate-500">Hãy thử thay đổi điều kiện lọc hoặc tạo bài viết mới.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold tracking-wider text-slate-500 uppercase">
              <th className="py-3.5 pr-4 pl-6">Bài viết</th>
              <th className="px-4 py-3.5">Chuyên mục</th>
              <th className="px-4 py-3.5 text-center">Trạng thái</th>
              <th className="px-4 py-3.5 text-center">Nổi bật</th>
              <th className="px-4 py-3.5 text-right">Lượt xem</th>
              <th className="px-4 py-3.5">Ngày đăng</th>
              <th className="py-3.5 pr-6 pl-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => {
              const isPublished = post.status === 'PUBLISHED';
              const candidateUrl = `/blog/${post.categorySlug}/${post.slug}`;

              return (
                <tr key={post.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="py-4 pr-4 pl-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/60">
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
                          className="line-clamp-1 font-bold text-slate-900 transition hover:text-[#00b14f]"
                          title={post.title}
                        >
                          {post.title}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">/{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {post.categoryName || post.categorySlug}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(post)}
                      title="Bấm để đổi trạng thái"
                      className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition hover:opacity-80 ${
                        isPublished ? 'bg-emerald-50 text-[#00b14f]' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {isPublished ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span>{isPublished ? 'Xuất bản' : 'Bản nháp'}</span>
                    </button>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <Switch
                        size="sm"
                        checked={post.isFeatured}
                        onChange={() => onToggleFeatured(post)}
                        ariaLabel="Ghim nổi bật"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right font-medium whitespace-nowrap text-slate-700">
                    {post.viewsCount.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'Chưa xuất bản'}
                  </td>

                  <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={candidateUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Xem trang Candidate"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/admin/content/blog/${post.id}/edit`}
                        title="Chỉnh sửa bài viết"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#00b14f]"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(post)}
                        title="Xóa bài viết"
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
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

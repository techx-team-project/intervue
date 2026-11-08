'use client';

import React, { useState, useTransition } from 'react';
import type {
  AdminBlogSummaryResource,
  BlogCategoryResource,
  BlogPostListResource,
  BlogPostStatus,
} from '@/types/blog';
import type { Page } from '@/types/api';
import { AdminBlogSummaryRow } from './AdminBlogSummaryRow';
import { AdminBlogFilterBar } from './AdminBlogFilterBar';
import { AdminBlogTable } from './AdminBlogTable';
import { blogApi } from '@/apiRequest/blog';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface AdminBlogListViewProps {
  initialSummary?: AdminBlogSummaryResource;
  initialPage?: Page<BlogPostListResource>;
  categories: BlogCategoryResource[];
  onRefresh: () => void;
}

export function AdminBlogListView({ initialSummary, initialPage, categories, onRefresh }: AdminBlogListViewProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<BlogPostStatus | undefined>(undefined);
  const [isFeaturedFilter, setIsFeaturedFilter] = useState<boolean | undefined>(undefined);

  const [postsPage, setPostsPage] = useState<Page<BlogPostListResource> | undefined>(initialPage);
  const [summary, setSummary] = useState<AdminBlogSummaryResource | undefined>(initialSummary);

  const [postToDelete, setPostToDelete] = useState<BlogPostListResource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, startTransition] = useTransition();

  const loadData = async (page = 0) => {
    try {
      const [newSummary, newPage] = await Promise.all([
        blogApi.getAdminSummary(),
        blogApi.searchAdmin({
          keyword,
          categoryId: selectedCategoryId,
          status: selectedStatus,
          isFeatured: isFeaturedFilter,
          page,
          size: 20,
        }),
      ]);
      setSummary(newSummary);
      setPostsPage(newPage);
    } catch {
      // Ignore
    }
  };

  const handleToggleFeatured = async (post: BlogPostListResource) => {
    try {
      await blogApi.toggleFeatured(post.id);
      loadData(postsPage?.page ?? 0);
    } catch {
      // Ignore
    }
  };

  const handleToggleStatus = async (post: BlogPostListResource) => {
    const nextStatus: BlogPostStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await blogApi.updateStatus(post.id, nextStatus);
      loadData(postsPage?.page ?? 0);
    } catch {
      // Ignore
    }
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await blogApi.deletePost(postToDelete.id);
      setPostToDelete(null);
      loadData(postsPage?.page ?? 0);
      onRefresh();
    } catch {
      // Ignore
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = () => {
    startTransition(() => {
      loadData(0);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-on-surface text-xl font-bold tracking-tight sm:text-2xl">
            Career Guides & Blog Management
          </h1>
          <p className="text-on-surface-variant mt-1 text-xs">
            Publish career advice, salary insights, and industry recruitment playbooks.
          </p>
        </div>
      </div>

      <AdminBlogSummaryRow summary={summary} />

      <AdminBlogFilterBar
        categories={categories}
        keyword={keyword}
        onKeywordChange={(val) => {
          setKeyword(val);
          handleFilterChange();
        }}
        categoryId={selectedCategoryId}
        onCategoryChange={(catId) => {
          setSelectedCategoryId(catId);
          handleFilterChange();
        }}
        status={selectedStatus}
        onStatusChange={(st) => {
          setSelectedStatus(st);
          handleFilterChange();
        }}
        isFeatured={isFeaturedFilter}
        onFeaturedChange={(feat) => {
          setIsFeaturedFilter(feat);
          handleFilterChange();
        }}
      />

      <AdminBlogTable
        posts={postsPage?.items ?? []}
        onToggleFeatured={handleToggleFeatured}
        onToggleStatus={handleToggleStatus}
        onDelete={(p) => setPostToDelete(p)}
      />

      {postsPage && postsPage.totalPages > 1 && (
        <div className="border-outline-variant/80 text-on-surface-variant flex items-center justify-between rounded-2xl border bg-white px-5 py-3 text-xs shadow-2xs">
          <div>
            Page <span className="text-on-surface font-bold">{postsPage.page + 1}</span> of{' '}
            <span className="text-on-surface font-bold">{postsPage.totalPages}</span> (
            <span className="text-on-surface font-bold">{postsPage.totalItems}</span> total articles)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={postsPage.page === 0}
              onClick={() => loadData(postsPage.page - 1)}
              className="border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex cursor-pointer items-center gap-1 rounded-xl border bg-white px-3 py-1.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={postsPage.page + 1 >= postsPage.totalPages}
              onClick={() => loadData(postsPage.page + 1)}
              className="border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex cursor-pointer items-center gap-1 rounded-xl border bg-white px-3 py-1.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {postToDelete && (
        <Modal isOpen={true} onClose={() => setPostToDelete(null)} title="Delete Article" maxWidth="sm">
          <div className="space-y-4 p-5">
            <div className="flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-xs text-rose-800">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
              <p className="leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="font-bold text-rose-900">&ldquo;{postToDelete.title}&rdquo;</strong>? This will
                remove the article from the candidate portal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPostToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmDelete} isLoading={isDeleting}>
                Delete Article
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminBlogListView;

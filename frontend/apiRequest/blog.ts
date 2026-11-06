import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminBlogSummaryResource,
  BlogCategoryResource,
  BlogPostDetailResource,
  BlogPostListResource,
  BlogPostStatus,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '@/types/blog';

export interface BlogSearchParams {
  keyword?: string;
  categorySlug?: string;
  tag?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminBlogSearchParams {
  keyword?: string;
  categoryId?: number;
  status?: BlogPostStatus;
  isFeatured?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const blogApi = {
  // Public APIs for candidates
  getCategories: () => request<BlogCategoryResource[]>('/blogs/categories'),

  getCategory: (slug: string) => request<BlogCategoryResource>(`/blogs/categories/${slug}`),

  search: (params: BlogSearchParams = {}) => {
    const qs = new URLSearchParams();
    if (params.keyword?.trim()) qs.set('keyword', params.keyword.trim());
    if (params.categorySlug?.trim()) qs.set('categorySlug', params.categorySlug.trim());
    if (params.tag?.trim()) qs.set('tag', params.tag.trim());
    if (params.page !== undefined) qs.set('page', String(params.page));
    if (params.size !== undefined) qs.set('size', String(params.size));
    if (params.sort) qs.set('sort', params.sort);
    const query = qs.toString();
    return request<Page<BlogPostListResource>>(`/blogs${query ? `?${query}` : ''}`);
  },

  getFeatured: () => request<BlogPostListResource[]>('/blogs/featured'),

  getDetail: (categorySlug: string, slug: string) => request<BlogPostDetailResource>(`/blogs/${categorySlug}/${slug}`),

  getRelated: (categorySlug: string, slug: string, limit = 3) =>
    request<BlogPostListResource[]>(`/blogs/${categorySlug}/${slug}/related?limit=${limit}`),

  // Admin CMS APIs
  getAdminSummary: () => request<AdminBlogSummaryResource>('/admin/blogs/summary'),

  searchAdmin: (params: AdminBlogSearchParams = {}) => {
    const qs = new URLSearchParams();
    if (params.keyword?.trim()) qs.set('keyword', params.keyword.trim());
    if (params.categoryId !== undefined) qs.set('categoryId', String(params.categoryId));
    if (params.status) qs.set('status', params.status);
    if (params.isFeatured !== undefined) qs.set('isFeatured', String(params.isFeatured));
    if (params.page !== undefined) qs.set('page', String(params.page));
    if (params.size !== undefined) qs.set('size', String(params.size));
    if (params.sort) qs.set('sort', params.sort);
    const query = qs.toString();
    return request<Page<BlogPostListResource>>(`/admin/blogs${query ? `?${query}` : ''}`);
  },

  getAdminDetail: (id: number) => request<BlogPostDetailResource>(`/admin/blogs/${id}`),

  createPost: (data: CreateBlogPostInput) =>
    request<BlogPostDetailResource>('/admin/blogs', {
      method: 'POST',
      body: data,
    }),

  updatePost: (id: number, data: UpdateBlogPostInput) =>
    request<BlogPostDetailResource>(`/admin/blogs/${id}`, {
      method: 'PUT',
      body: data,
    }),

  updateStatus: (id: number, status: BlogPostStatus) =>
    request<BlogPostDetailResource>(`/admin/blogs/${id}/status?status=${status}`, {
      method: 'PATCH',
    }),

  toggleFeatured: (id: number) =>
    request<BlogPostDetailResource>(`/admin/blogs/${id}/featured`, {
      method: 'PATCH',
    }),

  deletePost: (id: number) =>
    request<void>(`/admin/blogs/${id}`, {
      method: 'DELETE',
    }),

  uploadCoverImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string; publicId: string }>('/admin/blogs/cover-image', {
      method: 'POST',
      body: formData,
    });
  },
};

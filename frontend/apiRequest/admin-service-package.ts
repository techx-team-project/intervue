import { request } from '@/apiRequest/http';
import type {
  AdminServiceCategory,
  AdminServicePackage,
  ReorderServiceCategoriesInput,
  SaveServiceCategoryInput,
  SaveServicePackageInput,
  ServicePackageStatus,
} from '@/types/admin-service-package';
import type { Page } from '@/types/api';

export type AdminServicePackageSearchParams = {
  query?: string;
  categoryId?: number;
  status?: ServicePackageStatus;
  page?: number;
  size?: number;
};

function toQuery(params: AdminServicePackageSearchParams) {
  const query = new URLSearchParams();
  if (params.query?.trim()) query.set('query', params.query.trim());
  if (params.categoryId) query.set('categoryId', String(params.categoryId));
  if (params.status) query.set('status', params.status);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 20));
  return query.toString();
}

export const adminServicePackageApi = {
  listCategories: () => request<AdminServiceCategory[]>('/admin/service-categories'),

  getCategory: (id: number) => request<AdminServiceCategory>(`/admin/service-categories/${id}`),

  createCategory: (data: SaveServiceCategoryInput) =>
    request<AdminServiceCategory>('/admin/service-categories', { method: 'POST', body: data }),

  updateCategory: (id: number, data: SaveServiceCategoryInput) =>
    request<AdminServiceCategory>(`/admin/service-categories/${id}`, { method: 'PUT', body: data }),

  setCategoryActive: (id: number, active: boolean) =>
    request<AdminServiceCategory>(`/admin/service-categories/${id}/${active ? 'activate' : 'deactivate'}`, {
      method: 'POST',
    }),

  reorderCategories: (data: ReorderServiceCategoriesInput) =>
    request<AdminServiceCategory[]>('/admin/service-categories/reorder', { method: 'PUT', body: data }),

  deleteCategory: (id: number) => request<void>(`/admin/service-categories/${id}`, { method: 'DELETE' }),

  searchPackages: (params: AdminServicePackageSearchParams) =>
    request<Page<AdminServicePackage>>(`/admin/service-packages?${toQuery(params)}`),

  getPackage: (id: number) => request<AdminServicePackage>(`/admin/service-packages/${id}`),

  createPackage: (data: SaveServicePackageInput) =>
    request<AdminServicePackage>('/admin/service-packages', { method: 'POST', body: data }),

  updatePackage: (id: number, data: SaveServicePackageInput) =>
    request<AdminServicePackage>(`/admin/service-packages/${id}`, { method: 'PUT', body: data }),

  setStatus: (id: number, active: boolean) =>
    request<AdminServicePackage>(`/admin/service-packages/${id}/${active ? 'activate' : 'deactivate'}`, {
      method: 'POST',
    }),
};

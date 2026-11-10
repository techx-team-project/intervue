import { request } from '@/apiRequest/http';
import type { RecruiterCart } from '@/types/recruiter-cart';

export const recruiterCartApi = {
  get: () => request<RecruiterCart>('/recruiter/cart'),

  addItem: (packageId: number, quantity: number, weeks?: string[]) =>
    request<RecruiterCart>('/recruiter/cart/items', { method: 'POST', body: { packageId, quantity, weeks } }),

  updateItem: (id: number, quantity: number) =>
    request<RecruiterCart>(`/recruiter/cart/items/${id}`, { method: 'PATCH', body: { quantity } }),

  removeItem: (id: number) => request<RecruiterCart>(`/recruiter/cart/items/${id}`, { method: 'DELETE' }),

  clear: () => request<RecruiterCart>('/recruiter/cart', { method: 'DELETE' }),
};

import { request } from '@/apiRequest/http';
import type { Entitlement, EntitlementUsage } from '@/types/entitlement';

export const entitlementApi = {
  stock: () => request<Entitlement[]>('/recruiter/entitlements'),

  active: () => request<EntitlementUsage[]>('/recruiter/entitlements/active'),

  activate: (id: number, jobId?: number) =>
    request<Entitlement>(`/recruiter/entitlements/${id}/activate`, {
      method: 'POST',
      body: jobId ? { jobId } : {},
    }),
};

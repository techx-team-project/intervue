import { request } from '@/apiRequest/http';
import type { ServiceCatalog, ServicePackageDetail } from '@/types/service-package';

export const servicePackageApi = {
  catalog: () => request<ServiceCatalog>('/recruiter/service-packages'),

  getBySlug: (slug: string) => request<ServicePackageDetail>(`/recruiter/service-packages/${slug}`),
};

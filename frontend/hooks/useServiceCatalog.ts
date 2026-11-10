'use client';

import { servicePackageApi } from '@/apiRequest/service-package';
import { useQuery } from '@tanstack/react-query';

const CATALOG_STALE_MS = 5 * 60 * 1000;

export const serviceCatalogKeys = {
  catalog: ['recruiter', 'service-packages', 'catalog'] as const,
  detail: (slug: string) => ['recruiter', 'service-packages', 'detail', slug] as const,
};

export function useServiceCatalog() {
  return useQuery({
    queryKey: serviceCatalogKeys.catalog,
    queryFn: servicePackageApi.catalog,
    staleTime: CATALOG_STALE_MS,
  });
}

export function useServicePackage(slug: string) {
  return useQuery({
    queryKey: serviceCatalogKeys.detail(slug),
    queryFn: () => servicePackageApi.getBySlug(slug),
    staleTime: CATALOG_STALE_MS,
  });
}

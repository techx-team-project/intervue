'use client';

import AdminServicePackageTable from '@/components/admin/services/AdminServicePackageTable';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { adminServicePackageApi, type AdminServicePackageSearchParams } from '@/apiRequest/admin-service-package';
import type { AdminServiceCategory, AdminServicePackage, ServicePackageStatus } from '@/types/admin-service-package';
import type { Page } from '@/types/api';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, FolderCog, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

interface AdminServicePackagesListViewProps {
  initialPage: Page<AdminServicePackage> | undefined;
  categories: AdminServiceCategory[];
  initialCategoryId?: string;
}

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function AdminServicePackagesListView({
  initialPage,
  categories,
  initialCategoryId = '',
}: AdminServicePackagesListViewProps) {
  const [result, setResult] = useState<Page<AdminServicePackage> | undefined>(initialPage);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const fetchPage = useCallback(async (params: AdminServicePackageSearchParams) => {
    setIsBusy(true);
    setError(null);
    try {
      setResult(await adminServicePackageApi.searchPackages({ ...params, size: PAGE_SIZE }));
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsBusy(false);
    }
  }, []);

  const currentParams = (page: number): AdminServicePackageSearchParams => ({
    query: query || undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    status: (status || undefined) as ServicePackageStatus | undefined,
    page,
  });

  const handleToggleActive = async (item: AdminServicePackage) => {
    setError(null);
    try {
      await adminServicePackageApi.setStatus(item.id, item.status !== 'ACTIVE');
      await fetchPage(currentParams(result?.page ?? 0));
    } catch (cause) {
      setError(getErrorMessage(cause));
    }
  };

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((category) => ({
      value: String(category.id),
      label: `${category.name} (${category.code})${category.isActive ? '' : ' — Hidden'}`,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-navy text-xl font-bold sm:text-2xl">Service packages</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Manage the catalog recruiters see on the buy-services page.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={ROUTES.ADMIN_SERVICE_CATEGORIES}>
            <Button variant="outline" leftIcon={<FolderCog className="h-4 w-4" />}>
              Categories
            </Button>
          </Link>
          <Link href={`${ROUTES.ADMIN_SERVICE_PACKAGES}/create`}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>New package</Button>
          </Link>
        </div>
      </div>

      <form
        className="border-outline-variant grid gap-3 rounded-2xl border bg-white p-4 shadow-2xs sm:grid-cols-[minmax(0,1fr)_200px_200px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          void fetchPage(currentParams(0));
        }}
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or code"
          leftIcon={<Search className="h-4 w-4" />}
        />
        <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} options={categoryOptions} />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} options={STATUS_OPTIONS} />
        <Button type="submit" isLoading={isBusy}>
          Filter
        </Button>
      </form>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {error}
        </div>
      )}

      <AdminServicePackageTable packages={result?.items ?? []} onToggleActive={handleToggleActive} />

      {result && result.totalPages > 1 && (
        <Pagination
          page={result.page + 1}
          pageCount={result.totalPages}
          totalItems={result.totalItems}
          pageSize={result.size}
          onPageChange={(page) => void fetchPage(currentParams(page - 1))}
        />
      )}
    </div>
  );
}

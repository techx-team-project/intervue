'use client';

import Pagination from '@/components/common/Pagination';
import CompanyCreditDetailModal from '@/components/admin/services/credit-prices/CompanyCreditDetailModal';
import { Button } from '@/components/ui/Button';
import { useAdminCompanyCredits } from '@/hooks/useCredits';
import { formatDate } from '@/utils/datetime';
import { Building2, Coins, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const PAGE_SIZE = 10;

export default function AdminCompanyCreditsTab() {
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useAdminCompanyCredits(submittedQuery, page - 1, PAGE_SIZE, true);

  const applySearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedQuery(searchInput.trim());
    setPage(1);
  };

  const resetSearch = () => {
    setSearchInput('');
    setSubmittedQuery('');
    setPage(1);
  };

  const companies = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  return (
    <div className="space-y-4">
      <form
        onSubmit={applySearch}
        className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col gap-2.5 rounded-lg border bg-white p-3 shadow-xs sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="text-outline pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search company by name or tax code..."
            className="border-outline-variant text-on-surface dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400 focus:border-primary w-full rounded-lg border bg-white py-2 pr-8 pl-9 text-sm focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={resetSearch}
              aria-label="Clear search"
              className="text-outline hover:text-on-surface absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="md">
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white px-6 py-12 text-center">
          <p className="dark:text-forest-300 text-on-surface-variant text-sm">Loading company credit wallets...</p>
        </div>
      ) : isError ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center gap-3 rounded-lg border bg-white px-6 py-12 text-center">
          <p className="text-navy dark:text-forest-50 text-sm font-semibold">Failed to load company credit wallets</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : companies.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center gap-2 rounded-lg border bg-white px-6 py-14 text-center shadow-xs">
          <Building2 className="text-outline h-9 w-9" />
          <p className="text-navy dark:text-forest-50 text-sm font-bold">No matching companies found</p>
          <p className="dark:text-forest-300 text-on-surface-variant text-xs">
            Try a different company name or tax code filter.
          </p>
        </div>
      ) : (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant overflow-hidden rounded-lg border bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="dark:border-forest-800 dark:bg-forest-950/60 dark:text-forest-300 border-outline-variant text-on-surface-variant border-b bg-slate-50/70 text-[11px] font-bold tracking-wider uppercase">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3 text-right">Available</th>
                  <th className="px-4 py-3 text-right">Granted</th>
                  <th className="px-4 py-3 text-right">Spent</th>
                  <th className="px-4 py-3 text-right">Expired</th>
                  <th className="px-4 py-3">Soonest Expiry</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="dark:divide-forest-800 divide-outline-variant/60 divide-y">
                {companies.map((company) => (
                  <tr key={company.companyId} className="dark:hover:bg-forest-850/40 hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="text-navy dark:text-forest-50 font-semibold">{company.companyName}</div>
                      <div className="dark:text-forest-400 text-on-surface-variant text-xs">
                        ID #{company.companyId}
                        {company.taxCode ? ` · Tax ${company.taxCode}` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <Coins className="h-3 w-3" />
                        {company.availableBalance.toLocaleString('en-US')}
                      </span>
                    </td>
                    <td className="text-on-surface dark:text-forest-200 px-4 py-3 text-right font-medium tabular-nums">
                      {company.lifetimeGranted.toLocaleString('en-US')}
                    </td>
                    <td className="text-on-surface dark:text-forest-200 px-4 py-3 text-right font-medium tabular-nums">
                      {company.lifetimeSpent.toLocaleString('en-US')}
                    </td>
                    <td className="dark:text-forest-400 text-on-surface-variant px-4 py-3 text-right tabular-nums">
                      {company.expiredBalance.toLocaleString('en-US')}
                    </td>
                    <td className="dark:text-forest-300 text-on-surface-variant px-4 py-3 text-xs whitespace-nowrap">
                      {company.nearestExpiryAt ? formatDate(company.nearestExpiryAt) : 'No expiry'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompanyId(company.companyId)}
                        leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
                        className="dark:border-forest-700 dark:text-forest-100"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dark:border-forest-800 border-outline-variant border-t px-4 py-3">
            <Pagination
              page={page}
              pageCount={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      <CompanyCreditDetailModal companyId={selectedCompanyId} onClose={() => setSelectedCompanyId(null)} />
    </div>
  );
}

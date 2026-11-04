'use client';

import { Building2, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { ManagedCompanyItem } from './mock-verification-data';

interface AdminCompanyDirectoryTableProps {
  companies: ManagedCompanyItem[];
  onSelectCompanyDossier?: (taxCode: string) => void;
}

export function AdminCompanyDirectoryTable({ companies, onSelectCompanyDossier }: AdminCompanyDirectoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED'>('ALL');
  const [copiedTax, setCopiedTax] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const handleCopyTax = (tax: string) => {
    navigator.clipboard.writeText(tax);
    setCopiedTax(tax);
    toast.success(`Copied Tax ID: ${tax}`);
    setTimeout(() => setCopiedTax(null), 1800);
  };

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.taxCode.includes(searchTerm) ||
        (c.tradingName && c.tradingName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || c.verificationStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchTerm, statusFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const firstItem = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const lastItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className="space-y-4">
      {/* Directory Filter Bar */}
      <div className="dark:border-forest-800 dark:bg-forest-900 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="dark:text-forest-400 pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Search by company name, Tax ID, or owner email..."
            className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-100 dark:placeholder-forest-500 w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-4 pl-9 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'ALL' | 'VERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED');
              setCurrentPage(0);
            }}
            className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-200 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING_VERIFICATION">Pending Review</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {totalItems === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 p-8 text-center">
            <Building2 className="dark:text-forest-700 h-9 w-9 text-slate-300" />
            <p className="dark:text-forest-200 text-sm font-semibold text-slate-700">No companies found</p>
            <p className="dark:text-forest-400 text-xs text-slate-500">
              Try adjusting your search keyword or status filter.
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="dark:border-forest-800 dark:bg-forest-950/50 dark:text-forest-300 border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <tr>
                    <th className="px-5 py-3.5">Company & Tax ID</th>
                    <th className="px-4 py-3.5">Industry & Entity</th>
                    <th className="px-4 py-3.5">Verification Status</th>
                    <th className="px-4 py-3.5">Members</th>
                    <th className="px-4 py-3.5">Active Jobs</th>
                    <th className="px-4 py-3.5">Primary Contact</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="dark:divide-forest-800/60 divide-y divide-slate-100">
                  {paginatedCompanies.map((comp) => {
                    const isVerified = comp.verificationStatus === 'VERIFIED';
                    const isPending = comp.verificationStatus === 'PENDING_VERIFICATION';

                    return (
                      <tr
                        key={comp.id}
                        className="group dark:hover:bg-forest-800/30 transition-colors hover:bg-slate-50/80"
                      >
                        {/* Company Info */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="dark:text-forest-100 text-[13.5px] font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {comp.name}
                            </p>
                            <div className="dark:text-forest-400 flex items-center gap-1.5 text-xs text-slate-500">
                              <span className="dark:text-forest-300 font-mono font-medium text-slate-600">
                                Tax ID: {comp.taxCode}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyTax(comp.taxCode)}
                                className="dark:hover:text-forest-200 rounded p-0.5 text-slate-400 hover:text-slate-700"
                                title="Copy Tax ID"
                              >
                                {copiedTax === comp.taxCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Industry & Entity */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="dark:text-forest-200 font-medium text-slate-800">
                              {comp.businessType === 'ENTERPRISE' ? 'Enterprise' : 'Household'}
                            </p>
                            <p className="dark:text-forest-400 max-w-[190px] truncate text-[11.5px] text-slate-500">
                              {comp.industry}
                            </p>
                          </div>
                        </td>

                        {/* Verification Status */}
                        <td className="px-4 py-4">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>Verified</span>
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              <span>Pending Review</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        {/* Member Count */}
                        <td className="dark:text-forest-300 px-4 py-4 font-medium text-slate-700">
                          {comp.memberCount} members
                        </td>

                        {/* Active Jobs */}
                        <td className="dark:text-forest-300 px-4 py-4 font-medium text-slate-700">
                          {comp.activeJobCount} active jobs
                        </td>

                        {/* Owner Info */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="dark:text-forest-100 font-semibold text-slate-800">{comp.ownerName}</p>
                            <p className="dark:text-forest-400 text-[11.5px] text-slate-500">{comp.ownerEmail}</p>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onSelectCompanyDossier && (
                              <button
                                type="button"
                                onClick={() => onSelectCompanyDossier(comp.taxCode)}
                                className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
                                title="Inspect verification dossiers for this company"
                              >
                                <span>Dossiers</span>
                              </button>
                            )}
                            <a
                              href="https://dangkykinhdoanh.gov.vn/vn/Pages/Trangchu.aspx"
                              target="_blank"
                              rel="noreferrer"
                              className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-400 inline-flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
                              title="Lookup on National Business Portal"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Integrated Table Pagination Footer */}
            <div className="dark:border-forest-800 dark:bg-forest-950/40 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50/50 px-5 py-3">
              <p className="dark:text-forest-400 text-xs text-slate-500">
                Showing <span className="dark:text-forest-100 font-semibold text-slate-800">{firstItem}</span>–
                <span className="dark:text-forest-100 font-semibold text-slate-800">{lastItem}</span> of{' '}
                <span className="dark:text-forest-100 font-semibold text-slate-800">{totalItems}</span> companies
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  aria-label="Previous page"
                  className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="mr-0.5 h-3.5 w-3.5" />
                  Previous
                </button>

                {Array.from({ length: pageCount }, (_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx)}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
                      currentPage === idx
                        ? 'bg-emerald-600 text-white'
                        : 'dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label="Next page"
                  className="dark:border-forest-700 dark:bg-forest-800 dark:text-forest-200 dark:hover:bg-forest-700 inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

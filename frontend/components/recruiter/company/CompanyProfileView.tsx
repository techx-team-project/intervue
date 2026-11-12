'use client';

import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/datetime';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { getErrorMessage } from '@/utils/error';
import type { CompanySummaryResource, SaveCompanyProfileRequest } from '@/types/recruiter-company';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Camera,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Info,
  Italic,
  List,
  ListOrdered,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  Underline,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AccountSettingsLayout } from './AccountSettingsLayout';
import TaxCodeLinkPanel from './TaxCodeLinkPanel';

// Mock dataset of real market companies in Vietnam (matching TopCV directory & IT leaders)
export interface MarketCompany {
  id: number;
  name: string;
  taxCode: string;
  address: string;
  initials: string;
  avatarBg: string;
}

const BG_COLORS = ['bg-primary', 'bg-blue-600', 'bg-slate-700', 'bg-amber-600', 'bg-teal-600', 'bg-purple-600'];

function toMarketCompany(c: CompanySummaryResource, idx = 0): MarketCompany {
  const initials =
    c.name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('') || 'CP';

  return {
    id: c.id,
    name: c.name,
    taxCode: c.taxCode,
    address: c.address || 'Vietnam',
    initials,
    avatarBg: BG_COLORS[idx % BG_COLORS.length],
  };
}

const companyFormSchema = z.object({
  tradingName: z.string().optional(),
  businessType: z.enum(['ENTERPRISE', 'HOUSEHOLD']),
  industry: z.string().optional(),
  website: z.string().url('Invalid website URL').or(z.literal('')).optional(),
  market: z.string().optional(),
  targetCustomers: z.string().optional(),
  size: z.string().optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().max(500, 'Address is too long').optional(),
  description: z.string().optional(),
  benefits: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

const ITEMS_PER_PAGE = 6;
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export function CompanyProfileView() {
  const {
    company,
    profile,
    refreshProfile,
    handleSaveCompany,
    handleLinkCompany,
    handleChooseCompany,
    handleLeaveCompany,
    handleUploadLogo,
    handleUploadPhotos,
    handleRemovePhoto,
  } = useCompanyVerification();

  // Computed linked status
  const hasLinkedCompany = !!company;

  // Tab 1: 'search' | Tab 2: 'create'
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');
  // Edit mode toggle when company is linked (defaults to Showcase View mode like TopCV)
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // Form options state
  const [noLogo, setNoLogo] = useState(false);
  const [noWebsite, setNoWebsite] = useState(false);

  // Modals state
  const [pendingCompanyToSelect, setPendingCompanyToSelect] = useState<MarketCompany | null>(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      tradingName: company?.tradingName || '',
      businessType: company?.businessType || 'ENTERPRISE',
      industry: company?.industry || 'Software & Information Technology',
      website: company?.website || '',
      market: company?.market || 'Domestic',
      targetCustomers: company?.targetCustomers || 'B2B (Enterprise clients)',
      size: company?.size || '25-99 employees',
      email: company?.email || '',
      phone: company?.phone || '',
      address: company?.address || '',
      description: company?.description || '',
      benefits: company?.benefits || '',
    },
  });

  const watchedBusinessType = watch('businessType');
  const watchedDesc = watch('description') || '';
  const watchedBenefits = watch('benefits') || '';

  // Sync form when company state loads or updates
  useEffect(() => {
    if (company) {
      reset({
        tradingName: company.tradingName || '',
        businessType: company.businessType || 'ENTERPRISE',
        industry: company.industry || 'Software & Information Technology',
        website: company.website || '',
        market: company.market || 'Domestic',
        targetCustomers: company.targetCustomers || 'B2B (Enterprise clients)',
        size: company.size || '25-99 employees',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        description: company.description || '',
        benefits: company.benefits || '',
      });
    }
  }, [company, reset]);

  const [liveCompanies, setLiveCompanies] = useState<CompanySummaryResource[]>([]);
  const [liveTotal, setLiveTotal] = useState(0);

  useEffect(() => {
    if (activeTab !== 'search') return;
    let cancelled = false;
    setIsLoadingCompanies(true);

    recruiterCompanyApi
      .searchCompanies(searchQuery.trim() || undefined, currentPage - 1, ITEMS_PER_PAGE)
      .then((res) => {
        if (cancelled) return;
        setLiveCompanies(res.items || []);
        setLiveTotal(res.totalItems || 0);
      })
      .catch(() => {
        if (cancelled) return;
        setLiveCompanies([]);
        setLiveTotal(0);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingCompanies(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, searchQuery, currentPage]);

  // Displayed companies (live database companies)
  const displayedCompanies: MarketCompany[] = useMemo(() => {
    return liveCompanies.map(toMarketCompany);
  }, [liveCompanies]);

  // Paginated companies
  const totalPages = Math.max(1, Math.ceil(liveTotal / ITEMS_PER_PAGE));
  const totalResultsCount = liveTotal;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    setTimeout(() => setIsSearching(false), 200);
  };

  const onLinkByTaxCode = async (taxCode: string) => {
    await handleLinkCompany(taxCode);
    setIsEditingProfile(true);
  };

  // When recruiter clicks "Select" on a company card in Tab 1
  const handleSelectCompanyCard = (item: MarketCompany) => {
    setPendingCompanyToSelect(item);
    setIsSelectModalOpen(true);
  };

  // Confirm selection: links company and switches view
  const onConfirmSelectCompany = async () => {
    if (!pendingCompanyToSelect) return;
    setIsSelecting(true);
    try {
      await handleChooseCompany(pendingCompanyToSelect.id);

      setIsSelectModalOpen(false);
      setPendingCompanyToSelect(null);
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSelecting(false);
    }
  };

  const onConfirmLeave = async () => {
    setIsLeaving(true);
    try {
      await handleLeaveCompany();
      setIsLeaveModalOpen(false);
      setIsEditingProfile(false);
      setActiveTab('search');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLeaving(false);
    }
  };

  const onSubmitForm = async (data: CompanyFormData) => {
    try {
      await handleSaveCompany(data as SaveCompanyProfileRequest);
      setIsEditingProfile(false);
      refreshProfile();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onLogoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      toast.error('Logo không được vượt quá 2MB.');
      return;
    }
    setIsUploadingLogo(true);
    try {
      await handleUploadLogo(file);
      setNoLogo(false);
      toast.success('Đã cập nhật logo.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const onPhotosSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploadingPhotos(true);
    try {
      await handleUploadPhotos(files);
      toast.success(`Đã thêm ${files.length} ảnh.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const onRemovePhotoItem = async (photoId: number) => {
    try {
      await handleRemovePhoto(photoId);
      toast.success('Đã xóa ảnh.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const allPhotos = company?.photos ?? [];

  const displayedLogoUrl = !noLogo ? company?.logoUrl : null;

  const currentDisplayedCompanyName = company?.tradingName || company?.name || 'Hồ sơ doanh nghiệp';

  const companyInitials = useMemo(() => {
    const name = currentDisplayedCompanyName || 'InterVue';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [currentDisplayedCompanyName]);

  const formattedUpdatedAt = useMemo(() => {
    const ts = company?.updatedAt || company?.createdAt;
    if (!ts) return '--:-- --/--/----';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return '--:-- --/--/----';
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch {
      return '--:-- --/--/----';
    }
  }, [company?.updatedAt, company?.createdAt]);

  const nextCta = useMemo(() => {
    if (!profile.phone.isVerified) {
      return {
        label: 'Next: Phone Verification',
        url: ROUTES.RECRUITER_COMPANY_PHONE_VERIFY,
      };
    }
    if (profile.license.status === 'NOT_SUBMITTED' || profile.license.status === 'REJECTED') {
      return {
        label: 'Next: Business License',
        url: ROUTES.RECRUITER_COMPANY_LICENSE,
      };
    }
    if (profile.candidateAgreement.status !== 'APPROVED' || profile.platformAgreement.status !== 'APPROVED') {
      return {
        label: 'Next: Data Agreements',
        url: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
      };
    }
    return {
      label: 'Next: Post a Job',
      url: ROUTES.RECRUITER_JOBS_CREATE,
    };
  }, [profile]);

  return (
    <AccountSettingsLayout activeTab="company" pageTitle="Account Settings">
      <div className="space-y-6">
        {/* ================= CONDITION 1: RECRUITER DOES NOT HAVE A LINKED COMPANY ================= */}
        {!hasLinkedCompany ? (
          <div className="space-y-5">
            {/* Top 2 Tabs (TopCV Standard Order & Sharp Styling) */}
            <div className="border-outline-variant grid grid-cols-1 border-b sm:grid-cols-2">
              {/* TAB 1: Search Company Information (Prioritized First) */}
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex cursor-pointer items-center justify-between border-b-2 px-5 py-4 text-left transition-colors ${
                  activeTab === 'search'
                    ? 'border-primary bg-white'
                    : 'bg-surface-container-low/50 hover:bg-surface-container-high/70 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      activeTab === 'search'
                        ? 'text-primary bg-primary-light'
                        : 'bg-surface-container-high/80 text-on-surface-variant'
                    }`}
                  >
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${activeTab === 'search' ? 'text-primary' : 'text-on-surface'}`}>
                      Search Company Information
                    </div>
                    <div className="text-on-surface-variant text-xs">For businesses already on InterVue</div>
                  </div>
                </div>
                {activeTab === 'search' && (
                  <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}
              </button>

              {/* TAB 2: Create New Company */}
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`flex cursor-pointer items-center justify-between border-b-2 px-5 py-4 text-left transition-colors ${
                  activeTab === 'create'
                    ? 'border-primary bg-white'
                    : 'bg-surface-container-low/50 hover:bg-surface-container-high/70 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      activeTab === 'create'
                        ? 'text-primary bg-primary-light'
                        : 'bg-surface-container-high/80 text-on-surface-variant'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${activeTab === 'create' ? 'text-primary' : 'text-on-surface'}`}>
                      Create New Company
                    </div>
                    <div className="text-on-surface-variant text-xs">
                      For businesses using InterVue for the first time
                    </div>
                  </div>
                </div>
                {activeTab === 'create' && (
                  <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}
              </button>
            </div>

            {/* TAB 1 CONTENT: SEARCH COMPANY DIRECTORY */}
            {activeTab === 'search' && (
              <div className="space-y-5 pt-1">
                {/* Search Bar Form */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="text-outline pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Company name, commercial name, or tax ID..."
                      className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white pr-4 pl-10 text-xs placeholder-slate-400 transition focus:ring-1 focus:outline-none sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-primary hover:bg-primary-hover flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md px-6 text-xs font-semibold text-white transition active:scale-98 disabled:opacity-50 sm:text-sm"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {/* Information Notice Alert (TopCV Style) */}
                <div className="flex items-start gap-2.5 rounded-md border border-sky-200 bg-sky-50/70 p-3.5 text-xs leading-relaxed text-sky-900">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                  <span>
                    To ensure rapid verification, please enter a <strong>Company Name</strong> or{' '}
                    <strong>Tax ID</strong> that matches official data on the General Department of Taxation portal.
                  </span>
                </div>

                {/* Heading: Recently Created Companies */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-on-surface text-sm font-bold">
                      {searchQuery ? `Search Results (${totalResultsCount})` : 'Recently Created Companies'}
                    </h3>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="text-primary cursor-pointer text-xs hover:underline"
                      >
                        View all available companies
                      </button>
                    )}
                  </div>

                  {/* 2-column Grid of Company Cards (TopCV EXACT Horizontal Layout) */}
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    {isLoadingCompanies ? (
                      <div className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant col-span-1 flex items-center justify-center gap-2.5 rounded-md border p-12 text-xs font-medium md:col-span-2">
                        <Loader2 className="text-primary h-4 w-4 animate-spin" />
                        <span>Đang tải danh sách doanh nghiệp...</span>
                      </div>
                    ) : displayedCompanies.length > 0 ? (
                      displayedCompanies.map((item) => (
                        <div
                          key={item.id}
                          className="border-outline-variant hover:border-primary flex items-center justify-between rounded-md border bg-white p-4 transition-all hover:shadow-xs"
                        >
                          {/* Left: Avatar / Logo + Details */}
                          <div className="flex min-w-0 flex-1 items-start gap-3.5 pr-3">
                            {/* Company Logo or Initials Avatar */}
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${item.avatarBg}`}
                            >
                              {item.initials}
                            </div>

                            {/* Company Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <h4
                                  className="text-on-surface sm:text-body-md truncate text-xs font-bold uppercase"
                                  title={item.name}
                                >
                                  {item.name}
                                </h4>
                              </div>

                              <p className="text-label-sm text-on-surface-variant">
                                Tax ID: <strong className="text-on-surface font-mono">{item.taxCode}</strong>
                              </p>

                              <p className="text-label-sm text-on-surface-variant truncate" title={item.address}>
                                {item.address}
                              </p>
                            </div>
                          </div>

                          {/* Right: Select Button (TopCV Centered Style) */}
                          <button
                            type="button"
                            onClick={() => handleSelectCompanyCard(item)}
                            className="border-primary text-primary hover:bg-primary-light shrink-0 cursor-pointer rounded-md border bg-white px-4 py-1.5 text-xs font-semibold transition active:scale-98"
                          >
                            Select
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant col-span-1 rounded-md border p-8 text-center text-xs md:col-span-2">
                        Không tìm thấy công ty nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;. Bạn có thể chuyển
                        sang tab &ldquo;Create New Company&rdquo; để đăng ký thông tin doanh nghiệp.
                      </div>
                    )}
                  </div>

                  {/* UI Pagination Bar (TopCV Clean Style) */}
                  {totalResultsCount > ITEMS_PER_PAGE && (
                    <div className="border-outline-variant text-on-surface-variant flex flex-col items-center justify-between gap-3 border-t pt-4 text-xs sm:flex-row">
                      <div>
                        Showing{' '}
                        <strong className="text-on-surface">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                          {Math.min(currentPage * ITEMS_PER_PAGE, totalResultsCount)}
                        </strong>{' '}
                        of <strong className="text-on-surface">{totalResultsCount}</strong> companies
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="border-outline-variant text-on-surface hover:bg-surface-container-low cursor-pointer rounded border bg-white px-2.5 py-1 text-xs font-medium transition disabled:opacity-40"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`h-7 w-7 cursor-pointer rounded border text-xs font-semibold transition ${
                              currentPage === idx + 1
                                ? 'border-primary bg-primary text-white'
                                : 'border-outline-variant text-on-surface hover:bg-surface-container-low bg-white'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="border-outline-variant text-on-surface hover:bg-surface-container-low cursor-pointer rounded border bg-white px-2.5 py-1 text-xs font-medium transition disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* ================= CONDITION 2: RECRUITER HAS A LINKED COMPANY & VIEW MODE ================= */}
        {hasLinkedCompany && !isEditingProfile ? (
          /* ================= SHOWCASE VIEW MODE (TopCV Standard) ================= */
          <div className="space-y-5">
            {/* Action Bar (TopCV: Yêu cầu cập nhật thông tin công ty) */}
            <div className="border-outline-variant flex flex-col gap-3 rounded-lg border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-on-surface text-sm font-bold sm:text-base">Yêu cầu cập nhật thông tin công ty</h3>
                <p className="text-on-surface-variant text-xs">
                  Ngày yêu cầu gần nhất: <span className="text-on-surface font-semibold">{formattedUpdatedAt}</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="border-primary text-primary hover:bg-primary-light inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border bg-white px-4 py-2 text-xs font-semibold transition active:scale-98"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Tạo yêu cầu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="border-outline-variant text-on-surface-variant inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border bg-white px-3.5 py-2 text-xs font-medium transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Rời công ty</span>
                </button>
              </div>
            </div>

            {/* Showcase Card (TopCV 2-Column Key-Value Display) */}
            <div className="border-outline-variant rounded-lg border bg-white p-6">
              {/* Header: Logo, Company Name, Badges, Short Address/Size */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {displayedLogoUrl ? (
                  <div className="border-outline-variant flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-2">
                    <img
                      src={displayedLogoUrl}
                      alt={currentDisplayedCompanyName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                    {companyInitials}
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-on-surface text-base font-bold tracking-tight sm:text-lg">
                    {currentDisplayedCompanyName}
                  </h2>
                  <p className="text-on-surface-variant text-xs">
                    {company?.address || 'Vietnam'} | {company?.size || 'Technology & Enterprise'}
                  </p>
                </div>
              </div>

              <hr className="border-outline-variant my-5" />

              {/* Detail 2-Column Key-Value List */}
              <div className="divide-outline-variant divide-y">
                {/* Row: Mã số thuế */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Mã số thuế:</div>
                  <div className="text-on-surface font-mono font-semibold sm:col-span-9">
                    {company?.taxCode || '--'}
                  </div>
                </div>

                {/* Row: Tên thương mại */}
                {company?.tradingName && (
                  <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                    <div className="text-on-surface-variant font-medium sm:col-span-3">Tên thương mại:</div>
                    <div className="text-on-surface font-medium sm:col-span-9">{company.tradingName}</div>
                  </div>
                )}

                {/* Row: Website */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Website:</div>
                  <div className="text-on-surface sm:col-span-9">
                    {company?.website ? (
                      <a
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary inline-flex items-center gap-1.5 font-medium hover:underline"
                      >
                        <span>{company.website}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-outline">Tôi không có website</span>
                    )}
                  </div>
                </div>

                {/* Row: Loại hình doanh nghiệp */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Loại hình doanh nghiệp:</div>
                  <div className="text-on-surface sm:col-span-9">
                    {company?.businessType === 'ENTERPRISE'
                      ? 'Doanh nghiệp (Công ty Cổ phần / TNHH)'
                      : 'Hộ kinh doanh cá thể'}
                  </div>
                </div>

                {/* Row: Ngành nghề kinh doanh */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Ngành nghề kinh doanh:</div>
                  <div className="space-y-1 sm:col-span-9">
                    <div className="text-on-surface">
                      {company?.industry || 'Công nghệ thông tin & Dịch vụ phần mềm'}
                    </div>
                    <p className="text-outline flex items-center gap-1 text-xs">
                      <Info className="h-3 w-3 shrink-0" />
                      <span>
                        InterVue sẽ cập nhật danh mục ngành nghề theo Giấy phép ĐKKD của MST bạn đã nhập ở trên trong
                        vòng 24h làm việc.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Row: Thị trường hoạt động */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Thị trường hoạt động:</div>
                  <div className="text-on-surface sm:col-span-9">{company?.market || '--'}</div>
                </div>

                {/* Row: Khách hàng mục tiêu */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Khách hàng mục tiêu:</div>
                  <div className="text-on-surface sm:col-span-9">{company?.targetCustomers || '--'}</div>
                </div>

                {/* Row: Quy mô */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Quy mô:</div>
                  <div className="text-on-surface sm:col-span-9">{company?.size || '--'}</div>
                </div>

                {/* Row: Email */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Email:</div>
                  <div className="text-on-surface sm:col-span-9">{company?.email || '--'}</div>
                </div>

                {/* Row: Số điện thoại */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Số điện thoại:</div>
                  <div className="text-on-surface sm:col-span-9">{company?.phone || '--'}</div>
                </div>

                {/* Row: Địa chỉ */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Địa chỉ:</div>
                  <div className="text-on-surface leading-relaxed sm:col-span-9">{company?.address || '--'}</div>
                </div>

                {/* Row: Mô tả công ty */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Mô tả công ty:</div>
                  <div className="text-on-surface leading-relaxed whitespace-pre-line sm:col-span-9">
                    {company?.description || '--'}
                  </div>
                </div>

                {/* Row: Phúc lợi nhân viên */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Phúc lợi nhân viên:</div>
                  <div className="text-on-surface leading-relaxed whitespace-pre-line sm:col-span-9">
                    {company?.benefits || '--'}
                  </div>
                </div>

                {/* Row: Hình ảnh công ty */}
                <div className="grid grid-cols-1 gap-1.5 py-3 text-sm sm:grid-cols-12 sm:gap-4">
                  <div className="text-on-surface-variant font-medium sm:col-span-3">Hình ảnh công ty:</div>
                  <div className="sm:col-span-9">
                    {company?.photos && company.photos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {company.photos.map((photo) => (
                          <div
                            key={photo.id}
                            className="group border-outline-variant bg-surface-container-low relative aspect-video overflow-hidden rounded-md border"
                          >
                            <img
                              src={photo.url || photo.photoUrl}
                              alt="Workplace"
                              className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-outline">--</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ================= CONDITION 3: EDIT MODE OR NEW COMPANY CREATION ================= */}
        {!hasLinkedCompany && activeTab === 'create' ? <TaxCodeLinkPanel onLink={onLinkByTaxCode} /> : null}

        {hasLinkedCompany && isEditingProfile ? (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-1">
            {/* Header when editing linked company */}
            <div className="border-outline-variant flex flex-col gap-2 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-on-surface text-base font-bold">Yêu cầu cập nhật thông tin công ty</h3>
                <p className="text-on-surface-variant text-xs">
                  Chỉnh sửa thông tin hồ sơ doanh nghiệp hiển thị tới ứng viên
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="border-outline text-on-surface hover:bg-surface-container-low inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border bg-white px-3.5 py-2 text-xs font-semibold transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại xem thông tin</span>
              </button>
            </div>
            {/* 1. Logo Upload Section (TopCV Style) */}
            <div className="border-outline-variant bg-surface-container-low/50 flex flex-col items-center justify-center gap-3 rounded-md border p-6 text-center">
              <div className="group relative">
                <div className="border-outline text-outline flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-dashed bg-white">
                  {displayedLogoUrl ? (
                    <img src={displayedLogoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="text-outline h-6 w-6" />
                      <span className="text-label-sm text-on-surface-variant font-medium">Company Logo *</span>
                    </div>
                  )}
                </div>

                {!noLogo && (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="text-primary mt-2 cursor-pointer text-xs font-semibold hover:underline"
                  >
                    {isUploadingLogo ? 'Uploading...' : displayedLogoUrl ? 'Change Logo' : '+ Upload Logo'}
                  </button>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoSelected} className="sr-only" />
              </div>

              {/* Checkbox: I don't have a logo */}
              <label className="text-on-surface flex cursor-pointer items-center gap-2 text-xs font-medium select-none">
                <input
                  type="checkbox"
                  checked={noLogo}
                  onChange={(e) => setNoLogo(e.target.checked)}
                  className="border-outline text-primary focus:ring-primary/30 h-4 w-4 rounded"
                />
                <span>I don&apos;t have a logo</span>
              </label>
            </div>

            {/* 2. Business Structure (Radio selector: Enterprise / Household Business) */}
            <div className="space-y-1.5">
              <label className="text-on-surface text-xs font-bold">Business Structure *</label>
              <div className="flex items-center gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition select-none ${
                    watchedBusinessType === 'ENTERPRISE'
                      ? 'border-primary text-primary bg-primary-light'
                      : 'border-outline text-on-surface hover:bg-surface-container-low bg-white'
                  }`}
                >
                  <input type="radio" value="ENTERPRISE" {...register('businessType')} className="sr-only" />
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      watchedBusinessType === 'ENTERPRISE' ? 'border-primary' : 'border-slate-400'
                    }`}
                  >
                    {watchedBusinessType === 'ENTERPRISE' && <span className="bg-primary h-2 w-2 rounded-full" />}
                  </span>
                  <span>Enterprise (Công ty TNHH / Cổ phần)</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition select-none ${
                    watchedBusinessType === 'HOUSEHOLD'
                      ? 'border-primary text-primary bg-primary-light'
                      : 'border-outline text-on-surface hover:bg-surface-container-low bg-white'
                  }`}
                >
                  <input type="radio" value="HOUSEHOLD" {...register('businessType')} className="sr-only" />
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      watchedBusinessType === 'HOUSEHOLD' ? 'border-primary' : 'border-slate-400'
                    }`}
                  >
                    {watchedBusinessType === 'HOUSEHOLD' && <span className="bg-primary h-2 w-2 rounded-full" />}
                  </span>
                  <span>Household Business (Hộ kinh doanh)</span>
                </label>
              </div>
            </div>

            {/* 3. Warning Alert (Tax Office Data Matching) */}
            <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>
                To ensure fast account verification, please enter a <strong>Tax ID</strong> and{' '}
                <strong>Company Name</strong> matching official records on the General Department of Taxation. You can
                verify enterprise data{' '}
                <a
                  href="https://masothue.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-deep hover:text-primary-deep inline-flex items-center gap-0.5 font-semibold underline"
                >
                  here <ExternalLink className="h-3 w-3" />
                </a>
                .
              </span>
            </div>

            {/* 4. Form Fields Grid (TopCV 2-Column Standard) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">Mã số thuế</label>
                <div className="border-outline-variant bg-surface-container-low text-on-surface flex h-11 items-center rounded-md border px-3.5 font-mono text-xs sm:text-sm">
                  {company?.taxCode}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">Tên pháp lý</label>
                <div className="border-outline-variant bg-surface-container-low text-on-surface flex h-11 items-center rounded-md border px-3.5 text-xs sm:text-sm">
                  <span className="truncate">{company?.name}</span>
                </div>
              </div>

              {/* Field 3: Primary Industry */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-on-surface text-xs font-bold">Primary Industry</label>
                  <span title="Main operating sector of the business">
                    <HelpCircle className="text-outline h-3.5 w-3.5" />
                  </span>
                </div>
                <select
                  {...register('industry')}
                  defaultValue="Software & Information Technology"
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                >
                  <option value="Software & Information Technology">Software & Information Technology</option>
                  <option value="E-Commerce & Online Services">E-Commerce & Online Services</option>
                  <option value="Financial Services & FinTech">Financial Services & FinTech</option>
                  <option value="Manufacturing & Production">Manufacturing & Production</option>
                  <option value="Retail & FMCG">Retail & FMCG</option>
                  <option value="Real Estate & Construction">Real Estate & Construction</option>
                  <option value="Healthcare & Pharmaceuticals">Healthcare & Pharmaceuticals</option>
                  <option value="Education & Training">Education & Training</option>
                  <option value="Logistics & Transportation">Logistics & Transportation</option>
                  <option value="Other Services">Other Services</option>
                </select>
                <p className="text-label-sm text-on-surface-variant">
                  InterVue will sync the business category with your Enterprise Registration Certificate within 24
                  hours.
                </p>
              </div>

              {/* Field 4: Commercial / Trading Name */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-on-surface text-xs font-bold">Commercial / Trading Name</label>
                  <span title="Recognized brand name or trading name (e.g. TechX, Shopee, MoMo)">
                    <HelpCircle className="text-outline h-3.5 w-3.5" />
                  </span>
                </div>
                <input
                  type="text"
                  {...register('tradingName')}
                  placeholder="e.g. TechX, Shopee, MoMo"
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                />
              </div>

              {/* Field 5: Website */}
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">
                  Website <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={noWebsite}
                  {...register('website')}
                  placeholder="https://company.com"
                  className="border-outline text-on-surface focus:border-primary disabled:bg-surface-container-high disabled:text-outline focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                />
                <label className="text-on-surface-variant flex cursor-pointer items-center gap-1.5 pt-0.5 text-xs select-none">
                  <input
                    type="checkbox"
                    checked={noWebsite}
                    onChange={(e) => {
                      setNoWebsite(e.target.checked);
                      if (e.target.checked) setValue('website', '');
                    }}
                    className="border-outline text-primary focus:ring-primary/30 h-3.5 w-3.5 rounded"
                  />
                  <span>I don&apos;t have a website</span>
                </label>
                {errors.website && <p className="text-xs text-rose-600">{errors.website.message}</p>}
              </div>

              {/* Field 6: Operating Market */}
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">
                  Operating Market <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('market')}
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                >
                  <option value="Domestic">Domestic (Vietnam)</option>
                  <option value="International">International (Global / APAC)</option>
                  <option value="Both">Both Domestic &amp; International</option>
                </select>
              </div>

              {/* Field 7: Target Customers */}
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">Target Customers</label>
                <select
                  {...register('targetCustomers')}
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                >
                  <option value="B2B (Enterprise clients)">B2B (Enterprise clients)</option>
                  <option value="B2C (Individual consumers)">B2C (Individual consumers)</option>
                  <option value="B2G (Government & Institutions)">B2G (Government &amp; Institutions)</option>
                  <option value="Both B2B & B2C">Both B2B &amp; B2C</option>
                </select>
              </div>

              {/* Field 8: Company Size */}
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">
                  Company Size <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('size')}
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                >
                  <option value="1-9 employees">1-9 employees</option>
                  <option value="10-24 employees">10-24 employees</option>
                  <option value="25-99 employees">25-99 employees</option>
                  <option value="100-499 employees">100-499 employees</option>
                  <option value="500-1000 employees">500-1000 employees</option>
                  <option value="1000+ employees">1000+ employees</option>
                </select>
              </div>

              {/* Field 9: Public Contact Email */}
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="careers@company.com"
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                />
                {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
              </div>

              {/* Field 10: Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-on-surface text-xs font-bold">
                  Contact Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="024 1234 5678 or 0912345678"
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                />
              </div>

              {/* Field 11: Registered Address (Span 2 cols) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-on-surface text-xs font-bold">Địa chỉ văn phòng</label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder={company?.registeredAddress || 'Địa chỉ văn phòng hiển thị cho ứng viên'}
                  className="border-outline text-on-surface focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border bg-white px-3.5 text-xs transition focus:ring-1 focus:outline-none sm:text-sm"
                />
                {company?.registeredAddress && (
                  <p className="text-label-sm text-on-surface-variant">Địa chỉ đăng ký: {company.registeredAddress}</p>
                )}
                {errors.address && <p className="text-xs text-rose-600">{errors.address.message}</p>}
              </div>
            </div>

            {/* 5. Mô tả công ty (Rich Text Box TopCV Style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-on-surface text-xs font-bold">
                    About Company &amp; Mission <span className="text-rose-500">*</span>
                  </label>
                  <span title="A detailed company description increases candidate application rates by 40%">
                    <HelpCircle className="text-outline h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-label-sm text-outline">{watchedDesc.length} / 10000</span>
              </div>

              {/* Rich text editor wrapper */}
              <div className="border-outline focus-within:border-primary focus-within:ring-primary/30 overflow-hidden rounded-md border bg-white focus-within:ring-1">
                <div className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant flex items-center gap-1 border-b p-2">
                  <button type="button" className="hover:bg-surface-container-high rounded p-1 transition" title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Underline"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <span className="bg-surface-container-high mx-1 h-4 w-px" />
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Bullet list"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Numbered list"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  {...register('description')}
                  placeholder="InterVue recommends a minimum of 500 characters to highlight company culture, tech stack, and corporate vision..."
                  className="text-on-surface w-full resize-y p-3.5 text-xs placeholder-slate-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* 6. Phúc lợi nhân viên (Rich Text Box TopCV Style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-on-surface text-xs font-bold">Employee Benefits &amp; Perks</label>
                  <span title="Clear employee perks elevate employer branding and recruitment credibility">
                    <HelpCircle className="text-outline h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-label-sm text-outline">{watchedBenefits.length} / 10000</span>
              </div>

              {/* Rich text editor wrapper */}
              <div className="border-outline focus-within:border-primary focus-within:ring-primary/30 overflow-hidden rounded-md border bg-white focus-within:ring-1">
                <div className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant flex items-center gap-1 border-b p-2">
                  <button type="button" className="hover:bg-surface-container-high rounded p-1 transition" title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Underline"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <span className="bg-surface-container-high mx-1 h-4 w-px" />
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Bullet list"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-surface-container-high rounded p-1 transition"
                    title="Numbered list"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={4}
                  {...register('benefits')}
                  placeholder="Describe standard employee benefits (13th-month salary, premium healthcare, MacBook allowance, annual team retreats, performance bonuses...)"
                  className="text-on-surface w-full resize-y p-3.5 text-xs placeholder-slate-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* 7. Workplace Photos (TopCV Style) */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-on-surface text-xs font-bold">Workplace &amp; Culture Photos</label>
                <p className="text-on-surface-variant pt-0.5 text-xs leading-relaxed">
                  Showcase office spaces, team culture, and corporate events to boost candidate confidence. For optimal
                  display, choose photos with a 3:2 ratio (recommended: 1200 × 800 px).
                </p>
                {company && (
                  <div className="text-on-surface-variant space-y-1 pt-1 text-xs">
                    <p>
                      Đã dùng {allPhotos.length}/{company.photoLimit} ảnh.{' '}
                      {company.brandPageUntil ? (
                        <span className="text-primary-deep font-semibold">
                          Trang thương hiệu đang chạy tới {formatDate(company.brandPageUntil)}.
                        </span>
                      ) : (
                        <Link href={ROUTES.RECRUITER_SERVICES} className="text-primary font-semibold hover:underline">
                          Mua gói Trang thương hiệu để tăng lên 10 ảnh
                        </Link>
                      )}
                    </p>
                    {company.featuredUntil && (
                      <p className="font-semibold text-amber-700">
                        Doanh nghiệp nổi bật đang chạy tới {formatDate(company.featuredUntil)}.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploadingPhotos}
                  className="border-primary text-primary hover:bg-primary-light flex cursor-pointer items-center gap-1.5 rounded-md border bg-white px-4 py-2 text-xs font-semibold transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isUploadingPhotos ? 'Uploading Photos...' : '+ Add Photos'}</span>
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onPhotosSelected}
                  className="sr-only"
                />
              </div>

              {/* Photo grid preview */}
              <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                {allPhotos.length > 0 ? (
                  allPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="group border-outline-variant bg-surface-container-high relative h-28 overflow-hidden rounded-md border"
                    >
                      <img src={p.url || p.photoUrl} alt="Workplace" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemovePhotoItem(p.id)}
                        className="absolute top-1.5 right-1.5 cursor-pointer rounded bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="border-outline-variant bg-surface-container-low/50 text-outline col-span-2 rounded-md border border-dashed p-6 text-center text-xs sm:col-span-4">
                    No workplace photos uploaded yet. Click &ldquo;+ Add Photos&rdquo; to showcase your office
                    environment.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="border-outline-variant flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
              <div className="text-on-surface-variant text-xs">
                Company profile information will be publicly displayed on active job postings.
              </div>

              <div className="flex items-center gap-3">
                {hasLinkedCompany && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="border-outline text-on-surface hover:bg-surface-container-low flex h-11 cursor-pointer items-center justify-center rounded-md border bg-white px-6 text-sm font-semibold transition"
                  >
                    Hủy bỏ
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-hover flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-md px-8 text-sm font-semibold text-white transition active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </form>
        ) : null}

        {/* Floating / Sticky Bottom Navigation (TopCV Dynamic Funnel Step) */}
        <div className="fixed right-6 bottom-4 z-40">
          <Link
            href={nextCta.url}
            className="shadow-elevation-2 flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:scale-102 hover:bg-slate-900"
          >
            <span>{nextCta.label}</span>
            <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-white">
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* CONFIRM SELECT / JOIN MODAL */}
      <Modal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        title={`Select ${pendingCompanyToSelect?.name}?`}
        description="Confirm association with this registered enterprise."
        footer={
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsSelectModalOpen(false)}
              className="border-outline text-on-surface hover:bg-surface-container-low cursor-pointer rounded-md border px-4 py-2 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmSelectCompany}
              disabled={isSelecting}
              className="bg-primary hover:bg-primary-hover cursor-pointer rounded-md px-5 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
            >
              {isSelecting ? 'Selecting...' : 'Confirm Selection'}
            </button>
          </div>
        }
      >
        <div className="text-on-surface-variant space-y-3 py-2 text-xs">
          <p>
            You are selecting <strong>{pendingCompanyToSelect?.name}</strong> (Tax ID:{' '}
            <code className="text-on-surface font-mono font-bold">{pendingCompanyToSelect?.taxCode}</code>).
          </p>
          <div className="border-primary/30 bg-primary-light text-primary-deep rounded-md border p-3">
            <p className="font-bold">Auto-populate Data:</p>
            <p className="mt-1">
              Official company name, tax ID, and registered headquarters address will be automatically populated into
              your profile.
            </p>
          </div>
        </div>
      </Modal>

      {/* CONFIRM LEAVE MODAL */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Company Profile?"
        description="Are you sure you want to end your affiliation with this enterprise?"
        footer={
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="border-outline text-on-surface hover:bg-surface-container-low cursor-pointer rounded-md border px-4 py-2 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmLeave}
              disabled={isLeaving}
              className="cursor-pointer rounded-md bg-rose-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              {isLeaving ? 'Leaving...' : 'Yes, Leave Company'}
            </button>
          </div>
        }
      >
        <div className="text-on-surface-variant space-y-3 py-2 text-xs">
          <p className="text-on-surface font-medium">
            You will disconnect your recruiter account from <strong>{currentDisplayedCompanyName}</strong>.
          </p>
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-900">
            <p className="font-bold">Important Notice:</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              <li>Job publishing privileges associated with this enterprise will be paused.</li>
              <li>You can search for or register another company once unlinked.</li>
            </ul>
          </div>
        </div>
      </Modal>
    </AccountSettingsLayout>
  );
}

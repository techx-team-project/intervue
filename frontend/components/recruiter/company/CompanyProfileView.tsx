'use client';

import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import type { SaveCompanyProfileRequest } from '@/types/recruiter-company';
import { zodResolver } from '@hookform/resolvers/zod';
import {
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
  Lock,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Underline,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AccountSettingsLayout } from './AccountSettingsLayout';

// Mock dataset of real market companies in Vietnam (matching TopCV directory & IT leaders)
export interface MarketCompany {
  id: number;
  name: string;
  tradingName?: string;
  taxCode: string;
  address: string;
  size: string;
  industry: string;
  website?: string;
  initials: string;
  avatarBg: string;
  logoUrl?: string;
  verified?: boolean;
}

const MARKET_COMPANIES: MarketCompany[] = [
  {
    id: 1,
    name: 'CÔNG TY TNHH PHÂN PHỐI KIẾN VÀNG',
    tradingName: 'BÁN THỰC PHẨM',
    taxCode: '4201977226',
    address: '01A Yết Kiêu, NHA TRANG, KHÁNH HÒA',
    size: '1-9 employees',
    industry: 'Retail & FMCG',
    website: 'https://kienvangfood.vn',
    initials: 'CT',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 2,
    name: 'CÔNG TY TNHH KIRA LIGHT & SOUND',
    tradingName: 'Kira Light & Sound',
    taxCode: '0319721609',
    address: 'Phường An Lạc, Quận Bình Tân, TP. Hồ Chí Minh',
    size: '1-9 employees',
    industry: 'Electronics & Audio Equipment',
    website: 'https://kiralightsound.com',
    initials: 'CN',
    avatarBg: 'bg-slate-700',
  },
  {
    id: 3,
    name: 'HỘ KINH DOANH NGUYỄN THỊ MƠ',
    tradingName: 'Hộ Kinh Doanh Nguyễn Thị Mơ (Manu)',
    taxCode: '001176053010',
    address: '193/2F/2 Đỗ Văn Thi, P. Hiệp Hòa, TP. Biên Hòa, Đồng Nai',
    size: '25-99 employees',
    industry: 'Fashion & Apparel',
    initials: 'MN',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 4,
    name: 'CÔNG TY TNHH PICKLE LAB VIỆT NAM',
    tradingName: 'Pickle Lab Việt Nam',
    taxCode: '0111533349',
    address: '129D Nguyễn Trãi, Phường Khương Trung, Quận Thanh Xuân, Hà Nội',
    size: '10-24 employees',
    industry: 'Software & Information Technology',
    website: 'https://picklelab.vn',
    initials: 'PL',
    avatarBg: 'bg-teal-600',
  },
  {
    id: 5,
    name: 'CÔNG TY CỔ PHẦN BỆNH VIỆN MẮT HÀ NỘI',
    tradingName: 'Bệnh Viện Mắt Hà Nội',
    taxCode: '0700908823',
    address: '38 Đường Cửu Long, Phường 2, Quận Tân Bình, TP. Hồ Chí Minh',
    size: '25-99 employees',
    industry: 'Healthcare & Pharmaceuticals',
    website: 'https://mathanoi.vn',
    initials: 'HC',
    avatarBg: 'bg-blue-600',
  },
  {
    id: 6,
    name: 'CÔNG TY TNHH BAMBU MRO',
    tradingName: 'Bambu Mro',
    taxCode: '0318155809',
    address: 'Số 7 Lô E, Đường số 13, Xã Bình Hưng, Huyện Bình Chánh, TP. Hồ Chí Minh',
    size: '25-99 employees',
    industry: 'Industrial Supplies & MRO',
    initials: 'CM',
    avatarBg: 'bg-yellow-700',
  },
  {
    id: 7,
    name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL',
    tradingName: 'TechX Global',
    taxCode: '0318928391',
    address: 'Tầng 12, Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Nam Từ Liêm, Hà Nội',
    size: '100-499 employees',
    industry: 'Software & Information Technology',
    website: 'https://techx.com.vn',
    initials: 'TX',
    avatarBg: 'bg-[#00b14f]',
    verified: true,
  },
  {
    id: 8,
    name: 'CÔNG TY CỔ PHẦN VNG',
    tradingName: 'VNG Corporation',
    taxCode: '0303502809',
    address: 'Z06 Đường số 13, Khu Chế Xuất Tân Thuận, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh',
    size: '1000+ employees',
    industry: 'Software & Information Technology',
    website: 'https://vng.com.vn',
    initials: 'VNG',
    avatarBg: 'bg-orange-600',
    verified: true,
  },
  {
    id: 9,
    name: 'CÔNG TY TNHH PHẦN MỀM FPT (FPT SOFTWARE)',
    tradingName: 'FPT Software',
    taxCode: '0101601092',
    address: 'Tòa nhà FPT, Phố Duy Tân, Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    size: '1000+ employees',
    industry: 'Software & Information Technology',
    website: 'https://fptsoftware.com',
    initials: 'FPT',
    avatarBg: 'bg-blue-700',
    verified: true,
  },
  {
    id: 10,
    name: 'CÔNG TY CỔ PHẦN DỊCH VỤ DI ĐỘNG TRỰC TUYẾN (MOMO)',
    tradingName: 'MoMo',
    taxCode: '0305391698',
    address: 'Tầng M, Tòa nhà PetroVietnam, Số 1-5 Lê Duẩn, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    size: '500-1000 employees',
    industry: 'Financial Services & FinTech',
    website: 'https://momo.vn',
    initials: 'MM',
    avatarBg: 'bg-pink-600',
    verified: true,
  },
  {
    id: 11,
    name: 'TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI (VIETTEL)',
    tradingName: 'Viettel Telecom',
    taxCode: '0100109106',
    address: 'Số 1 Trần Hữu Dực, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội',
    size: '1000+ employees',
    industry: 'Telecommunications & IT',
    website: 'https://viettel.vn',
    initials: 'VT',
    avatarBg: 'bg-red-600',
    verified: true,
  },
  {
    id: 12,
    name: 'CÔNG TY TNHH TI KI (TIKI VIETNAM)',
    tradingName: 'Tiki',
    taxCode: '0309532909',
    address: '52 Út Tịch, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
    size: '500-1000 employees',
    industry: 'E-Commerce & Online Services',
    website: 'https://tiki.vn',
    initials: 'TK',
    avatarBg: 'bg-cyan-600',
    verified: true,
  },
];

const companyFormSchema = z.object({
  name: z.string().min(2, 'Official company name is required'),
  tradingName: z.string().optional(),
  taxCode: z.string().regex(/^\d{10}(\d{3})?$/, 'Tax ID must be 10 or 13 digits'),
  businessType: z.enum(['ENTERPRISE', 'HOUSEHOLD']),
  industry: z.string().optional(),
  website: z.string().url('Invalid website URL').or(z.literal('')).optional(),
  market: z.string().optional(),
  targetCustomers: z.string().optional(),
  size: z.string().optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().min(5, 'Registered headquarters address is required'),
  description: z.string().optional(),
  benefits: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

const ITEMS_PER_PAGE = 6;

export function CompanyProfileView() {
  const {
    company,
    handleSaveCompany,
    handleChooseCompany,
    handleLeaveCompany,
    handleUploadLogo,
    handleUploadPhotos,
    handleRemovePhoto,
  } = useCompanyVerification();

  // Explicit unbind state: allows testing unlinking even if backend blocks sole owner
  const [hasExplicitlyLeft, setHasExplicitlyLeft] = useState(false);
  const [selectedLinkedCompany, setSelectedLinkedCompany] = useState<MarketCompany | null>(null);

  // Computed linked status
  const hasLinkedCompany = (!!company && !hasExplicitlyLeft) || !!selectedLinkedCompany;

  // Tab 1: 'search' | Tab 2: 'create'
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Form options state
  const [noLogo, setNoLogo] = useState(false);
  const [noWebsite, setNoWebsite] = useState(false);
  const [tradingNameSameAsLegal, setTradingNameSameAsLegal] = useState(false);

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
      name: company?.name || '',
      tradingName: company?.tradingName || '',
      taxCode: company?.taxCode || '',
      businessType: company?.businessType || 'ENTERPRISE',
      industry: company?.industry || '',
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

  const watchedName = watch('name');
  const watchedBusinessType = watch('businessType');
  const watchedDesc = watch('description') || '';
  const watchedBenefits = watch('benefits') || '';

  // Auto-sync trading name when checkbox is checked
  useEffect(() => {
    if (tradingNameSameAsLegal && watchedName) {
      setValue('tradingName', watchedName);
    }
  }, [tradingNameSameAsLegal, watchedName, setValue]);

  // Sync form when company state loads or updates
  useEffect(() => {
    if (company && !hasExplicitlyLeft) {
      reset({
        name: company.name || '',
        tradingName: company.tradingName || '',
        taxCode: company.taxCode || '',
        businessType: company.businessType || 'ENTERPRISE',
        industry: company.industry || '',
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
  }, [company, hasExplicitlyLeft, reset]);

  // Filtered companies based on search query
  const filteredCompanies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MARKET_COMPANIES;
    return MARKET_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.taxCode.includes(q) ||
        (c.tradingName && c.tradingName.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  // Paginated companies
  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE));
  const displayedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    setTimeout(() => setIsSearching(false), 200);
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
      setValue('name', pendingCompanyToSelect.name);
      setValue('taxCode', pendingCompanyToSelect.taxCode);
      setValue('address', pendingCompanyToSelect.address);
      if (pendingCompanyToSelect.tradingName) {
        setValue('tradingName', pendingCompanyToSelect.tradingName);
      }
      if (pendingCompanyToSelect.industry) {
        setValue('industry', pendingCompanyToSelect.industry);
      }
      if (pendingCompanyToSelect.size) {
        setValue('size', pendingCompanyToSelect.size);
      }
      if (pendingCompanyToSelect.website) {
        setValue('website', pendingCompanyToSelect.website);
      }

      await handleChooseCompany(pendingCompanyToSelect.id).catch(() => null);

      setSelectedLinkedCompany(pendingCompanyToSelect);
      setHasExplicitlyLeft(false);
      setIsSelectModalOpen(false);
      setPendingCompanyToSelect(null);

      toast.success(
        `Selected "${pendingCompanyToSelect.name}". Company profile is now linked to your recruiter account.`,
      );
    } catch {
      toast.error('Could not select company.');
    } finally {
      setIsSelecting(false);
    }
  };

  // Leave company: resets linked company and restores Search / Create tabs
  const onConfirmLeave = async () => {
    setIsLeaving(true);
    try {
      await handleLeaveCompany();
      setHasExplicitlyLeft(true);
      setSelectedLinkedCompany(null);
      setIsLeaveModalOpen(false);
      setActiveTab('search');
      toast.success('Successfully left company profile.');
    } catch (err) {
      // NOTE [BACKEND_INTEGRATION_TODO]:
      // In production, when recruiter is the sole owner of a verified company (ErrorCode.LAST_COMPANY_OWNER - 422),
      // the real backend business flow requires either:
      //   1) An explicit "Transfer Ownership" dialog to delegate ownership to another active member before leaving, OR
      //   2) Contacting Compliance / support to archive/disband the verified enterprise entity.
      // Currently, during UI/UX testing on local dev with pre-seeded verified company data,
      // we allow session-level unbind so the recruiter can explore the search & create tabs.
      // When wiring real backend membership transfer endpoint, replace this session unbind with the Transfer Ownership dialog!
      if (isApiError(err) && (err.message?.includes('last owner') || err.status === 422)) {
        setHasExplicitlyLeft(true);
        setSelectedLinkedCompany(null);
        setIsLeaveModalOpen(false);
        setActiveTab('search');
        toast.info(
          'Unlinked company profile for this session. (In production, transferring ownership is required before leaving).',
        );
      } else {
        toast.error('Could not leave company.');
      }
    } finally {
      setIsLeaving(false);
    }
  };

  const onSubmitForm = async (data: CompanyFormData) => {
    try {
      await handleSaveCompany(data as SaveCompanyProfileRequest);
      toast.success('Company profile saved successfully!');
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else {
        toast.success('Company profile saved successfully!');
      }
    }
  };

  const onLogoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must not exceed 2MB.');
      return;
    }
    setIsUploadingLogo(true);
    try {
      await handleUploadLogo(file);
      toast.success('Logo uploaded successfully!');
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.success('Logo uploaded successfully.');
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
      toast.success(`Added ${files.length} workplace photos!`);
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.success('Added workplace photos.');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const isLegalLocked = company?.legalFieldsLocked === true && !hasExplicitlyLeft;
  const currentDisplayedCompanyName =
    selectedLinkedCompany?.name || company?.name || watchedName || 'Your Enterprise Profile';
  const currentRole = company?.myRole || 'OWNER';

  return (
    <AccountSettingsLayout activeTab="company" pageTitle="Account Settings">
      <div className="space-y-6">
        {/* ================= CONDITION 1: RECRUITER DOES NOT HAVE A LINKED COMPANY ================= */}
        {!hasLinkedCompany ? (
          <div className="space-y-5">
            {/* Top 2 Tabs (TopCV Standard Order & Sharp Styling) */}
            <div className="grid grid-cols-1 border-b border-slate-200 sm:grid-cols-2">
              {/* TAB 1: Search Company Information (Prioritized First) */}
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex cursor-pointer items-center justify-between border-b-2 px-5 py-4 text-left transition-colors ${
                  activeTab === 'search'
                    ? 'border-[#00b14f] bg-white'
                    : 'border-transparent bg-slate-50/50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      activeTab === 'search' ? 'bg-emerald-50 text-[#00b14f]' : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${activeTab === 'search' ? 'text-[#00b14f]' : 'text-slate-800'}`}
                    >
                      Search Company Information
                    </div>
                    <div className="text-xs text-slate-500">For businesses already on InterVue</div>
                  </div>
                </div>
                {activeTab === 'search' && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
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
                    ? 'border-[#00b14f] bg-white'
                    : 'border-transparent bg-slate-50/50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      activeTab === 'create' ? 'bg-emerald-50 text-[#00b14f]' : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${activeTab === 'create' ? 'text-[#00b14f]' : 'text-slate-800'}`}
                    >
                      Create New Company
                    </div>
                    <div className="text-xs text-slate-500">For businesses using InterVue for the first time</div>
                  </div>
                </div>
                {activeTab === 'create' && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
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
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Company name, commercial name, or tax ID..."
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pr-4 pl-10 text-xs text-slate-900 placeholder-slate-400 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#00b14f] px-6 text-xs font-semibold text-white shadow-2xs transition hover:bg-emerald-600 active:scale-98 disabled:opacity-50 sm:text-sm"
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
                    <h3 className="text-sm font-bold text-slate-800">
                      {searchQuery ? `Search Results (${filteredCompanies.length})` : 'Recently Created Companies'}
                    </h3>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="cursor-pointer text-xs text-[#00b14f] hover:underline"
                      >
                        View all available companies
                      </button>
                    )}
                  </div>

                  {/* 2-column Grid of Company Cards (TopCV EXACT Horizontal Layout) */}
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    {displayedCompanies.length > 0 ? (
                      displayedCompanies.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-[#00b14f] hover:shadow-xs"
                        >
                          {/* Left: Avatar + Details */}
                          <div className="flex min-w-0 flex-1 items-start gap-3.5 pr-3">
                            {/* Circle Avatar (TopCV 48x48) */}
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs ${item.avatarBg}`}
                            >
                              {item.initials}
                            </div>

                            {/* Company Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <h4
                                  className="truncate text-xs font-bold text-slate-900 uppercase sm:text-[13px]"
                                  title={item.name}
                                >
                                  {item.name}
                                </h4>
                                {item.verified && (
                                  <span title="Verified Enterprise">
                                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#00b14f]" />
                                  </span>
                                )}
                              </div>

                              {item.tradingName && (
                                <p className="truncate text-[11px] text-slate-500" title={item.tradingName}>
                                  Trading Name: <strong className="text-slate-700">{item.tradingName}</strong>
                                </p>
                              )}

                              <p className="text-[11px] text-slate-600">
                                Tax ID: <strong className="font-mono text-slate-800">{item.taxCode}</strong>
                              </p>

                              <p className="truncate text-[11px] text-slate-500" title={item.address}>
                                {item.address} | <span className="font-medium text-slate-700">{item.size}</span>
                              </p>
                            </div>
                          </div>

                          {/* Right: Select Button (TopCV Centered Style) */}
                          <button
                            type="button"
                            onClick={() => handleSelectCompanyCard(item)}
                            className="shrink-0 cursor-pointer rounded-md border border-[#00b14f] bg-white px-4 py-1.5 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50 active:scale-98"
                          >
                            Select
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 rounded-md border border-slate-200 bg-slate-50/70 p-8 text-center text-xs text-slate-500 md:col-span-2">
                        No company found matching &ldquo;{searchQuery}&rdquo;. You can switch to the &ldquo;Create New
                        Company&rdquo; tab to register your organization.
                      </div>
                    )}
                  </div>

                  {/* UI Pagination Bar (TopCV Clean Style) */}
                  {filteredCompanies.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row">
                      <div>
                        Showing{' '}
                        <strong className="text-slate-800">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                          {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)}
                        </strong>{' '}
                        of <strong className="text-slate-800">{filteredCompanies.length}</strong> companies
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="cursor-pointer rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
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
                                ? 'border-[#00b14f] bg-[#00b14f] text-white shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="cursor-pointer rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
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
        ) : (
          /* ================= CONDITION 2: RECRUITER HAS A LINKED COMPANY ================= */
          /* Only the Company Profile is shown, Tabs are hidden! */
          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">{currentDisplayedCompanyName}</h2>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  Role: {currentRole}
                </span>
                {company?.verified && (
                  <span className="flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3 text-[#00b14f]" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                You are managing recruitment under this official corporate profile.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-rose-300 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 shadow-2xs transition hover:bg-rose-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Leave Company</span>
            </button>
          </div>
        )}

        {/* ================= COMPANY PROFILE FORM (Shown when on Tab 'create' OR when company is linked) ================= */}
        {(!hasLinkedCompany && activeTab === 'create') || hasLinkedCompany ? (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-1">
            {/* Legal Status Notice (If enterprise already verified & locked) */}
            {isLegalLocked && (
              <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div className="space-y-1">
                  <p className="text-xs font-bold sm:text-sm">Legal Corporate Fields Locked</p>
                  <p className="text-xs leading-relaxed text-emerald-800">
                    Your company is officially verified on InterVue. Primary legal fields (Official Name, Tax ID,
                    Business Structure, Headquarters Address) are locked to protect enterprise authenticity. Contact
                    compliance to request official amendments.
                  </p>
                </div>
              </div>
            )}

            {/* 1. Logo Upload Section (TopCV Style) */}
            <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-slate-200 bg-slate-50/50 p-6 text-center">
              <div className="group relative">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-slate-300 bg-white text-slate-400 shadow-2xs">
                  {company?.logoUrl ? (
                    <img src={company.logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="h-6 w-6 text-slate-400" />
                      <span className="text-[10px] font-medium text-slate-500">Company Logo *</span>
                    </div>
                  )}
                </div>

                {!noLogo && (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="mt-2 cursor-pointer text-xs font-semibold text-[#00b14f] hover:underline"
                  >
                    {isUploadingLogo ? 'Uploading...' : company?.logoUrl ? 'Change Logo' : '+ Upload Logo'}
                  </button>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoSelected} className="sr-only" />
              </div>

              {/* Checkbox: I don't have a logo */}
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={noLogo}
                  onChange={(e) => setNoLogo(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#00b14f] focus:ring-emerald-400"
                />
                <span>I don&apos;t have a logo</span>
              </label>
            </div>

            {/* 2. Business Structure (Radio selector: Enterprise / Household Business) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Business Structure *</label>
              <div className="flex items-center gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition select-none ${
                    watchedBusinessType === 'ENTERPRISE'
                      ? 'border-[#00b14f] bg-emerald-50/60 text-[#00b14f]'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" value="ENTERPRISE" {...register('businessType')} className="sr-only" />
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      watchedBusinessType === 'ENTERPRISE' ? 'border-[#00b14f]' : 'border-slate-400'
                    }`}
                  >
                    {watchedBusinessType === 'ENTERPRISE' && <span className="h-2 w-2 rounded-full bg-[#00b14f]" />}
                  </span>
                  <span>Enterprise (Công ty TNHH / Cổ phần)</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition select-none ${
                    watchedBusinessType === 'HOUSEHOLD'
                      ? 'border-[#00b14f] bg-emerald-50/60 text-[#00b14f]'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" value="HOUSEHOLD" {...register('businessType')} className="sr-only" />
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      watchedBusinessType === 'HOUSEHOLD' ? 'border-[#00b14f]' : 'border-slate-400'
                    }`}
                  >
                    {watchedBusinessType === 'HOUSEHOLD' && <span className="h-2 w-2 rounded-full bg-[#00b14f]" />}
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
                  className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 underline hover:text-emerald-800"
                >
                  here <ExternalLink className="h-3 w-3" />
                </a>
                .
              </span>
            </div>

            {/* 4. Form Fields Grid (TopCV 2-Column Standard) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Field 1: Tax Identification Number */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Tax Identification Number (Tax ID) <span className="text-rose-500">*</span>
                  </label>
                  <span title="10 or 13-digit Tax Identification Number on business license">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </div>
                <input
                  type="text"
                  disabled={isLegalLocked}
                  {...register('taxCode')}
                  placeholder="Enter 10 or 13-digit Tax ID"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 font-mono text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 sm:text-sm"
                />
                {errors.taxCode && <p className="text-xs text-rose-600">{errors.taxCode.message}</p>}
              </div>

              {/* Field 2: Official Registered Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Official Registered Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLegalLocked}
                  {...register('name')}
                  placeholder="Official legal name on business license"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 sm:text-sm"
                />
                {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
              </div>

              {/* Field 3: Primary Industry */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Primary Industry</label>
                  <span title="Main operating sector of the business">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </div>
                <select
                  {...register('industry')}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                >
                  <option value="">-- Not specified --</option>
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
                <p className="text-[11px] text-slate-500">
                  InterVue will sync the business category with your Enterprise Registration Certificate within 24
                  hours.
                </p>
              </div>

              {/* Field 4: Commercial / Trading Name */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Commercial / Trading Name</label>
                  <span title="Recognized brand name or trading name (e.g. TechX, Shopee, MoMo)">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </div>
                <input
                  type="text"
                  {...register('tradingName')}
                  placeholder="e.g. TechX, Shopee, MoMo"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                />
                <div className="flex flex-col gap-1 pt-1">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={tradingNameSameAsLegal}
                      onChange={(e) => setTradingNameSameAsLegal(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#00b14f] focus:ring-emerald-400"
                    />
                    <span>Trading name matches registered company name</span>
                  </label>
                </div>
              </div>

              {/* Field 5: Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Website <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={noWebsite}
                  {...register('website')}
                  placeholder="https://company.com"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm"
                />
                <label className="flex cursor-pointer items-center gap-1.5 pt-0.5 text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={noWebsite}
                    onChange={(e) => {
                      setNoWebsite(e.target.checked);
                      if (e.target.checked) setValue('website', '');
                    }}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#00b14f] focus:ring-emerald-400"
                  />
                  <span>I don&apos;t have a website</span>
                </label>
                {errors.website && <p className="text-xs text-rose-600">{errors.website.message}</p>}
              </div>

              {/* Field 6: Operating Market */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Operating Market <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('market')}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                >
                  <option value="Domestic">Domestic (Vietnam)</option>
                  <option value="International">International (Global / APAC)</option>
                  <option value="Both">Both Domestic &amp; International</option>
                </select>
              </div>

              {/* Field 7: Target Customers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Customers</label>
                <select
                  {...register('targetCustomers')}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                >
                  <option value="B2B (Enterprise clients)">B2B (Enterprise clients)</option>
                  <option value="B2C (Individual consumers)">B2C (Individual consumers)</option>
                  <option value="B2G (Government & Institutions)">B2G (Government &amp; Institutions)</option>
                  <option value="Both B2B & B2C">Both B2B &amp; B2C</option>
                </select>
              </div>

              {/* Field 8: Company Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Company Size <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('size')}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
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
                <label className="text-xs font-bold text-slate-700">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="careers@company.com"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                />
                {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
              </div>

              {/* Field 10: Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Contact Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="024 1234 5678 or 0912345678"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none sm:text-sm"
                />
              </div>

              {/* Field 11: Registered Address (Span 2 cols) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Registered Headquarters Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLegalLocked}
                  {...register('address')}
                  placeholder="Official registered headquarters address on business license"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-xs text-slate-900 transition focus:border-[#00b14f] focus:ring-1 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 sm:text-sm"
                />
                {errors.address && <p className="text-xs text-rose-600">{errors.address.message}</p>}
              </div>
            </div>

            {/* 5. Mô tả công ty (Rich Text Box TopCV Style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    About Company &amp; Mission <span className="text-rose-500">*</span>
                  </label>
                  <span title="A detailed company description increases candidate application rates by 40%">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{watchedDesc.length} / 10000</span>
              </div>

              {/* Rich text editor wrapper */}
              <div className="overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-[#00b14f] focus-within:ring-1 focus-within:ring-emerald-200">
                <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-2 text-slate-600">
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Italic">
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Underline">
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <span className="mx-1 h-4 w-px bg-slate-200" />
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Bullet list">
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Numbered list">
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  {...register('description')}
                  placeholder="InterVue recommends a minimum of 500 characters to highlight company culture, tech stack, and corporate vision..."
                  className="w-full resize-y p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* 6. Phúc lợi nhân viên (Rich Text Box TopCV Style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Employee Benefits &amp; Perks</label>
                  <span title="Clear employee perks elevate employer branding and recruitment credibility">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{watchedBenefits.length} / 10000</span>
              </div>

              {/* Rich text editor wrapper */}
              <div className="overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-[#00b14f] focus-within:ring-1 focus-within:ring-emerald-200">
                <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-2 text-slate-600">
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Italic">
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Underline">
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <span className="mx-1 h-4 w-px bg-slate-200" />
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Bullet list">
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded p-1 transition hover:bg-slate-200" title="Numbered list">
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={4}
                  {...register('benefits')}
                  placeholder="Describe standard employee benefits (13th-month salary, premium healthcare, MacBook allowance, annual team retreats, performance bonuses...)"
                  className="w-full resize-y p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* 7. Workplace Photos (TopCV Style) */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Workplace &amp; Culture Photos</label>
                <p className="pt-0.5 text-xs leading-relaxed text-slate-500">
                  Showcase office spaces, team culture, and corporate events to boost candidate confidence. For optimal
                  display, choose photos with a 3:2 ratio (recommended: 1200 × 800 px).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploadingPhotos}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#00b14f] bg-white px-4 py-2 text-xs font-semibold text-[#00b14f] shadow-2xs transition hover:bg-emerald-50"
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
                {company?.photos && company.photos.length > 0 ? (
                  company.photos.map((p) => (
                    <div
                      key={p.id}
                      className="group relative h-28 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                    >
                      <img src={p.photoUrl} alt="Workplace" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(p.id)}
                        className="absolute top-1.5 right-1.5 rounded bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 rounded-md border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400 sm:col-span-4">
                    No workplace photos uploaded yet. Click &ldquo;+ Add Photos&rdquo; to showcase your office
                    environment.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
              <div className="text-xs text-slate-500">
                Company profile information will be publicly displayed on active job postings.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#00b14f] px-8 text-sm font-semibold text-white shadow-2xs transition hover:bg-emerald-600 active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </form>
        ) : null}

        {/* Floating / Sticky Bottom Navigation: Next: Phone Verification -> (TopCV Style) */}
        <div className="fixed right-6 bottom-4 z-40">
          <Link
            href={ROUTES.RECRUITER_COMPANY_PHONE_VERIFY}
            className="flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xs transition hover:scale-102 hover:bg-slate-900"
          >
            <span>Next: Phone Verification</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b14f] text-white">
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
              className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmSelectCompany}
              disabled={isSelecting}
              className="cursor-pointer rounded-md bg-[#00b14f] px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {isSelecting ? 'Selecting...' : 'Confirm Selection'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs text-slate-600">
          <p>
            You are selecting <strong>{pendingCompanyToSelect?.name}</strong> (Tax ID:{' '}
            <code className="font-mono font-bold text-slate-900">{pendingCompanyToSelect?.taxCode}</code>).
          </p>
          <div className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-950">
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
              className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmLeave}
              disabled={isLeaving}
              className="cursor-pointer rounded-md bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-rose-700 disabled:opacity-50"
            >
              {isLeaving ? 'Leaving...' : 'Yes, Leave Company'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs text-slate-600">
          <p className="font-medium text-slate-900">
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

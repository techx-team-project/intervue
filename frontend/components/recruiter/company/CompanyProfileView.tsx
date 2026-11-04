'use client';

import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import Modal from '@/components/ui/Modal';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { isApiError } from '@/lib/api-error';
import type { CompanySummaryResource, SaveCompanyProfileRequest } from '@/types/recruiter-company';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CheckCircle2, Lock, LogOut, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AccountSettingsLayout } from './AccountSettingsLayout';

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
  address: z.string().min(5, 'Registered address is required'),
  description: z.string().optional(),
  benefits: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

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

  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySummaryResource[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modals state
  const [pendingJoinCompany, setPendingJoinCompany] = useState<CompanySummaryResource | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

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
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || '',
      tradingName: company?.tradingName || '',
      taxCode: company?.taxCode || '',
      businessType: company?.businessType || 'ENTERPRISE',
      industry: company?.industry || 'Information Technology',
      website: company?.website || '',
      market: company?.market || 'Vietnam & APAC',
      targetCustomers: company?.targetCustomers || 'Enterprise & SMEs',
      size: company?.size || '50-150 employees',
      email: company?.email || '',
      phone: company?.phone || '',
      address: company?.address || '',
      description: company?.description || '',
      benefits: company?.benefits || '',
    },
  });

  // Sync form when company state loads or updates
  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        tradingName: company.tradingName || '',
        taxCode: company.taxCode || '',
        businessType: company.businessType || 'ENTERPRISE',
        industry: company.industry || '',
        website: company.website || '',
        market: company.market || '',
        targetCustomers: company.targetCustomers || '',
        size: company.size || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        description: company.description || '',
        benefits: company.benefits || '',
      });
    }
  }, [company, reset]);

  // Handle Search Companies
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const page = await recruiterCompanyApi.searchCompanies(searchQuery, 0, 10);
      setSearchResults(page.items);
    } catch {
      toast.error('Could not search companies.');
    } finally {
      setIsSearching(false);
    }
  };

  const onConfirmJoin = async () => {
    if (!pendingJoinCompany) return;
    setIsJoining(true);
    try {
      await handleChooseCompany(pendingJoinCompany.id);
      setIsJoinModalOpen(false);
      setPendingJoinCompany(null);
      setActiveTab('create');
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else {
        toast.error('Failed to join company.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const onConfirmLeave = async () => {
    setIsLeaving(true);
    try {
      await handleLeaveCompany();
      setIsLeaveModalOpen(false);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else {
        toast.error('Failed to leave company.');
      }
    } finally {
      setIsLeaving(false);
    }
  };

  const onSubmitForm = async (data: CompanyFormData) => {
    try {
      await handleSaveCompany(data as SaveCompanyProfileRequest);
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else {
        toast.error('Failed to save company profile.');
      }
    }
  };

  const onLogoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image must be smaller than 2MB.');
      return;
    }
    setIsUploadingLogo(true);
    try {
      await handleUploadLogo(file);
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.error('Failed to upload logo.');
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
    } catch (err) {
      if (isApiError(err)) toast.error(err.message);
      else toast.error('Failed to upload workplace photos.');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const isLegalLocked = company?.legalFieldsLocked === true;

  return (
    <AccountSettingsLayout activeTab="company" pageTitle="Company Profile & Binding">
      <div className="space-y-6">
        {/* Top 2 Mode Switcher */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
              activeTab === 'create'
                ? 'border-[#00b14f] bg-emerald-50/20 ring-1 ring-emerald-500'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  activeTab === 'create' ? 'bg-[#00b14f] text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {company ? 'My Company Profile' : 'Register New Company'}
                </div>
                <div className="text-xs text-slate-500">
                  {company ? `Active Role: ${company.myRole}` : 'Create official corporate profile on InterVue'}
                </div>
              </div>
            </div>
            {activeTab === 'create' && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
              activeTab === 'search'
                ? 'border-[#00b14f] bg-emerald-50/20 ring-1 ring-emerald-500'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  activeTab === 'search' ? 'bg-[#00b14f] text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Find &amp; Join Existing Company</div>
                <div className="text-xs text-slate-500">Join as an authorized recruiter member</div>
              </div>
            </div>
            {activeTab === 'search' && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            )}
          </button>
        </div>

        {/* TAB 1: Search & Join Existing Company */}
        {activeTab === 'search' && (
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Search Employer Directory</h2>
              <p className="text-xs text-slate-500">
                Search by official company name or 10/13-digit Tax ID to join your engineering organization.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter company name or Tax ID..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="rounded-xl bg-[#00b14f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            <div className="space-y-3 pt-2">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.name}</span>
                          {item.verified && (
                            <span className="flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>
                            Tax ID: <strong className="font-mono text-slate-700">{item.taxCode}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Members: <strong>{item.memberCount}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPendingJoinCompany(item);
                        setIsJoinModalOpen(true);
                      }}
                      className="rounded-xl border border-emerald-600 bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-2xs transition hover:bg-emerald-50 active:scale-95"
                    >
                      Join Company
                    </button>
                  </div>
                ))
              ) : searchQuery && !isSearching ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center text-xs text-slate-500">
                  No company matching &ldquo;{searchQuery}&rdquo; found. You can switch to the &ldquo;Register New
                  Company&rdquo; tab to create it.
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* TAB 2: My Company Form / Create Profile */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Legal Status Notice */}
            {isLegalLocked && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-950">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="space-y-1">
                  <p className="text-sm font-bold">Legal Corporate Fields Locked</p>
                  <p className="text-xs text-emerald-800">
                    Your company is officially <strong>VERIFIED</strong> on InterVue. The primary legal entity fields
                    (Official Name, Tax ID, Business Type, Headquarters Address) are locked to protect enterprise
                    trademarks. Contact compliance to request official amendments.
                  </p>
                </div>
              </div>
            )}

            {/* Section 1: Legal Registration Facts */}
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-slate-900">Legal Business Registration</h2>
                  <p className="text-xs text-slate-500">
                    Official business details must strictly match the Enterprise Registration Certificate (ERC).
                  </p>
                </div>
                {company?.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="h-4 w-4" /> Enterprise Verified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Official Registered Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLegalLocked}
                    {...register('name')}
                    placeholder="e.g. CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Commercial / Trading Name</label>
                  <input
                    type="text"
                    {...register('tradingName')}
                    placeholder="e.g. TechX Global"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Tax Identification Number (Tax ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLegalLocked}
                    {...register('taxCode')}
                    placeholder="10 or 13 digits (e.g. 0317894561)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {errors.taxCode && <p className="text-xs text-rose-600">{errors.taxCode.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Business Structure</label>
                  <select
                    disabled={isLegalLocked}
                    {...register('businessType')}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="ENTERPRISE">Enterprise (Công ty TNHH / Cổ phần)</option>
                    <option value="HOUSEHOLD">Household Business (Hộ kinh doanh)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Primary Industry</label>
                  <input
                    type="text"
                    {...register('industry')}
                    placeholder="e.g. Software Development & FinTech"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Registered Headquarters Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLegalLocked}
                    {...register('address')}
                    placeholder="Official registered address on business license"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {errors.address && <p className="text-xs text-rose-600">{errors.address.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Branding & Media */}
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Employer Branding &amp; Media</h2>
                <p className="text-xs text-slate-500">
                  Visual assets shown to candidates across job listings and enterprise landing pages.
                </p>
              </div>

              {/* Logo Row */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                  {company?.logoUrl ? (
                    <img src={company.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-8 w-8" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
                    >
                      {isUploadingLogo ? 'Uploading Logo...' : 'Upload Logo'}
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onLogoSelected}
                      className="sr-only"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">PNG, JPG, SVG up to 2MB. Square 1:1 ratio recommended.</p>
                </div>
              </div>

              {/* Workplace Photos */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Workplace &amp; Team Culture Photos</label>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploadingPhotos}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Photos</span>
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

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {company?.photos && company.photos.length > 0 ? (
                    company.photos.map((p) => (
                      <div
                        key={p.id}
                        className="group relative h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >
                        <img src={p.photoUrl} alt="Workplace" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(p.id)}
                          className="absolute top-1.5 right-1.5 rounded-md bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 sm:col-span-4">
                      No workplace photos uploaded yet. Click &ldquo;Add Photos&rdquo; to showcase your office
                      environment.
                    </div>
                  )}
                </div>
              </div>

              {/* Other Marketing Fields */}
              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Official Website</label>
                  <input
                    type="text"
                    {...register('website')}
                    placeholder="https://company.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                  {errors.website && <p className="text-xs text-rose-600">{errors.website.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Company Size</label>
                  <input
                    type="text"
                    {...register('size')}
                    placeholder="e.g. 100-500 employees"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Public Contact Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="careers@company.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                  {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Public Contact Phone</label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="+84 28 1234 5678"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">About Company &amp; Vision</label>
                  <textarea
                    rows={4}
                    {...register('description')}
                    placeholder="Describe your engineering culture, tech stack, and corporate mission..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Employee Benefits &amp; Perks</label>
                  <textarea
                    rows={3}
                    {...register('benefits')}
                    placeholder="Highlight 13th month bonus, premium health insurance, remote work options..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs font-medium text-slate-900 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Profile...' : 'Save Company Profile'}
              </button>
            </div>
          </form>
        )}

        {/* Danger Zone: Leave Company */}
        {company && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-rose-900">Danger Zone: Leave Company Membership</h3>
                <p className="text-xs text-rose-800">
                  Sever your affiliation with <strong>{company.name}</strong>. You will forfeit job publishing
                  privileges and access to candidate applicants under this corporate profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-700 shadow-2xs transition hover:bg-rose-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Leave Company</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM JOIN MODAL */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title={`Join ${pendingJoinCompany?.name}?`}
        description="Confirm affiliation with this registered enterprise."
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmJoin}
              disabled={isJoining}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {isJoining ? 'Joining...' : 'Confirm Affiliation'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs text-slate-600">
          <p>
            You are registering as a hiring team member for <strong>{pendingJoinCompany?.name}</strong> (Tax ID:{' '}
            <code className="font-mono">{pendingJoinCompany?.taxCode}</code>).
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
            <p className="font-bold">Representation Notice:</p>
            <p className="mt-1">
              To publish jobs to the public board on behalf of this company, you will be required to submit an official
              Letter of Authorization (LOA) signed by the legal representative.
            </p>
          </div>
        </div>
      </Modal>

      {/* CONFIRM LEAVE MODAL */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Company Membership?"
        description="Are you sure you want to end your affiliation?"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmLeave}
              disabled={isLeaving}
              className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50"
            >
              {isLeaving ? 'Leaving...' : 'Yes, Leave Company'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs text-slate-600">
          <p className="font-medium text-slate-900">
            You are leaving <strong>{company?.name}</strong>.
          </p>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-rose-900">
            <p className="font-bold">Important Consequence:</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              <li>Your publishing privileges will be revoked immediately (`canPublish = false`).</li>
              <li>You will lose access to active candidate pipelines and resumes under this company.</li>
              {company?.myRole === 'OWNER' && (
                <li className="font-bold text-rose-950">
                  As the sole registered OWNER, leaving will disband and delete this company profile from the platform.
                </li>
              )}
            </ul>
          </div>
        </div>
      </Modal>
    </AccountSettingsLayout>
  );
}

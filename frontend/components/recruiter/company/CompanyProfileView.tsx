'use client';

import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { MOCK_AVAILABLE_COMPANIES, getCompanyDetailData } from '@/mocks/recruiter-company.mock';
import type { CompanyDetailData } from '@/types/recruiter-company';
import {
  AlertCircle,
  AlignCenter,
  AlignLeft,
  Bold,
  Building2,
  Camera,
  Check,
  ExternalLink,
  HelpCircle,
  Info,
  Italic,
  List,
  ListOrdered,
  Plus,
  Redo2,
  Search,
  Trash2,
  Underline,
  Undo2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AccountSettingsLayout } from './AccountSettingsLayout';

export function CompanyProfileView() {
  const { profile, handleChooseCompany, handleSaveCompany } = useCompanyVerification();

  const [activeTab, setActiveTab] = useState<'search' | 'create'>('create');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial form values from stored company
  const [formData, setFormData] = useState<CompanyDetailData>(() => getCompanyDetailData());

  const [hasNoLogo, setHasNoLogo] = useState(false);
  const [hasNoWebsite, setHasNoWebsite] = useState(false);
  const [isSameCommercialName, setIsSameCommercialName] = useState(false);

  // Search filtering
  const filteredCompanies = MOCK_AVAILABLE_COMPANIES.filter((comp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      comp.name.toLowerCase().includes(q) || comp.tradingName.toLowerCase().includes(q) || comp.taxCode.includes(q)
    );
  });

  const handleSelectCompany = (comp: CompanyDetailData) => {
    handleChooseCompany(comp.id);
    setFormData(comp);
    toast.success(`Đã chọn công ty: ${comp.tradingName}!`);
  };

  const handleFieldChange = <K extends keyof CompanyDetailData>(field: K, value: CompanyDetailData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên công ty!');
      return;
    }
    if (!formData.taxCode.trim()) {
      toast.error('Vui lòng nhập mã số thuế!');
      return;
    }

    handleSaveCompany(formData);
    toast.success('Thông tin công ty đã được lưu thành công!');
  };

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    ];
    const nextPhoto = samplePhotos[formData.photos.length % samplePhotos.length];
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, nextPhoto],
    }));
    toast.success('Đã tải lên 1 hình ảnh công ty!');
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <AccountSettingsLayout
      activeTab="company"
      pageTitle="Thông tin công ty"
      nextStepOverride={{
        label: 'Cập nhật Giấy đăng ký doanh nghiệp',
        href: ROUTES.RECRUITER_COMPANY_LICENSE,
      }}
    >
      <div className="space-y-6">
        {/* Top 2 Tabs matching TopCV */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Tab 1: Search */}
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
              activeTab === 'search'
                ? 'border-[#00b14f] bg-emerald-50/20'
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
                <div className="text-sm font-bold text-slate-900">Tìm kiếm thông tin công ty</div>
                <div className="text-xs text-slate-500">Dành cho Doanh nghiệp đã có trên InterVue</div>
              </div>
            </div>

            {activeTab === 'search' && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Tab 2: Create new */}
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
              activeTab === 'create'
                ? 'border-[#00b14f] bg-emerald-50/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  activeTab === 'create' ? 'bg-[#00b14f] text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Tạo công ty mới</div>
                <div className="text-xs text-slate-500">Dành cho Doanh nghiệp lần đầu sử dụng InterVue</div>
              </div>
            </div>

            {activeTab === 'create' && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        {/* TAB 1: Search & Link Existing Company */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tên công ty, tên thương mại hoặc mã số thuế..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="rounded-xl bg-[#00b14f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Blue Notice Alert */}
            <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <div>
                Để tài khoản được xác thực nhanh chóng, vui lòng sử dụng <strong>Tên công ty</strong> trùng khớp với dữ
                liệu doanh nghiệp theo Trang thông tin điện tử của Cục Thuế.
              </div>
            </div>

            {/* Company Cards Grid */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-800">Doanh nghiệp tiêu biểu đã xác thực</div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredCompanies.map((comp) => {
                  const isSelected = profile.company.id === comp.id || formData.id === comp.id;

                  return (
                    <div
                      key={comp.id}
                      className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-[#00b14f] bg-emerald-50/30 ring-1 ring-[#00b14f]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Company Avatar / Logo */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-xs font-bold text-white">
                          {comp.logoUrl ? (
                            <img src={comp.logoUrl} alt={comp.tradingName} className="h-full w-full object-cover" />
                          ) : (
                            comp.tradingName.slice(0, 2).toUpperCase()
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="line-clamp-1 text-sm font-bold text-slate-900">{comp.name}</h4>
                          <div className="text-xs text-slate-600">
                            Tên thương mại: <span className="font-semibold text-slate-800">{comp.tradingName}</span>
                          </div>
                          <div className="text-xs text-slate-600">
                            MST: <span className="font-mono text-slate-700">{comp.taxCode}</span>
                          </div>
                          <div className="line-clamp-1 text-xs text-slate-500">
                            {comp.address} | {comp.size}
                          </div>
                        </div>
                      </div>

                      {/* Select Button */}
                      <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#00b14f]">
                            <Check className="h-3 w-3 stroke-[3]" />
                            Đang liên kết
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectCompany(comp)}
                            className="rounded-lg border border-[#00b14f] bg-white px-4 py-1 text-xs font-bold text-[#00b14f] transition hover:bg-emerald-50"
                          >
                            Chọn công ty này
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Create / Edit Company Profile */}
        {activeTab === 'create' && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
              <div className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-[#00b14f]">
                {formData.logoUrl && !hasNoLogo ? (
                  <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-slate-300" />
                )}

                <label
                  htmlFor="logo-file-input"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100"
                >
                  <Camera className="h-6 w-6 text-white" />
                </label>
                <input
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {
                    handleFieldChange(
                      'logoUrl',
                      'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
                    );
                    setHasNoLogo(false);
                    toast.success('Đã tải lên logo công ty!');
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-700">
                  Logo công ty <span className="text-red-500">*</span>
                </div>
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={hasNoLogo}
                    onChange={(e) => setHasNoLogo(e.target.checked)}
                    className="rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  />
                  <span>Tôi không có logo</span>
                </label>
              </div>
            </div>

            {/* Business Type Radio Pills */}
            <div className="flex gap-4">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  formData.businessType === 'ENTERPRISE'
                    ? 'border-[#00b14f] bg-emerald-50 text-[#00b14f]'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="businessType"
                  checked={formData.businessType === 'ENTERPRISE'}
                  onChange={() => handleFieldChange('businessType', 'ENTERPRISE')}
                  className="hidden"
                />
                <span>Doanh nghiệp</span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  formData.businessType === 'HOUSEHOLD'
                    ? 'border-[#00b14f] bg-emerald-50 text-[#00b14f]'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="businessType"
                  checked={formData.businessType === 'HOUSEHOLD'}
                  onChange={() => handleFieldChange('businessType', 'HOUSEHOLD')}
                  className="hidden"
                />
                <span>Hộ kinh doanh</span>
              </label>
            </div>

            {/* Yellow Alert Box */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                Để tài khoản được xác thực nhanh chóng, vui lòng nhập <strong>Mã số thuế</strong> và{' '}
                <strong>Tên công ty</strong> trùng khớp với dữ liệu doanh nghiệp theo Trang thông tin điện tử của Cục
                Thuế. Bạn có thể tra cứu thông tin doanh nghiệp{' '}
                <a
                  href="https://tracuunnt.gdt.gov.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 font-bold text-amber-800 underline hover:text-amber-950"
                >
                  Tại đây <ExternalLink className="inline h-3 w-3" />
                </a>
                .
              </div>
            </div>

            {/* Form Inputs Grid (2 columns) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Tax Code */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <span>Mã số thuế</span>
                  <span className="text-red-500">*</span>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  required
                  value={formData.taxCode}
                  onChange={(e) => handleFieldChange('taxCode', e.target.value)}
                  placeholder="Nhập mã số thuế (10 hoặc 13 số)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                />
              </div>

              {/* Company Legal Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Tên công ty (theo ĐKKD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="VD: CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                />
              </div>

              {/* Industry */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <span>Ngành nghề kinh doanh</span>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleFieldChange('industry', e.target.value)}
                  placeholder="Công nghệ thông tin / Phần mềm"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                />
                <div className="text-[11px] text-slate-400">
                  InterVue sẽ cập nhật danh mục ngành nghề theo Giấy phép ĐKKD của MST bạn đã nhập ở trên trong vòng 24h
                  làm việc.
                </div>
              </div>

              {/* Commercial Name */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <span>Tên thương mại</span>
                  <span className="text-red-500">*</span>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  required
                  value={isSameCommercialName ? formData.name : formData.tradingName}
                  onChange={(e) => handleFieldChange('tradingName', e.target.value)}
                  disabled={isSameCommercialName}
                  placeholder="VD: TechX Global"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none disabled:bg-slate-100 sm:text-sm"
                />
                <label className="flex cursor-pointer items-center gap-1.5 pt-1 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={isSameCommercialName}
                    onChange={(e) => {
                      setIsSameCommercialName(e.target.checked);
                      if (e.target.checked) {
                        handleFieldChange('tradingName', formData.name);
                      }
                    }}
                    className="rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  />
                  <span>Tên thương mại trùng với Tên đăng ký kinh doanh</span>
                </label>
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={hasNoWebsite ? '' : formData.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  disabled={hasNoWebsite}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none disabled:bg-slate-100 sm:text-sm"
                />
                <label className="flex cursor-pointer items-center gap-1.5 pt-1 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={hasNoWebsite}
                    onChange={(e) => setHasNoWebsite(e.target.checked)}
                    className="rounded border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                  />
                  <span>Tôi không có website</span>
                </label>
              </div>

              {/* Market */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Thị trường hoạt động</label>
                <select
                  value={formData.market}
                  onChange={(e) => handleFieldChange('market', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                >
                  <option value="Toàn quốc & Quốc tế">Toàn quốc & Quốc tế</option>
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Đông Nam Á">Đông Nam Á</option>
                  <option value="Toàn cầu (Global)">Toàn cầu (Global)</option>
                </select>
              </div>

              {/* Target Customers */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Khách hàng mục tiêu</label>
                <select
                  value={formData.targetCustomers}
                  onChange={(e) => handleFieldChange('targetCustomers', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                >
                  <option value="Doanh nghiệp (B2B)">Doanh nghiệp (B2B)</option>
                  <option value="Người tiêu dùng (B2C)">Người tiêu dùng (B2C)</option>
                  <option value="B2B & B2C">B2B & B2C</option>
                </select>
              </div>

              {/* Size */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Quy mô nhân sự <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => handleFieldChange('size', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                >
                  <option value="1-9 nhân sự">1-9 nhân sự</option>
                  <option value="10-24 nhân sự">10-24 nhân sự</option>
                  <option value="25-99 nhân sự">25-99 nhân sự</option>
                  <option value="100-499 nhân sự">100-499 nhân sự</option>
                  <option value="500-999 nhân sự">500-999 nhân sự</option>
                  <option value="1000+ nhân sự">1000+ nhân sự</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Email liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Số điện thoại công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                  placeholder="024 3999 8888"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                />
              </div>

              {/* Address (Full row) */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Địa chỉ trụ sở chính <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Tầng, Tòa nhà, Số nhà, Đường, Quận/Huyện, Tỉnh/Thành phố"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none sm:text-sm"
                />
              </div>

              {/* Company Description (Full row, Rich Toolbar) */}
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span>Mô tả công ty</span>
                    <span className="text-red-500">*</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  <span className="text-[11px] text-slate-400">{formData.description.length} / 10000 ký tự</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-300 focus-within:border-[#00b14f] focus-within:ring-1 focus-within:ring-[#00b14f]">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-600">
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <Undo2 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <Redo2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-px bg-slate-300" />
                    <button type="button" className="rounded p-1 font-bold hover:bg-slate-200">
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 italic hover:bg-slate-200">
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 underline hover:bg-slate-200">
                      <Underline className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-px bg-slate-300" />
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <ListOrdered className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-px bg-slate-300" />
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <AlignCenter className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="InterVue khuyến nghị độ dài tối thiểu 500 ký tự giới thiệu về lịch sử hình thành, định hướng phát triển, sản phẩm chính..."
                    className="w-full resize-y bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {/* Benefits (Full row, Rich Toolbar) */}
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span>Phúc lợi nhân viên</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  <span className="text-[11px] text-slate-400">{formData.benefits.length} / 10000 ký tự</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-300 focus-within:border-[#00b14f] focus-within:ring-1 focus-within:ring-[#00b14f]">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-600">
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 hover:bg-slate-200">
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) => handleFieldChange('benefits', e.target.value)}
                    placeholder="Mô tả các chế độ lương thưởng, bảo hiểm, đào tạo, du lịch và quyền lợi khác dành cho nhân viên..."
                    className="w-full resize-y bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {/* Company Photos (Full row) */}
              <div className="space-y-3 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Hình ảnh công ty</label>
                <p className="text-xs text-slate-500">
                  Bổ sung hình ảnh về địa điểm làm việc, sản phẩm/dịch vụ, hoạt động tiêu biểu của công ty để tăng độ
                  tin cậy của ứng viên. Để hình ảnh hiển thị tốt nhất, vui lòng chọn ảnh có tỉ lệ 3:2 (Kích thước khuyến
                  nghị: <strong>1200 × 800 px</strong>).
                </p>

                {/* Upload Button */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="flex items-center gap-2 rounded-xl border border-[#00b14f] bg-emerald-50 px-4 py-2.5 text-xs font-bold text-[#00b14f] transition hover:bg-emerald-100"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm ảnh công ty</span>
                  </button>

                  <span className="text-xs text-slate-400">Đã tải lên {formData.photos.length} hình ảnh</span>
                </div>

                {/* Photo Preview Gallery */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                    {formData.photos.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-3/2 overflow-hidden rounded-xl border border-slate-200"
                      >
                        <img src={url} alt={`Ảnh công ty ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                          aria-label="Xóa ảnh"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                className="rounded-xl bg-[#00b14f] px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-600 active:scale-95"
              >
                Lưu thông tin công ty
              </button>
            </div>
          </form>
        )}
      </div>
    </AccountSettingsLayout>
  );
}

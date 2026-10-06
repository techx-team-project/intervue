'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Gift,
  CircleUser,
  Check,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  Crown,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react';

interface AvailableVoucher {
  id: string;
  type: 'premium' | 'education' | 'pro' | 'course';
  packageId: string;
  packageName: string;
  code: string;
  expiryDate: string;
  receivedDate: string;
  tagColor: string;
  tagBg: string;
  titleColor: string;
  badgeLabel: string;
  description: string;
}

const AVAILABLE_VOUCHERS: AvailableVoucher[] = [
  {
    id: 'v-1',
    type: 'education',
    packageId: '300',
    packageName: 'Tài khoản Education VIP (1 năm)',
    code: 'EDU-VIP-2026',
    expiryDate: '31/12/2026',
    receivedDate: '01/10/2026',
    tagColor: '#ff9f0a',
    tagBg: '#fff5e7',
    titleColor: '#e08600',
    badgeLabel: 'Sinh viên & Giảng viên',
    description: 'Ưu đãi kích hoạt VIP dành cho học tập, bao gồm trọn bộ đặc quyền tạo CV & khoá học.',
  },
  {
    id: 'v-2',
    type: 'pro',
    packageId: '400',
    packageName: 'Tài khoản Pro VIP (1 tháng)',
    code: 'PRO-TRIAL-30D',
    expiryDate: '15/11/2026',
    receivedDate: '05/10/2026',
    tagColor: '#4285f4',
    tagBg: '#e8f0fe',
    titleColor: '#1a73e8',
    badgeLabel: 'Dùng thử Pro',
    description: 'Trải nghiệm đầy đủ tính năng Pro: Đẩy Top hồ sơ và tải không giới hạn CV.',
  },
  {
    id: 'v-3',
    type: 'premium',
    packageId: '402',
    packageName: 'Tài khoản Premium VIP (1 năm)',
    code: 'TOPCV-PREMIUM-VIP',
    expiryDate: '30/12/2026',
    receivedDate: '06/10/2026',
    tagColor: '#00b14f',
    tagBg: '#e5f7ed',
    titleColor: '#00b14f',
    badgeLabel: 'VIP Cao Cấp Nhất',
    description: 'Đặc quyền cao nhất: Xếp hạng Top 1 tìm kiếm NTD, hỗ trợ sửa CV 1-1 chuyên sâu.',
  },
  {
    id: 'v-4',
    type: 'course',
    packageId: '300',
    packageName: 'Khoá học Gitiho: Tuyệt đỉnh Excel 2026',
    code: 'GITIHO-EXCEL-FREE',
    expiryDate: '31/12/2026',
    receivedDate: 'Quà tặng thành viên',
    tagColor: '#8b5cf6',
    tagBg: '#f3e8ff',
    titleColor: '#7c3aed',
    badgeLabel: 'Đối tác Gitiho',
    description: 'Trọn bộ 50+ video thực hành Excel từ cơ bản tới nâng cao cho dân văn phòng.',
  },
];

const FAQS = [
  {
    q: 'Làm thế nào để nhận được mã quà tặng TopCV?',
    a: 'Mã quà tặng TopCV thường được phát hành thông qua các chương trình tri ân ứng viên, sự kiện ngày hội việc làm, workshop tại các trường đại học, đối tác liên kết giáo dục, hoặc gửi trực tiếp qua email của bạn.',
  },
  {
    q: 'Mã quà tặng có thể áp dụng cho những gói tài khoản nào?',
    a: 'Mỗi mã quà tặng được thiết kế riêng cho một hoặc nhiều gói tài khoản cụ thể (Education VIP, Pro VIP, Premium VIP). Bạn chỉ cần chọn đúng gói tài khoản tương ứng trên thanh chọn rồi bấm "Áp dụng".',
  },
  {
    q: 'Tôi có thể chia sẻ mã quà tặng cho bạn bè được không?',
    a: 'Có. Mỗi mã quà tặng chưa qua kích hoạt đều có thể sử dụng cho bất kỳ tài khoản ứng viên nào trên hệ thống. Sau khi đã kích hoạt thành công, mã sẽ được liên kết vĩnh viễn với tài khoản đó.',
  },
  {
    q: 'Quyền lợi khoá học từ đối tác (Gitiho) nhận như thế nào?',
    a: 'Khi kích hoạt mã và tích chọn đồng ý chia sẻ thông tin cho đối tác, hệ thống sẽ tự động gửi email hướng dẫn kích hoạt tài khoản học tập trực tuyến trên Gitiho với đúng địa chỉ email tài khoản của bạn trong vòng 24 giờ làm việc.',
  },
  {
    q: 'Mã quà tặng đã hết hạn thì có kích hoạt được không?',
    a: 'Rất tiếc, các mã quà tặng đã quá ngày hết hạn (HSD) sẽ không còn giá trị kích hoạt. Bạn vui lòng liên hệ hotline 1900 068 889 (Nhánh 2) nếu cần hỗ trợ thêm thông tin chi tiết.',
  },
];

export default function GiftActivationView() {
  const formRef = useRef<HTMLDivElement>(null);

  // Form states
  const [packageType, setPackageType] = useState<string>('300'); // 300: Education, 400: Pro, 402: Premium
  const [couponCode, setCouponCode] = useState<string>('');
  const [agreePartner, setAgreePartner] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<{
    packageName: string;
    code: string;
    expiryText: string;
  } | null>(null);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const getPackageNameById = (id: string) => {
    switch (id) {
      case '300':
        return 'Tài khoản Education VIP (1 năm)';
      case '400':
        return 'Tài khoản Pro VIP (1 tháng)';
      case '402':
        return 'Tài khoản Premium VIP (1 năm)';
      default:
        return 'Tài khoản VIP';
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập mã quà tặng (coupon code) của bạn.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Validate known demo coupons or accept general format
      const isKnown = AVAILABLE_VOUCHERS.some((v) => v.code.toUpperCase() === trimmed);
      const isPromo = ['TOPCV', 'VIP', 'EDU', 'PRO', 'INTERVUE'].some((prefix) => trimmed.includes(prefix));

      if (isKnown || isPromo || trimmed.length >= 6) {
        setSuccessInfo({
          packageName: getPackageNameById(packageType),
          code: trimmed,
          expiryText: packageType === '400' ? '1 tháng kể từ hôm nay' : '1 năm (12 tháng) kể từ hôm nay',
        });
      } else {
        setErrorMsg('Mã code không hợp lệ hoặc đã được sử dụng. Vui lòng kiểm tra lại!');
      }
    }, 800);
  };

  const handleUseVoucher = (voucher: AvailableVoucher) => {
    setPackageType(voucher.packageId);
    setCouponCode(voucher.code);
    setErrorMsg('');

    // Smooth scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyCode = (voucher: AvailableVoucher) => {
    navigator.clipboard.writeText(voucher.code);
    setCopiedId(voucher.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="main" className="min-h-screen bg-[#f1f2f6] pt-6 pb-16 antialiased sm:pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-xs text-[#64748b] sm:text-sm">
          <Link href="/" className="hover:text-[#00b14f]">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/upgrade" className="hover:text-[#00b14f]">
            Nâng cấp tài khoản
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#1e293b]">Kích hoạt quà tặng</span>
        </nav>

        {/* 1. Main Activation Card (Matching TopCV .box-apply-coupon exactly) */}
        <div
          ref={formRef}
          className="mx-auto w-full max-w-2xl rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-9 md:p-10"
        >
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-[#00b14f] sm:text-[26px]">Kích hoạt mã quà tặng</h1>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[#334155] sm:text-[14.5px]">
              Chúc mừng bạn đã nhận được mã code quà tặng TopCV. Kích hoạt ngay bằng cách chọn gói tài khoản và nhập mã
              code để nhận được những đặc quyền hấp dẫn!
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3.5 text-sm text-[#de4637]">
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <div className="flex-1 font-medium">{errorMsg}</div>
              <button type="button" onClick={() => setErrorMsg('')} className="text-[#991b1b] hover:text-[#7f1d1d]">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-4">
            {/* Package Type Selector */}
            <div className="relative">
              <span className="pointer-events-none absolute top-3.5 left-3.5 z-10 flex items-center text-[#00b14f]">
                <CircleUser className="h-5 w-5" />
              </span>
              <select
                id="type-coupon"
                name="type"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-[#dce0e5] bg-white pr-10 pl-11 text-[14.5px] font-medium text-[#1e293b] transition-all hover:border-[#cbd5e1] focus:border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
              >
                <option value="300">Tài khoản Education VIP (1 năm)</option>
                <option value="400">Tài khoản Pro VIP (1 tháng)</option>
                <option value="402">Tài khoản Premium VIP (1 năm)</option>
              </select>
              <span className="pointer-events-none absolute top-4 right-3.5 text-[#94a3b8]">
                <ChevronDown className="h-4.5 w-4.5" />
              </span>
            </div>

            {/* Coupon Code Input */}
            <div className="relative">
              <span className="pointer-events-none absolute top-3.5 left-3.5 z-10 flex items-center text-[#00b14f]">
                <Gift className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập mã code"
                className="h-12 w-full rounded-lg border border-[#dce0e5] bg-white pr-10 pl-11 text-[14.5px] font-medium tracking-wide text-[#1e293b] transition-all placeholder:text-[#94a3b8] hover:border-[#cbd5e1] focus:border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
              />
              {couponCode && (
                <button
                  type="button"
                  onClick={() => setCouponCode('')}
                  className="absolute top-3.5 right-3.5 text-[#94a3b8] hover:text-[#64748b]"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Checkbox Data Agreement */}
            <div className="pt-2">
              <label className="flex cursor-pointer items-start gap-3 select-none">
                <input
                  type="checkbox"
                  checked={agreePartner}
                  onChange={(e) => setAgreePartner(e.target.checked)}
                  className="mt-1 h-4.5 w-4.5 shrink-0 rounded border-gray-300 text-[#00b14f] transition focus:ring-[#00b14f]"
                />
                <span className="text-[13px] leading-5 text-[#212f3f]">
                  Tôi đồng ý chia sẻ dữ liệu cho Đối tác hệ sinh thái của công ty TopCV để sử dụng{' '}
                  <Link
                    href="/upgrade#guild-gitiho"
                    target="_blank"
                    className="font-medium text-[#00b14f] underline decoration-[#00b14f] hover:text-[#009643]"
                  >
                    quyền lợi khoá học từ đối tác
                  </Link>{' '}
                  được đính kèm trong gói thành viên này.
                </span>
              </label>

              {/* Note text (italic) */}
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#64748b] italic">
                Lưu ý: Ưu đãi khóa học từ đối tác chỉ được áp dụng khi bạn tích chọn đồng ý chia sẻ dữ liệu. Trường hợp
                không tích chọn, bạn vẫn có thể nâng cấp tài khoản nhưng sẽ không nhận được các phần quà/quyền lợi đi
                kèm từ đối tác của TopCV.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#00b14f] text-[15px] font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#009643] hover:shadow-md active:scale-[0.99] disabled:opacity-75"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang kiểm tra mã...
                  </span>
                ) : (
                  'Áp dụng'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Success Modal / Banner */}
        {successInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl duration-200">
              <button
                type="button"
                onClick={() => setSuccessInfo(null)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#00b14f]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">Kích hoạt thành công!</h3>
                <p className="mt-1 text-sm text-gray-600">Chúc mừng bạn đã kích hoạt thành công gói đặc quyền:</p>

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-left">
                  <div className="text-xs font-semibold text-emerald-800 uppercase">Gói tài khoản</div>
                  <div className="mt-0.5 text-base font-bold text-emerald-950">{successInfo.packageName}</div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-emerald-200/80 pt-2 text-xs text-emerald-800">
                    <span>Mã đã áp dụng:</span>
                    <span className="font-mono font-bold">{successInfo.code}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-emerald-800">
                    <span>Thời hạn sử dụng:</span>
                    <span className="font-medium">{successInfo.expiryText}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <Link
                    href="/profile"
                    className="flex h-11 w-full items-center justify-center rounded-lg bg-[#00b14f] text-sm font-bold text-white transition hover:bg-[#009643]"
                  >
                    Xem quyền lợi trong hồ sơ
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSuccessInfo(null)}
                    className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Section: "Mã quà tặng của bạn" (.box-coupon from TopCV) */}
        <div className="mt-12 md:mt-16">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#212f3f] sm:text-[22px]">Mã quà tặng của bạn</h2>
              <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                Danh sách các mã ưu đãi độc quyền sẵn sàng kích hoạt cho tài khoản của bạn.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#00b14f] ring-1 ring-emerald-200">
              <Gift className="h-3.5 w-3.5" /> {AVAILABLE_VOUCHERS.length} mã khả dụng
            </span>
          </div>

          {/* 2-Column Grid matching TopCV .list-item */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {AVAILABLE_VOUCHERS.map((voucher) => {
              const isCopied = copiedId === voucher.id;

              return (
                <div
                  key={voucher.id}
                  className="group relative flex overflow-hidden rounded-xl border border-[#e2e8f0] bg-white p-4.5 shadow-xs transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
                >
                  {/* Left Column (Dashed divider, illustration, HSD) */}
                  <div className="flex w-24 shrink-0 flex-col items-center justify-between border-r border-dashed border-[#cbd5e1] pr-3 text-center sm:w-28 sm:pr-4">
                    <div className="my-auto flex flex-col items-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs sm:h-16 sm:w-16"
                        style={{ backgroundColor: voucher.tagBg }}
                      >
                        {voucher.type === 'premium' && (
                          <Crown className="h-7 w-7" style={{ color: voucher.tagColor }} />
                        )}
                        {voucher.type === 'education' && (
                          <GraduationCap className="h-7 w-7" style={{ color: voucher.tagColor }} />
                        )}
                        {voucher.type === 'pro' && <Award className="h-7 w-7" style={{ color: voucher.tagColor }} />}
                        {voucher.type === 'course' && (
                          <BookOpen className="h-7 w-7" style={{ color: voucher.tagColor }} />
                        )}
                      </div>
                      <span
                        className="mt-2 inline-block rounded px-1.5 py-0.5 text-[10.5px] font-bold"
                        style={{ backgroundColor: voucher.tagBg, color: voucher.tagColor }}
                      >
                        {voucher.badgeLabel}
                      </span>
                    </div>

                    <div className="pt-2 text-[11px] font-medium text-[#64748b]">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3 text-[#94a3b8]" />
                        <span>HSD:</span>
                      </div>
                      <span className="font-semibold text-[#334155]">{voucher.expiryDate}</span>
                    </div>
                  </div>

                  {/* Right Column (Voucher details, code, action buttons) */}
                  <div className="flex flex-1 flex-col justify-between pl-4 sm:pl-5">
                    <div>
                      <h3
                        className="text-[14.5px] font-bold tracking-tight sm:text-[15.5px]"
                        style={{ color: voucher.titleColor }}
                      >
                        {voucher.packageName}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#64748b]">{voucher.description}</p>
                      <div className="mt-2 text-[11.5px] text-[#94a3b8]">
                        <span>Ngày nhận: </span>
                        <span className="font-medium text-[#475569]">{voucher.receivedDate}</span>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f1f5f9] pt-3">
                      {/* Code Badge */}
                      <div
                        className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-bold"
                        style={{ backgroundColor: voucher.tagBg, color: voucher.tagColor }}
                        title="Mã quà tặng"
                      >
                        <span>{voucher.code}</span>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(voucher)}
                          className="flex cursor-pointer items-center gap-1 rounded-md border border-[#e2e8f0] px-2.5 py-1.5 text-xs font-medium text-[#475569] transition hover:bg-slate-50 hover:text-[#00b14f]"
                          title="Sao chép mã"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#00b14f]" />
                              <span className="text-[#00b14f]">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Chép mã</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUseVoucher(voucher)}
                          className="flex cursor-pointer items-center gap-1 rounded-md bg-[#00b14f] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#009643] active:scale-95"
                        >
                          <span>Dùng ngay</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Ecosystem & Partner Perks Section */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/50 via-white to-emerald-50/20 p-6 shadow-xs md:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-[#00b14f]">
              <Sparkles className="h-3.5 w-3.5" /> Hệ sinh thái đối tác TopCV & Gitiho
            </span>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-[#1e293b] sm:text-2xl">
              Nâng cấp hồ sơ, mở rộng kỹ năng nghề nghiệp
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
              Kích hoạt mã quà tặng ngay hôm nay để nhận thêm bộ đặc quyền khóa học thực chiến từ nền tảng giáo dục trực
              tuyến Gitiho cùng hàng loạt tính năng VIP trên InterVue.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-gray-900">Tạo CV Không Giới Hạn</h4>
              <p className="mt-1 text-xs text-gray-500">
                Mở khóa tất cả 50+ mẫu CV chuẩn ATS, tải bản PDF độ nét cao không giới hạn.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-[#1967d2]">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-gray-900">Đẩy Top Hồ Sơ Tuyển Dụng</h4>
              <p className="mt-1 text-xs text-gray-500">
                Ưu tiên hiển thị hồ sơ ở vị trí đầu bảng khi nhà tuyển dụng tìm kiếm ứng viên.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-[#7c3aed]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-gray-900">Khoá Học Gitiho Miễn Phí</h4>
              <p className="mt-1 text-xs text-gray-500">
                Tặng trọn bộ khoá Tin học văn phòng Excel, Word & PowerPoint thực chiến trị giá 1.499.000đ.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-[#d97706]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-gray-900">Huy Hiệu VIP Uy Tín</h4>
              <p className="mt-1 text-xs text-gray-500">
                Gắn huy hiệu VIP trên hồ sơ giúp tăng 80% tỷ lệ phản hồi và mời phỏng vấn từ NTD.
              </p>
            </div>
          </div>
        </div>

        {/* 5. FAQs Section */}
        <div className="mt-12 md:mt-16">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-[#212f3f] sm:text-2xl">
              Câu hỏi thường gặp về Mã quà tặng
            </h2>
            <p className="mt-1.5 text-xs text-[#64748b] sm:text-sm">
              Giải đáp các thắc mắc phổ biến trong quá trình nhận và kích hoạt mã quà tặng TopCV
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-3xl space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition hover:border-gray-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full cursor-pointer items-center justify-between p-4.5 text-left font-bold text-[#1e293b] sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-3 shrink-0 text-[#94a3b8]">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#f1f5f9] px-4.5 pt-3 pb-4.5 text-sm leading-relaxed text-[#475569]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Support & Contact Banner */}
        <div className="mt-12 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7 md:mt-16">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div>
              <h4 className="text-base font-bold text-[#1e293b]">Cần trợ giúp kích hoạt mã quà tặng?</h4>
              <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                Đội ngũ chăm sóc khách hàng TopCV sẵn sàng hỗ trợ bạn từ 08:30 đến 18:00 (Thứ 2 - Thứ 6).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:1900068889"
                className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-xs font-semibold text-[#1e293b] transition hover:border-[#00b14f] hover:text-[#00b14f] sm:text-sm"
              >
                <Phone className="h-4 w-4 text-[#00b14f]" />
                <span>Hotline: 1900 068 889 (Nhánh 2)</span>
              </a>

              <a
                href="mailto:hotro@topcv.vn"
                className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-[#00b14f] transition hover:bg-emerald-100 sm:text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>Gửi email hỗ trợ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

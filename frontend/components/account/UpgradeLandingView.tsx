'use client';

import { useState, useEffect } from 'react';
import { Check, Sparkles, Minus, X, Copy, CheckCircle2, ChevronDown, ChevronUp, Gift, RefreshCw } from 'lucide-react';

interface PlanInfo {
  id: 'pro' | 'premium';
  name: string;
  priceText: string;
  priceValue: number;
  periodText: string;
  orderCode: string;
}

export default function UpgradeLandingView() {
  // Modal state
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 mins
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Countdown timer for QR
  useEffect(() => {
    if (!selectedPlan || isSuccess) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedPlan, isSuccess]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenUpgrade = (planType: 'pro' | 'premium') => {
    const plan: PlanInfo =
      planType === 'pro'
        ? {
            id: 'pro',
            name: 'Gói tài khoản Pro VIP',
            priceText: '50,000 VNĐ',
            priceValue: 50000,
            periodText: '1 tháng',
            orderCode: `IVVIP_PRO_${Math.floor(100000 + Math.random() * 900000)}`,
          }
        : {
            id: 'premium',
            name: 'Gói tài khoản Premium VIP',
            priceText: '500,000 VNĐ',
            priceValue: 500000,
            periodText: '1 năm (12 tháng)',
            orderCode: `IVVIP_PRE_${Math.floor(100000 + Math.random() * 900000)}`,
          };

    setSelectedPlan(plan);
    setCountdown(900);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã quà tặng hoặc voucher.');
      return;
    }
    const upper = voucherCode.trim().toUpperCase();
    if (upper === 'TOPCV2026' || upper === 'INTERVUEVIP' || upper === 'PROVIP') {
      setVoucherError('');
      setVoucherSuccess(true);
    } else {
      setVoucherError('Mã kích hoạt không hợp lệ hoặc đã hết hạn.');
      setVoucherSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#333] antialiased">
      {/* =========================================================================
          KHỐI 1: HEADER BANNER (100% TopCV Match - Thanh lịch, không chứa thông tin user thừa)
          ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[#eef2f6] bg-[#f2fbf6] px-4 py-12 text-center">
        {/* Subtle decorative background curves */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-1.5 text-[15px] font-bold tracking-wider text-[#1e293b] uppercase sm:text-[17px]">
            NÂNG CẤP TÀI KHOẢN
          </p>
          <h1 className="m-0 text-[28px] leading-tight font-extrabold text-[#00b14f] sm:text-[34px] md:text-[36px]">
            Mở khóa nhiều quyền lợi hơn
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-relaxed text-[#64748b]">
            Nâng tầm hồ sơ ứng tuyển, loại bỏ mọi giới hạn tải CV và tiếp cận nhanh chóng với các Nhà tuyển dụng hàng
            đầu.
          </p>
        </div>
      </section>

      {/* =========================================================================
          KHỐI 2: BẢNG SO SÁNH 6 CỘT CHUẨN TOPCV (TRAU CHUỐT TỪNG CHI TIẾT)
          ========================================================================= */}
      <div className="w-full bg-white px-2 py-10 sm:px-4">
        <div className="mx-auto max-w-[1360px] overflow-x-auto pb-4">
          <div className="flex min-w-[1100px] items-start justify-center gap-1.5">
            {/* -------------------------------------------------------------
                CỘT 1: HEADER (Loại tài khoản & Danh mục quyền lợi)
                ------------------------------------------------------------- */}
            <div className="w-[380px] shrink-0 overflow-hidden rounded-2xl border border-[#eef2f6] bg-white shadow-xs">
              <div className="flex h-[88px] items-center border-b border-[#eee] bg-[#fafbfc] px-5 text-[17px] font-bold text-[#1e293b]">
                Loại tài khoản
              </div>
              <ul className="divide-y divide-[#eee] text-[14px] text-[#333]">
                <li className="flex h-[48px] items-center px-5 font-normal">Thời hạn sử dụng</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Số lượng CV</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Số lượng Cover Letter</li>
                <li className="flex h-[48px] items-center px-5 font-normal">
                  Thời gian chờ khi tải CV và Cover Letter
                </li>
                <li className="flex h-[48px] items-center px-5 font-normal">Ưu tiên đẩy Top hiển thị với NTD</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Biểu tượng xác minh tài khoản</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Sử dụng mẫu CV Cao Cấp</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Sử dụng mẫu Cover Letter Cao Cấp</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Ẩn biểu tượng ©intervue.vn</li>
                <li className="flex h-[48px] items-center px-5 font-normal">Gói quà tặng từ đối tác Gitiho</li>
                <li className="flex h-[48px] items-center bg-[#fafbfc]/50 px-5 text-[13px] text-[#555]">
                  <span className="flex items-center gap-1.5 pl-4">
                    <Minus className="h-3.5 w-3.5 text-[#94a3b8]" />
                    Tài khoản PRO trị giá 299K.
                    <a
                      href="https://gitiho.com/thanh-vien-pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 font-bold text-[#00b14f] hover:underline"
                    >
                      Tìm hiểu thêm
                    </a>
                  </span>
                </li>
                <li className="flex h-[48px] items-center bg-[#fafbfc]/50 px-5 text-[13px] text-[#555]">
                  <span className="flex items-center gap-1.5 pl-4">
                    <Minus className="h-3.5 w-3.5 text-[#94a3b8]" />
                    Khoá học Tin học VP:
                    <span className="font-bold text-[#00b14f]">Word</span> /
                    <span className="font-bold text-[#00b14f]">Excel</span> /
                    <span className="font-bold text-[#00b14f]">Power Point</span>
                  </span>
                </li>
                {/* Special competition row (h-[80px]) */}
                <li className="flex h-[80px] items-center justify-between border-y border-emerald-100 bg-[#f2fbf6] px-5 font-normal">
                  <span className="text-[14px] leading-snug text-[#1e293b]">
                    Thông tin mức độ cạnh tranh <br />
                    <span className="text-[12px] text-[#64748b]">(trên ứng dụng di động)</span>
                  </span>
                  <div className="flex items-center gap-1 rounded bg-[#00b14f] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>Mới</span>
                  </div>
                </li>
              </ul>
              {/* Bottom footer buffer */}
              <div className="flex h-[120px] items-center border-t border-[#eee] bg-[#fafbfc] px-5 text-[13px] text-[#64748b]">
                Chọn gói phù hợp với mục tiêu ứng tuyển
              </div>
            </div>

            {/* -------------------------------------------------------------
                CỘT 2: GÓI THƯỜNG (Miễn phí)
                ------------------------------------------------------------- */}
            <div className="w-[172px] shrink-0 overflow-hidden rounded-2xl border border-[#eef2f6] bg-white text-center shadow-xs transition-all hover:border-slate-300">
              <div className="flex h-[88px] flex-col items-center justify-center border-b border-[#eee] bg-white px-2">
                <span className="text-[14px] text-[#64748b]">Thường</span>
                <span className="mt-1 text-[17px] font-bold text-[#1e293b]">Miễn phí</span>
              </div>
              <ul className="divide-y divide-[#eee] text-[14px] text-[#333]">
                <li className="flex h-[48px] items-center justify-center text-[#64748b]">Vĩnh viễn</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">6</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">6</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">5s</li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-[#fafbfc]/50">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-[#fafbfc]/50">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[80px] items-center justify-center border-y border-emerald-100 bg-[#f2fbf6] px-2 text-[14px] text-[#475569]">
                  3 việc làm
                </li>
              </ul>
              <div className="flex h-[120px] items-center justify-center border-t border-[#eee] p-4 text-[13px] text-[#94a3b8]">
                Gói mặc định
              </div>
            </div>

            {/* -------------------------------------------------------------
                CỘT 3: GÓI ĐÃ XÁC THỰC (Miễn phí)
                ------------------------------------------------------------- */}
            <div className="w-[172px] shrink-0 overflow-hidden rounded-2xl border border-[#eef2f6] bg-white text-center shadow-xs transition-all hover:border-slate-300">
              <div className="flex h-[88px] flex-col items-center justify-center border-b border-[#eee] bg-white px-2">
                <span className="text-[14px] text-[#64748b]">Đã xác thực</span>
                <span className="mt-1 text-[17px] font-bold text-[#1e293b]">Miễn phí</span>
              </div>
              <ul className="divide-y divide-[#eee] text-[14px] text-[#333]">
                <li className="flex h-[48px] items-center justify-center text-[#64748b]">Vĩnh viễn</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">6</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">6</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">5s</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#00b14f]">1 lần/tuần</li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-[#fafbfc]/50">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-[#fafbfc]/50">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[80px] items-center justify-center border-y border-emerald-100 bg-[#f2fbf6] px-2 text-[14px] text-[#475569]">
                  3 việc làm
                </li>
              </ul>
              <div className="flex h-[120px] items-center justify-center border-t border-[#eee] p-4 text-[13px] font-bold text-[#00b14f]">
                Đang kích hoạt
              </div>
            </div>

            {/* -------------------------------------------------------------
                CỘT 4: GÓI PRO VIP (50,000 VNĐ - Nổi bật nhất)
                ------------------------------------------------------------- */}
            <div className="relative w-[185px] shrink-0 overflow-hidden rounded-2xl border-2 border-[#00b14f] bg-white text-center shadow-lg shadow-emerald-500/10">
              <div className="flex h-[88px] flex-col items-center justify-center border-b border-[#eee] bg-emerald-50/40 px-2">
                <span className="mb-0.5 text-[10.5px] font-bold tracking-wider text-[#00873c] uppercase">
                  ★ PHỔ BIẾN NHẤT
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold text-[#00b14f]">Pro</span>
                  <span className="rounded bg-[#00b14f] px-2 py-0.5 text-[12px] font-bold text-white shadow-2xs">
                    VIP
                  </span>
                </div>
                <span className="mt-0.5 text-[16px] font-bold text-[#1e293b]">50,000 VNĐ</span>
              </div>

              <ul className="divide-y divide-[#eee] text-[14px] text-[#333]">
                <li className="flex h-[48px] items-center justify-center font-medium text-[#1e293b]">1 tháng</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#00b14f]">12</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#00b14f]">12</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#00b14f]">3s</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#00b14f]">1 lần/ngày</li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-emerald-50/20">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-emerald-50/20">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[80px] items-center justify-center border-y border-emerald-100 bg-[#f2fbf6] px-2 text-[14px] font-bold text-[#00b14f]">
                  Không giới hạn việc làm
                </li>
              </ul>

              <div className="flex h-[120px] items-center justify-center border-t border-[#eee] bg-emerald-50/15 p-3.5">
                <button
                  type="button"
                  onClick={() => handleOpenUpgrade('pro')}
                  className="w-full rounded-xl bg-[#00b14f] px-3 py-3 text-[15px] font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-[#009643] hover:shadow-emerald-500/30"
                >
                  Nâng cấp Pro
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------
                CỘT 5: GÓI EDUCATION VIP (500,000 VNĐ)
                ------------------------------------------------------------- */}
            <div className="w-[172px] shrink-0 overflow-hidden rounded-2xl border border-[#eef2f6] bg-white text-center shadow-xs transition-all hover:border-slate-300">
              <div className="flex h-[88px] flex-col items-center justify-center border-b border-[#eee] bg-white px-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-bold text-[#00b14f]">Education</span>
                  <span className="rounded bg-[#00b14f] px-2 py-0.5 text-[11px] font-bold text-white">VIP</span>
                </div>
                <span className="mt-1 text-[16px] font-bold text-[#1e293b]">500,000 VNĐ</span>
              </div>
              <ul className="divide-y divide-[#eee] text-[14px] text-[#333]">
                <li className="flex h-[48px] items-center justify-center text-[#475569]">1 năm</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">12</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">12</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-[#1e293b]">3s</li>
                <li className="flex h-[48px] items-center justify-center">
                  <span className="h-0.5 w-4 rounded-full bg-[#dde5e8]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-[#fafbfc]/50">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-[#fafbfc]/50">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[80px] items-center justify-center border-y border-emerald-100 bg-[#f2fbf6] px-2 text-[14px] text-[#475569]">
                  3 việc làm
                </li>
              </ul>
              <div className="flex h-[120px] flex-col items-center justify-center border-t border-[#eee] p-3 text-[12px] leading-tight text-[#64748b]">
                <p>Nhận qua chương trình liên kết của InterVue & cơ sở đào tạo.</p>
                <a href="#lien-he-dao-tao" className="mt-1 font-bold text-[#00b14f] hover:underline">
                  Tìm hiểu thêm
                </a>
              </div>
            </div>

            {/* -------------------------------------------------------------
                CỘT 6: GÓI PREMIUM VIP (500,000 VNĐ - Cao cấp nhất)
                ------------------------------------------------------------- */}
            <div className="relative w-[185px] shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400 bg-white text-center shadow-lg shadow-amber-500/10">
              <div className="flex h-[88px] flex-col items-center justify-center border-b border-[#eee] bg-amber-50/30 px-2">
                <span className="mb-0.5 text-[10.5px] font-bold tracking-wider text-amber-700 uppercase">
                  ★ CAO CẤP NHẤT
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold text-amber-600">Premium</span>
                  <span className="rounded bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[12px] font-bold text-white shadow-2xs">
                    VIP
                  </span>
                </div>
                <span className="mt-0.5 text-[16px] font-bold text-[#1e293b]">500,000 VNĐ</span>
              </div>

              <ul className="divide-y divide-[#eee] text-[14px] text-[#333]">
                <li className="flex h-[48px] items-center justify-center font-medium text-[#1e293b]">1 năm</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-amber-600">20</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-amber-600">20</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-amber-600">1s</li>
                <li className="flex h-[48px] items-center justify-center font-bold text-amber-600">1 lần/ngày</li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-amber-50/20">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[48px] items-center justify-center bg-amber-50/20">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00b14f]" />
                </li>
                <li className="flex h-[80px] items-center justify-center border-y border-emerald-100 bg-[#f2fbf6] px-2 text-[14px] font-bold text-[#00b14f]">
                  Không giới hạn việc làm
                </li>
              </ul>

              <div className="flex h-[120px] items-center justify-center border-t border-[#eee] bg-amber-50/15 p-3.5">
                <button
                  type="button"
                  onClick={() => handleOpenUpgrade('premium')}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-3 text-[15px] font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-amber-700"
                >
                  Nâng cấp Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KHỐI 3: LƯU Ý & HỖ TRỢ THANH TOÁN (100% TopCV Match)
          ========================================================================= */}
      <section className="mx-auto mt-2 mb-10 max-w-4xl px-4 text-center">
        <p className="text-[14.5px] text-[#333]">
          <strong className="text-[#111]">Lưu ý: </strong>
          <span>Sau khi hết thời hạn sử dụng, bạn vẫn có thể chỉnh sửa mẫu CV đã tạo như bình thường.</span>
        </p>
        <p className="mt-2 text-[14px] text-[#475569]">
          Nếu có vấn đề về thanh toán và nâng cấp tài khoản vui lòng liên hệ:{' '}
          <strong>
            <a href="mailto:hotro@intervue.vn" className="text-[#111] hover:text-[#00b14f] hover:underline">
              hotro@intervue.vn
            </a>
          </strong>{' '}
          hoặc hotline:{' '}
          <strong>
            <a href="tel:1900068889" className="text-[#111] hover:text-[#00b14f] hover:underline">
              1900 068 889 | Nhánh 2
            </a>
          </strong>{' '}
          (Giờ hành chính)
        </p>
      </section>

      {/* =========================================================================
          KHỐI 4: KÍCH HOẠT MÃ QUÀ TẶNG / VOUCHER
          ========================================================================= */}
      <section className="border-t border-[#f1f5f9] bg-[#f8fafc] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#00b14f]" />
                <h3 className="text-[17px] font-bold text-[#1e293b]">Bạn có mã quà tặng hoặc voucher VIP?</h3>
              </div>
              <p className="mt-1 text-[13.5px] text-[#64748b]">
                Nhập mã kích hoạt được tặng từ các chương trình hoặc đối tác để mở khóa VIP miễn phí.
              </p>
            </div>

            <form onSubmit={handleApplyVoucher} className="flex gap-2 sm:shrink-0">
              <input
                type="text"
                placeholder="Nhập mã (VD: TOPCV2026)"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="w-48 rounded-xl border border-slate-300 px-3 py-2 text-[13.5px] outline-none focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] sm:w-56"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#00b14f] px-4 py-2 text-[13.5px] font-bold text-white transition hover:bg-[#008f3f]"
              >
                Áp dụng
              </button>
            </form>
          </div>

          {voucherError && <p className="mt-3 text-[13px] font-medium text-red-500">{voucherError}</p>}

          {voucherSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13.5px] font-medium text-[#00873c]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00b14f]" />
              <span>Mã hợp lệ! Bạn được tặng 01 tháng sử dụng gói Pro VIP miễn phí.</span>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          KHỐI 5: CÂU HỎI THƯỜNG GẶP (FAQ ACCORDIONS)
          ========================================================================= */}
      <section className="border-t border-[#eee] bg-white px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1e293b]">Câu hỏi thường gặp khi nâng cấp VIP</h2>
            <p className="mt-1.5 text-[14px] text-[#64748b]">
              Giải đáp các thắc mắc phổ biến về quy trình thanh toán, kích hoạt và quyền lợi
            </p>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {[
              {
                q: 'Sau khi thanh toán, bao lâu tài khoản của tôi sẽ được nâng cấp?',
                a: 'Hệ thống kích hoạt hoàn toàn tự động. Sau khi bạn chuyển khoản hoặc quét mã QR thành công, tài khoản sẽ được nâng cấp quyền lợi VIP ngay lập tức trong vòng 30 giây đến 1 phút.',
              },
              {
                q: 'Gói quà tặng từ đối tác Gitiho được nhận và sử dụng thế nào?',
                a: 'Sau khi nâng cấp Pro hoặc Premium VIP, hệ thống sẽ tự động gửi mã kích hoạt tài khoản PRO Gitiho và quyền truy cập 3 khóa học Tin học văn phòng (Word, Excel, PowerPoint) vào email đăng ký tài khoản của bạn.',
              },
              {
                q: 'Khi hết hạn sử dụng gói VIP, các CV đã tạo có bị mất không?',
                a: 'Không. Toàn bộ CV và Cover Letter bạn đã tạo trong thời gian VIP vẫn được lưu trữ vĩnh viễn và bạn vẫn có thể chỉnh sửa, tải về miễn phí như bình thường.',
              },
              {
                q: 'Tôi có thể xuất hóa đơn VAT điện tử cho doanh nghiệp không?',
                a: 'Có. InterVue hỗ trợ xuất hóa đơn điện tử VAT đầy đủ. Sau khi thanh toán, bạn vui lòng gửi thông tin công ty và mã số thuế qua email hotro@intervue.vn để được hỗ trợ xuất hóa đơn trong vòng 24h làm việc.',
              },
              {
                q: 'Nếu gặp sự cố trong quá trình nâng cấp, tôi liên hệ ai?',
                a: 'Bạn vui lòng gửi email về hotro@intervue.vn kèm theo mã ứng viên và ảnh chụp chuyển khoản, hoặc gọi điện trực tiếp tới tổng đài 1900 068 889 (nhánh 2) trong giờ hành chính để được hỗ trợ kích hoạt thủ công.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50"
                  >
                    <span className="pr-4 text-[15px] font-bold text-[#263a4d]">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-[#00b14f]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#94a3b8]" />
                    )}
                  </button>
                  {isOpen && <div className="px-5 pt-1 pb-5 text-[14px] leading-relaxed text-[#64748b]">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODAL THANH TOÁN DỊCH VỤ (TopCV modal-service-payment Spec)
          ========================================================================= */}
      {selectedPlan && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <span className="text-[13px] text-[#64748b]">Thanh toán dịch vụ: </span>
                <span className="text-[15px] font-bold text-[#00b14f]">{selectedPlan.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              {isSuccess ? (
                /* Thành công */
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#00b14f]">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#1e293b]">Thanh toán thành công!</h3>
                  <p className="mt-2 text-[14px] text-[#64748b]">
                    Chúc mừng bạn đã kích hoạt thành công <strong>{selectedPlan.name}</strong>. Mọi đặc quyền VIP đã
                    được áp dụng ngay cho tài khoản của bạn.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="mt-6 rounded-xl bg-[#00b14f] px-8 py-3 text-[14px] font-bold text-white transition hover:bg-[#008f3f]"
                  >
                    Bắt đầu trải nghiệm ngay
                  </button>
                </div>
              ) : (
                /* Giao diện quét mã QR */
                <div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[#64748b]">Tổng giá trị đơn hàng:</span>
                      <span className="text-xl font-extrabold text-[#00b14f]">{selectedPlan.priceText}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[12.5px] text-[#64748b]">
                      <span>Thời hạn sử dụng:</span>
                      <span className="font-semibold text-[#1e293b]">{selectedPlan.periodText}</span>
                    </div>
                  </div>

                  {/* QR Box & Timer */}
                  <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-5 text-center">
                    <p className="text-[13.5px] font-semibold text-[#1e293b]">
                      Sử dụng <span className="text-[#00b14f]">Ứng dụng ngân hàng</span> hoặc{' '}
                      <span className="text-[#d82d8b]">Ví MoMo</span> để quét mã
                    </p>

                    <div className="mx-auto mt-4 flex h-48 w-48 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247Napas|${selectedPlan.orderCode}|${selectedPlan.priceValue}|InterVue`}
                        alt="QR Code thanh toán"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-[#64748b]">
                      <span>Mã QR hết hạn trong:</span>
                      <span className="font-mono font-bold text-red-500">{formatCountdown(countdown)}</span>
                    </div>
                  </div>

                  {/* Chi tiết chuyển khoản */}
                  <div className="mt-5 space-y-2.5 text-[13px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[#64748b]">Ngân hàng nhận:</span>
                      <span className="font-bold text-[#1e293b]">MB Bank (Quân Đội)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[#64748b]">Số tài khoản:</span>
                      <span className="font-mono font-bold text-[#00b14f]">882199998888</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[#64748b]">Chủ tài khoản:</span>
                      <span className="font-bold text-[#1e293b]">CONG TY CP INTERVUE VIET NAM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748b]">Nội dung chuyển khoản:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#1e293b]">
                        <span>{selectedPlan.orderCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedPlan.orderCode)}
                          className="rounded p-1 text-[#00b14f] hover:bg-slate-100"
                          title="Sao chép mã"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {copiedCode && <p className="text-right text-[11px] text-[#00b14f]">Đã sao chép nội dung!</p>}
                  </div>

                  {/* 3 bước thanh toán */}
                  <div className="mt-5 space-y-1.5 rounded-xl bg-slate-50 p-3.5 text-[12px] text-[#64748b]">
                    <p className="font-semibold text-[#1e293b]">3 bước thanh toán đơn giản:</p>
                    <p>1. Mở app ngân hàng hoặc MoMo trên điện thoại</p>
                    <p>2. Chọn tính năng &quot;Quét mã QR&quot; và quét mã ở trên</p>
                    <p>3. Kiểm tra đúng số tiền và xác nhận chuyển tiền</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            {!isSuccess && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-lg px-4 py-2 text-[13.5px] font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-xl bg-[#00b14f] px-6 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#008f3f] disabled:opacity-50"
                >
                  {isProcessing && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <span>{isProcessing ? 'Đang kiểm tra...' : 'Tôi đã hoàn tất thanh toán'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

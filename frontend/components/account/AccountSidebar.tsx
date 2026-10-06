'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpCircle,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  KeyRound,
  LogOut,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    href: '/account',
    label: 'Cài đặt tìm việc & CV',
    icon: Briefcase,
  },
  {
    href: '/upgrade',
    label: 'Nâng cấp tài khoản VIP',
    icon: Sparkles,
  },
  {
    href: '/account/security',
    label: 'Bảo mật tài khoản',
    icon: ShieldCheck,
  },
  {
    href: '/account/password',
    label: 'Đổi mật khẩu',
    icon: KeyRound,
  },
  {
    href: '/account/two-factor',
    label: 'Xác thực 2 bước (2FA)',
    icon: Smartphone,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const [isSuggestJob, setIsSuggestJob] = useState(false);
  const [isJobSeeking, setIsJobSeeking] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <aside className="w-full shrink-0 space-y-4 lg:w-80">
      {/* =========================================================================
          KHỐI 1: HỒ SƠ & TRẠNG THÁI TÌM VIỆC (ĐẦY ĐỦ NHƯ TOPCV)
          ========================================================================= */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
        {/* User Profile Header */}
        <div className="flex items-start gap-3.5">
          {/* Avatar with VERIFIED tag and Camera button */}
          <div className="relative shrink-0">
            {/* VERIFIED tag */}
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-[#526477] px-1.5 py-0.5 text-[8.5px] font-bold tracking-wider text-white uppercase shadow-2xs">
              VERIFIED
            </span>

            {/* Avatar circle */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400 ring-2 ring-slate-200/80">
              <User className="h-10 w-10 translate-y-1 text-slate-400" />
            </div>

            {/* Camera edit button */}
            <button
              type="button"
              title="Cập nhật ảnh đại diện"
              className="absolute -right-0.5 -bottom-0.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#00b14f] text-white shadow-sm ring-2 ring-white transition-transform hover:scale-110 hover:bg-[#009643]"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-[#64748b]">Chào bạn trở lại,</p>
            <h3 className="truncate text-[16px] font-bold text-[#263a4d]">An Lâm Hoàng</h3>
            <div className="mt-1">
              <span className="inline-block rounded bg-[#526477] px-2 py-0.5 text-[10.5px] font-semibold text-white">
                Tài khoản đã xác thực
              </span>
            </div>
            <Link
              href="/upgrade"
              className="mt-1.5 inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[11px] font-semibold text-[#263a4d] transition-colors hover:bg-slate-200"
            >
              <ArrowUpCircle className="h-3.5 w-3.5 text-[#00b14f]" />
              <span>Nâng cấp tài khoản</span>
            </Link>
          </div>
        </div>

        {/* 1. Gợi ý việc làm */}
        <div className="mt-4 border-t border-[#f1f5f9] pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold text-[#263a4d]">Gợi ý việc làm</span>
              <button
                type="button"
                title="Bật tính năng nhận thông báo cơ hội việc làm phù hợp"
                className="text-[#94a3b8] hover:text-[#64748b]"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSuggestJob(!isSuggestJob)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-[11.5px] font-bold transition-all ${
                isSuggestJob
                  ? 'border-[#00b14f] bg-emerald-50 text-[#00873c]'
                  : 'border-[#00b14f] text-[#00b14f] hover:bg-emerald-50'
              }`}
            >
              {isSuggestJob ? 'Đang bật' : 'Bật gợi ý'}
            </button>
          </div>
        </div>

        {/* 2. Trạng thái tìm việc */}
        <div className="mt-4 border-t border-[#f1f5f9] pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[13.5px] font-bold ${isJobSeeking ? 'text-[#00873c]' : 'text-[#64748b]'}`}>
              {isJobSeeking ? 'Đang Bật tìm việc' : 'Đang Tắt tìm việc'}
            </span>

            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isJobSeeking}
              onClick={() => setIsJobSeeking(!isJobSeeking)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isJobSeeking ? 'bg-[#00b14f]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  isJobSeeking ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-2.5">
            <p className="text-[11.5px] text-[#64748b]">Khi bật tìm việc:</p>
            <div className="mt-1.5 space-y-1.5 text-[11.5px] leading-relaxed text-[#64748b]">
              <div className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-2 text-slate-400" />
                <span>
                  Nhà tuyển dụng (NTD) có thể <strong className="font-semibold text-[#263a4d]">tìm thấy</strong> và mang
                  đến cho bạn những cơ hội hấp dẫn (Xem thêm tại phần Cho phép NTD tìm kiếm bên dưới).
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-2 text-slate-400" />
                <span>
                  Hồ sơ của bạn sẽ <strong className="font-semibold text-[#263a4d]">hiển thị nổi bật</strong> trên kết
                  quả tìm kiếm của Nhà tuyển dụng.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Cho phép NTD tìm kiếm hồ sơ */}
        <div className="mt-4 border-t border-[#f1f5f9] pt-3.5">
          <h4 className="text-[13.5px] font-bold text-[#263a4d]">Cho phép NTD tìm kiếm hồ sơ</h4>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[#64748b]">
            Bạn chưa có CV nào trên hệ thống. Tạo CV ngay để bắt đầu nhận lời mời kết nối từ các Nhà tuyển dụng uy tín.
          </p>

          <Link
            href="/profile"
            className="mt-2.5 inline-flex items-center justify-center rounded-full border border-[#00b14f] bg-white px-3.5 py-1 text-[12px] font-bold text-[#00b14f] transition-all hover:bg-emerald-50 active:scale-[0.98]"
          >
            Tạo CV ngay
          </Link>

          {/* Info box with expandable details */}
          <div className="mt-3 rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5 text-[11.5px] leading-relaxed text-[#64748b]">
            <p>
              Khi bạn cho phép Nhà tuyển dụng (NTD) tìm kiếm hồ sơ, các NTD uy tín có thể tiếp cận thông tin kinh nghiệm
              làm việc, học vấn, kỹ năng... trên CV của bạn.
            </p>

            <button
              type="button"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="mt-1.5 flex cursor-pointer items-center gap-1 font-semibold text-[#263a4d] hover:text-[#00b14f]"
            >
              <span>Tìm hiểu thêm</span>
              {showMoreInfo ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showMoreInfo && (
              <div className="mt-2 border-t border-slate-200/70 pt-2 text-[11px] text-[#64748b]">
                InterVue cam kết chỉ chia sẻ dữ liệu với các doanh nghiệp đã xác thực danh tính. Bạn có thể thay đổi
                trạng thái này bất kỳ lúc nào trong mục Cài đặt tài khoản.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          KHỐI 2: MENU ĐIỀU HƯỚNG TÀI KHOẢN (QUẢN LÝ TÀI KHOẢN)
          ========================================================================= */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">Quản lý tài khoản</div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                  isActive
                    ? 'border border-[#00b14f]/30 bg-emerald-50/70 font-bold text-[#00873c]'
                    : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#263a4d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#00b14f]' : 'text-[#64748b]'}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="my-2 border-t border-[#f1f5f9]" />

        {/* Quick Link to Recruiter Profile */}
        <Link
          href="/profile"
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#475569] transition-all hover:bg-emerald-50/50 hover:text-[#00b14f]"
        >
          <div className="flex items-center gap-3">
            <User className="h-4.5 w-4.5 shrink-0 text-[#64748b]" />
            <span>Hồ sơ tuyển dụng (Profile)</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-[#94a3b8]" />
        </Link>

        {/* Logout Action */}
        <Link
          href="/login"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Đăng xuất</span>
        </Link>
      </div>

      {/* =========================================================================
          KHỐI 3: BANNER TẢI APP INTERVUE QR CODE (ĐỒNG BỘ THEO MẪU TOPCV)
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0c2e24] via-[#103a2e] to-[#00b14f] p-4 text-white shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* InterVue Brand */}
            <div className="flex items-center gap-1 text-[15px] font-black tracking-tight">
              <span className="text-white">inter</span>
              <span className="text-[#00e066]">vue</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00e066]" />
            </div>

            <div className="mt-2 text-[12.5px] leading-snug font-bold">Tải App InterVue ngay!</div>
            <p className="mt-1 text-[11px] leading-relaxed text-white/80">
              Để không bỏ lỡ bất cứ cơ hội nào từ Nhà tuyển dụng
            </p>
          </div>

          {/* QR Code Container */}
          <div className="shrink-0 rounded-xl bg-white p-1.5 shadow-md">
            <svg
              viewBox="0 0 29 29"
              className="h-16 w-16 text-[#0f2c25]"
              fill="currentColor"
              aria-label="QR Code tải app"
            >
              {/* Top-left position marker */}
              <path d="M2 2h7v7H2V2zm2 2v3h3V4H4z" />
              <rect x="5" y="5" width="1" height="1" />
              {/* Top-right position marker */}
              <path d="M20 2h7v7h-7V2zm2 2v3h3V4h-3z" />
              <rect x="23" y="5" width="1" height="1" />
              {/* Bottom-left position marker */}
              <path d="M2 20h7v7H2v-7zm2 2v3h3v-3H4z" />
              <rect x="5" y="23" width="1" height="1" />
              {/* Matrix pattern dots */}
              <rect x="11" y="3" width="1" height="1" />
              <rect x="13" y="3" width="2" height="1" />
              <rect x="16" y="3" width="1" height="1" />
              <rect x="11" y="5" width="1" height="2" />
              <rect x="14" y="5" width="2" height="1" />
              <rect x="17" y="6" width="1" height="1" />
              <rect x="3" y="11" width="1" height="1" />
              <rect x="5" y="11" width="2" height="1" />
              <rect x="8" y="11" width="1" height="1" />
              <rect x="10" y="10" width="1" height="2" />
              <rect x="12" y="11" width="2" height="1" />
              <rect x="15" y="10" width="2" height="2" />
              <rect x="19" y="11" width="1" height="1" />
              <rect x="22" y="11" width="2" height="1" />
              <rect x="25" y="11" width="1" height="1" />
              <rect x="11" y="14" width="2" height="1" />
              <rect x="14" y="13" width="1" height="2" />
              <rect x="16" y="14" width="2" height="1" />
              <rect x="11" y="17" width="1" height="2" />
              <rect x="13" y="16" width="2" height="1" />
              <rect x="16" y="17" width="1" height="1" />
              <rect x="11" y="21" width="2" height="1" />
              <rect x="14" y="20" width="1" height="2" />
              <rect x="17" y="21" width="2" height="1" />
              <rect x="12" y="24" width="1" height="2" />
              <rect x="15" y="23" width="2" height="1" />
              <rect x="21" y="14" width="2" height="1" />
              <rect x="24" y="15" width="2" height="2" />
              <rect x="20" y="18" width="1" height="2" />
              <rect x="23" y="19" width="2" height="1" />
              <rect x="20" y="23" width="2" height="1" />
              <rect x="24" y="22" width="2" height="2" />
              <rect x="22" y="25" width="2" height="1" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}

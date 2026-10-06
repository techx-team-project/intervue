'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Globe,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile';
}

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: 's-1',
    device: 'Windows 11 PC',
    browser: 'Chrome 124.0',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    lastActive: 'Đang hoạt động',
    isCurrent: true,
    type: 'desktop',
  },
  {
    id: 's-2',
    device: 'iPhone 15 Pro Max',
    browser: 'Safari Mobile 17.4',
    location: 'Hà Nội, Việt Nam',
    lastActive: '3 giờ trước',
    isCurrent: false,
    type: 'mobile',
  },
  {
    id: 's-3',
    device: 'MacBook Pro M3',
    browser: 'Arc Browser 1.39',
    location: 'Đà Nẵng, Việt Nam',
    lastActive: '2 ngày trước',
    isCurrent: false,
    type: 'desktop',
  },
];

export default function AccountSecurityView() {
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [notice, setNotice] = useState('');

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setNotice('Đã đăng xuất phiên thiết bị thành công.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleRevokeOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setNotice('Đã đăng xuất khỏi tất cả các thiết bị khác.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] font-semibold text-[#00873c]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00b14f]" />
          <span>{notice}</span>
        </div>
      )}

      {/* 1. Header & Security Action Checklist */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#00b14f]" />
              <h1 className="text-xl font-black text-[#263a4d] sm:text-2xl">Bảo mật tài khoản</h1>
            </div>
            <p className="mt-1 text-[13.5px] text-[#64748b]">
              Quản lý các biện pháp bảo vệ, thông tin đăng nhập và phiên hoạt động của bạn.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5 text-[12.5px] font-bold text-[#00873c]">
            <CheckCircle2 className="h-4 w-4 text-[#00b14f]" />
            <span>Đã hoàn thành 3/4 việc bảo mật</span>
          </div>
        </div>

        {/* Security Checklist (2 cột tinh gọn, không gạch ngang) */}
        {/* Security Checklist (Không nền card, ô tích + chữ tinh gọn) */}
        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 border-t border-[#f1f5f9] pt-5 sm:grid-cols-2">
          {/* Task 1: Email Verification */}
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00b14f] text-white">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold text-[#263a4d]">Xác minh Email chính</div>
                <div className="truncate text-[12px] text-[#64748b]">nam.nguyen@techx.dev</div>
              </div>
            </div>
            <span className="shrink-0 text-[11.5px] font-semibold text-[#00873c]">Đã hoàn tất</span>
          </div>

          {/* Task 2: Phone Number Linked */}
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00b14f] text-white">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold text-[#263a4d]">Số điện thoại khôi phục</div>
                <div className="truncate text-[12px] text-[#64748b]">0988 ••• 321</div>
              </div>
            </div>
            <span className="shrink-0 text-[11.5px] font-semibold text-[#00873c]">Đã hoàn tất</span>
          </div>

          {/* Task 3: Strong Password */}
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00b14f] text-white">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold text-[#263a4d]">Mật khẩu mạnh an toàn</div>
                <div className="truncate text-[12px] text-[#64748b]">Đã tạo mật khẩu bảo vệ cao</div>
              </div>
            </div>
            <Link
              href="/account/password"
              className="shrink-0 text-[11.5px] font-semibold text-[#64748b] hover:text-[#00b14f] hover:underline"
            >
              Đổi mật khẩu
            </Link>
          </div>

          {/* Task 4: Two-Factor Authentication (2FA) - UNCHECKED */}
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#cbd5e1] bg-white">
                {/* Unchecked box */}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-bold text-[#263a4d]">Xác thực 2 bước (2FA)</div>
                <div className="truncate text-[12px] text-[#64748b]">Qua Authenticator App</div>
              </div>
            </div>
            <Link
              href="/account/two-factor"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#00b14f] px-2.5 py-1 text-[11.5px] font-bold text-white shadow-2xs transition-all hover:bg-[#009643]"
            >
              <span>Kích hoạt</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Security Checklist Items */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#263a4d]">Thiết lập bảo vệ trọng yếu</h2>

        <div className="mt-4 divide-y divide-[#f1f5f9]">
          {/* Email */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#263a4d]">Email tài khoản</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-[#00873c]">
                    Đã xác minh
                  </span>
                </div>
                <div className="text-[13px] text-[#64748b]">nam.nguyen@techx.dev</div>
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#94a3b8]">Mặc định</span>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#263a4d]">Số điện thoại khôi phục</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-[#00873c]">
                    Đã xác minh
                  </span>
                </div>
                <div className="text-[13px] text-[#64748b]">0988 ••• 321</div>
              </div>
            </div>
            <button type="button" className="cursor-pointer text-[13px] font-semibold text-[#00b14f] hover:underline">
              Thay đổi
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#263a4d]">Mật khẩu đăng nhập</div>
                <div className="text-[13px] text-[#64748b]">Lần đổi gần nhất: 45 ngày trước (Mức độ an toàn cao)</div>
              </div>
            </div>
            <Link
              href="/account/password"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#00b14f] hover:underline"
            >
              <span>Đổi mật khẩu</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#263a4d]">Xác thực 2 bước (2FA)</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-800">
                    Chưa kích hoạt
                  </span>
                </div>
                <div className="text-[13px] text-[#64748b]">
                  Yêu cầu mã 6 số từ Google/Microsoft Authenticator khi đăng nhập
                </div>
              </div>
            </div>
            <Link
              href="/account/two-factor"
              className="rounded-full bg-[#00b14f] px-4 py-1.5 text-[13px] font-bold text-white shadow-2xs transition-all hover:bg-[#009643]"
            >
              Kích hoạt ngay
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Active Sessions Management */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#263a4d]">Phiên đăng nhập & Thiết bị đang hoạt động</h2>
            <p className="text-[13px] text-[#64748b]">
              Theo dõi và thu hồi quyền truy cập từ các thiết bị bạn không nhận diện được.
            </p>
          </div>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleRevokeOtherSessions}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[12.5px] font-bold text-rose-700 transition-colors hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Đăng xuất thiết bị khác</span>
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                session.isCurrent
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-[#f1f5f9] bg-[#f8fafc] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    session.isCurrent ? 'bg-[#00b14f]/15 text-[#00b14f]' : 'bg-[#e2e8f0] text-[#64748b]'
                  }`}
                >
                  {session.type === 'desktop' ? <Laptop className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#263a4d]">
                      {session.device} • {session.browser}
                    </span>
                    {session.isCurrent && (
                      <span className="rounded-full bg-[#00b14f] px-2 py-0.5 text-[10px] font-black text-white">
                        Thiết bị này
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[12.5px] text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-[#94a3b8]" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(session.id)}
                  className="cursor-pointer text-[12.5px] font-bold text-rose-600 hover:underline"
                >
                  Đăng xuất
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Security Alerts Preferences */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#263a4d]">Cảnh báo an ninh & Thông báo</h2>

        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <div>
              <div className="text-[14px] font-bold text-[#263a4d]">
                Gửi email khi phát hiện thiết bị hoặc vị trí đăng nhập mới
              </div>
              <div className="text-[12.5px] text-[#64748b]">
                Hệ thống sẽ gửi cảnh báo tức thời tới nam.nguyen@techx.dev kèm địa chỉ IP và vị trí.
              </div>
            </div>
            <input
              type="checkbox"
              checked={loginAlerts}
              onChange={(e) => setLoginAlerts(e.target.checked)}
              className="mt-1 h-5 w-5 rounded accent-[#00b14f]"
            />
          </label>

          <div className="border-t border-[#f1f5f9]" />

          <label className="flex cursor-pointer items-start justify-between gap-4">
            <div>
              <div className="text-[14px] font-bold text-[#263a4d]">
                Gửi mã xác nhận bảo mật khi có thay đổi mật khẩu hoặc 2FA
              </div>
              <div className="text-[12.5px] text-[#64748b]">
                Bắt buộc xác thực OTP trước khi cho phép thay đổi các thiết lập cốt lõi của tài khoản.
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-1 h-5 w-5 rounded accent-[#00b14f]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

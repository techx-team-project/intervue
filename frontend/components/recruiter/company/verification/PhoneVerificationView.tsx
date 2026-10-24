'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { BarChart3, CheckCircle2, Headphones, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function PhoneVerificationView() {
  const { profile, handleVerifyPhone } = useCompanyVerification();

  const [phoneNumber, setPhoneNumber] = useState(profile.phone.phoneNumber || '0896465810');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(!profile.phone.isVerified);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (!isOtpSent || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ!');
      return;
    }
    setIsOtpSent(true);
    setCountdown(60);
    setOtpDigits(['', '', '', '', '', '']);
    toast.success(`Mã OTP xác thực đã được gửi tới số ${phoneNumber}! (Mã thử nghiệm: 123456)`);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số mã OTP!');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      handleVerifyPhone(phoneNumber);
      setIsEditingPhone(false);
      setIsOtpSent(false);
      toast.success('Xác thực số điện thoại thành công!');
    }, 600);
  };

  const breadcrumbItems = [
    { label: 'Bảng tin', href: ROUTES.RECRUITER_DASHBOARD },
    { label: 'Xác thực tài khoản', href: ROUTES.RECRUITER_COMPANY_VERIFICATION },
    { label: 'Xác thực số điện thoại' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-24">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Card matching TopCV employer-verify/phone-verify.png */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white p-8 shadow-md">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Text */}
          <div className="space-y-5 lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#00b14f] uppercase">
              <span>InterVue for Business</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Xác thực số điện thoại <br />
              <span className="text-[#00b14f]">nhà tuyển dụng</span>
            </h1>

            {/* 4 bullet points with green checkmarks */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Tăng cường bảo mật</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Tăng khả năng hiển thị tin tuyển dụng</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Tuyển dụng an tâm</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b14f] text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Tăng tỷ lệ hồ sơ ứng tuyển</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup Illustration */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-64 rounded-3xl border-4 border-slate-800 bg-white p-4 shadow-2xl">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#00b14f]">
                  <Lock className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Mã bảo mật OTP</div>
                  <div className="mt-1 flex justify-center gap-1.5">
                    {['•', '•', '•', '•', '•', '•'].map((dot, idx) => (
                      <span
                        key={idx}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 text-xs font-bold text-[#00b14f]"
                      >
                        {dot}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#00b14f] py-2 text-xs font-bold text-white shadow-xs">
                  Xác thực thành công
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Verification Card */}
      <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-md lg:p-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Cập nhật và xác thực số điện thoại</h2>
          <p className="text-xs text-slate-500">
            Mã OTP gồm 6 chữ số sẽ được gửi qua SMS đến số điện thoại của bạn để kích hoạt xác thực.
          </p>
        </div>

        {/* Verification Status or Form */}
        {profile.phone.isVerified && !isEditingPhone ? (
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00b14f] text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-950">
                    Số điện thoại đã xác thực: <span className="font-mono text-base">{profile.phone.phoneNumber}</span>
                  </div>
                  <div className="text-xs text-emerald-700">
                    Tài khoản được bảo vệ ở Cấp 2. Trạng thái hoạt động bình thường.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingPhone(true)}
                className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                Thay đổi số điện thoại
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl space-y-6">
            {/* Input + Send OTP Button */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại (VD: 0896465810)"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="shrink-0 rounded-xl bg-[#00b14f] px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-600 active:scale-95"
              >
                {isOtpSent ? 'Gửi lại mã OTP' : 'Gửi mã xác thực'}
              </button>
            </div>

            {/* OTP Section (Shown after clicking Gửi mã) */}
            {isOtpSent && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Nhập 6 số mã OTP đã gửi đến {phoneNumber}</span>
                  {countdown > 0 ? (
                    <span className="font-semibold text-emerald-700">Gửi lại sau {countdown}s</span>
                  ) : (
                    <button type="button" onClick={handleSendOtp} className="font-bold text-[#00b14f] hover:underline">
                      Gửi lại mã ngay
                    </button>
                  )}
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="h-12 w-11 rounded-xl border border-slate-300 bg-white text-center text-lg font-bold text-slate-900 shadow-xs focus:border-[#00b14f] focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">Mã thử nghiệm hệ thống: 123456</span>
                  <button
                    type="button"
                    onClick={handleConfirmOtp}
                    disabled={isVerifying}
                    className="rounded-xl bg-[#035942] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#024a37] disabled:opacity-50"
                  >
                    {isVerifying ? 'Đang xác thực...' : 'Xác nhận OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits Section (Matching TopCV 3 cards) */}
        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-800">Lợi ích khi xác thực số điện thoại:</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#00b14f]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Tăng cường bảo mật:</span> Bảo vệ tài khoản nhà tuyển
                dụng, chống kẻ xấu giả mạo và lợi dụng tài khoản đăng tin tuyển dụng trái phép.
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-[#00b14f]">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Nâng cao uy tín:</span> Nâng cao mức độ uy tín của thương
                hiệu tuyển dụng, tăng khả năng hiển thị tin tuyển dụng với ứng viên phù hợp, tăng tỷ lệ nộp CV.
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#00b14f]">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Hỗ trợ ưu tiên:</span> Được đội ngũ chuyên viên InterVue
                hỗ trợ nhanh chóng qua số điện thoại đã xác thực khi có vấn đề phát sinh.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

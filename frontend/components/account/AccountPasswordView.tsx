'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';

export default function AccountPasswordView() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password criteria verification
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPassword) return { text: 'Chưa nhập', color: 'text-gray-400', bar: 'bg-gray-200', width: '0%' };
    if (strengthScore <= 1) return { text: 'Yếu', color: 'text-rose-500', bar: 'bg-rose-500', width: '25%' };
    if (strengthScore === 2) return { text: 'Trung bình', color: 'text-amber-500', bar: 'bg-amber-500', width: '50%' };
    if (strengthScore === 3) return { text: 'Khá mạnh', color: 'text-blue-500', bar: 'bg-blue-500', width: '75%' };
    return { text: 'Rất mạnh', color: 'text-emerald-500', bar: 'bg-[#00b14f]', width: '100%' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (strengthScore < 3) {
      setErrorMsg('Mật khẩu mới chưa đạt tiêu chuẩn an toàn tối thiểu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }
    if (newPassword === currentPassword) {
      setErrorMsg('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Đổi mật khẩu tài khoản thành công! Các thiết bị khác đã được đăng xuất an toàn.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-[#00b14f]" />
          <h1 className="text-xl font-black text-[#263a4d] sm:text-2xl">Đổi mật khẩu</h1>
        </div>
        <p className="mt-1 text-[13.5px] text-[#64748b]">
          Để đảm bảo an toàn thông tin hồ sơ và quyền riêng tư, vui lòng đặt mật khẩu mạnh mà bạn chưa từng sử dụng ở
          nơi khác.
        </p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13.5px] font-semibold text-[#00873c]">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00b14f]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-[13.5px] font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Password Form */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mật khẩu hiện tại */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="curr-password" className="text-[13.5px] font-bold text-[#263a4d]">
                Mật khẩu hiện tại
              </label>
              <Link href="/forgot-password" className="text-[12.5px] font-semibold text-[#00b14f] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                id="curr-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full rounded-xl border border-[#dcdfe4] bg-white px-4 py-2.5 pr-11 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-[#9ca3af] hover:text-[#64748b]"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full rounded-xl border border-[#dcdfe4] bg-white px-4 py-2.5 pr-11 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-[#9ca3af] hover:text-[#64748b]"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#64748b]">Độ mạnh mật khẩu:</span>
                  <span className={`font-bold ${strength.color}`}>{strength.text}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                  <div
                    className={`h-full transition-all duration-300 ${strength.bar}`}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full rounded-xl border border-[#dcdfe4] bg-white px-4 py-2.5 pr-11 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-[#9ca3af] hover:text-[#64748b]"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Safety Criteria Checklist */}
          <div className="rounded-xl border border-[#f1f5f9] bg-[#f8fafc] p-4 text-[12.5px]">
            <div className="font-bold text-[#263a4d]">Tiêu chuẩn mật khẩu an toàn:</div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                className={`flex items-center gap-2 ${
                  hasMinLength ? 'font-semibold text-[#00873c]' : 'text-[#64748b]'
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasMinLength ? 'bg-[#00b14f]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Tối thiểu 8 ký tự</span>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  hasUppercase ? 'font-semibold text-[#00873c]' : 'text-[#64748b]'
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasUppercase ? 'bg-[#00b14f]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Ít nhất 1 chữ in hoa (A-Z)</span>
              </div>

              <div
                className={`flex items-center gap-2 ${hasNumber ? 'font-semibold text-[#00873c]' : 'text-[#64748b]'}`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasNumber ? 'bg-[#00b14f]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Ít nhất 1 số (0-9)</span>
              </div>

              <div
                className={`flex items-center gap-2 ${hasSpecial ? 'font-semibold text-[#00873c]' : 'text-[#64748b]'}`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasSpecial ? 'bg-[#00b14f]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Ít nhất 1 ký tự đặc biệt (!@#$)</span>
              </div>
            </div>
          </div>

          {/* Logout other devices checkbox */}
          <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-[#475569]">
            <input
              type="checkbox"
              checked={logoutOtherDevices}
              onChange={(e) => setLogoutOtherDevices(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#00b14f]"
            />
            <span>Đăng xuất khỏi tất cả các thiết bị khác sau khi đổi mật khẩu thành công.</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#00b14f] px-6 py-2.5 text-[14px] font-bold text-white shadow-xs transition-colors hover:bg-[#009643] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Cập nhật mật khẩu</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setErrorMsg('');
              }}
              className="cursor-pointer rounded-full border border-[#e2e8f0] px-5 py-2.5 text-[14px] font-semibold text-[#64748b] transition-colors hover:bg-[#f8fafc]"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

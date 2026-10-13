'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { changePasswordSchema, ChangePasswordFormData } from '@/schemas/auth.schema';

export default function AccountPasswordView() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    logoutOtherDevices: true,
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password criteria verification
  const newPass = formData.newPassword;
  const hasMinLength = newPass.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPass);
  const hasNumber = /[0-9]/.test(newPass);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPass);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPass) return { text: 'Chưa nhập', color: 'text-slate-400', bar: 'bg-slate-200', width: '0%' };
    if (strengthScore <= 1) return { text: 'Yếu', color: 'text-rose-500', bar: 'bg-rose-500', width: '25%' };
    if (strengthScore === 2) return { text: 'Trung bình', color: 'text-amber-500', bar: 'bg-amber-500', width: '50%' };
    if (strengthScore === 3) return { text: 'Khá mạnh', color: 'text-blue-500', bar: 'bg-blue-500', width: '75%' };
    return { text: 'Rất mạnh', color: 'text-emerald-500', bar: 'bg-primary', width: '100%' };
  };

  const strength = getStrengthLabel();

  const handleChange = (field: keyof ChangePasswordFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Zod validation
    const validationResult = changePasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof ChangePasswordFormData;
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Đổi mật khẩu tài khoản thành công! Các thiết bị khác đã được đăng xuất an toàn.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        logoutOtherDevices: true,
      });
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      logoutOtherDevices: true,
    });
    setFieldErrors({});
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="text-primary h-5 w-5" />
          <h1 className="text-xl font-black text-slate-800 sm:text-2xl">Đổi mật khẩu</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Để đảm bảo an toàn thông tin hồ sơ và quyền riêng tư, vui lòng đặt mật khẩu mạnh mà bạn chưa từng sử dụng ở
          nơi khác.
        </p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Password Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mật khẩu hiện tại */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Mật khẩu hiện tại</span>
              <Link href="/forgot-password" className="text-primary text-xs font-semibold hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="curr-password"
              type={showCurrent ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              error={fieldErrors.currentPassword}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label={showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          {/* Mật khẩu mới */}
          <div>
            <Input
              id="new-password"
              label="Mật khẩu mới"
              type={showNew ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              placeholder="Nhập mật khẩu mới"
              error={fieldErrors.newPassword}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {/* Password Strength Meter */}
            {newPass && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                  <span className={`font-bold ${strength.color}`}>{strength.text}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
            <Input
              id="confirm-password"
              label="Xác nhận mật khẩu mới"
              type={showConfirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              error={fieldErrors.confirmPassword}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          {/* Password Safety Criteria Checklist */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
            <div className="font-bold text-slate-800">Tiêu chuẩn mật khẩu an toàn:</div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                className={`flex items-center gap-2 ${
                  hasMinLength ? 'font-semibold text-emerald-700' : 'text-slate-500'
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasMinLength ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Tối thiểu 8 ký tự</span>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  hasUppercase ? 'font-semibold text-emerald-700' : 'text-slate-500'
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasUppercase ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Ít nhất 1 chữ in hoa (A-Z)</span>
              </div>

              <div
                className={`flex items-center gap-2 ${hasNumber ? 'font-semibold text-emerald-700' : 'text-slate-500'}`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasNumber ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Ít nhất 1 chữ số (0-9)</span>
              </div>

              <div
                className={`flex items-center gap-2 ${hasSpecial ? 'font-semibold text-emerald-700' : 'text-slate-500'}`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    hasSpecial ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <Check className="h-2.5 w-2.5 stroke-3" />
                </div>
                <span>Ít nhất 1 ký tự đặc biệt (!@#$)</span>
              </div>
            </div>
          </div>

          {/* Logout other devices checkbox */}
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={formData.logoutOtherDevices}
              onChange={(e) => handleChange('logoutOtherDevices', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
            />
            <span>Đăng xuất khỏi tất cả các thiết bị khác sau khi đổi mật khẩu thành công.</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Cập nhật mật khẩu
            </Button>

            <Button type="button" variant="outline" size="md" onClick={handleReset}>
              Hủy bỏ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

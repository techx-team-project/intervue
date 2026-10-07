'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { registerSchema, RegisterFormData } from '@/schemas/auth.schema';

interface RegisterFormProps {
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  onSuccess?: () => void;
}

export default function RegisterForm({ onSwitchMode, onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedTerms: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Zod Schema Validation
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof RegisterFormData, string>> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof RegisterFormData;
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
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/profile');
      }
    }, 700);
  };

  return (
    <div className="w-full">
      {/* 1. Social Logins: Google, Facebook, Linkedin */}
      <SocialAuthButtons mode="register" />

      {/* 2. Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400 italic">Hoặc đăng ký bằng email</span>
      </div>

      {/* General Error Alert */}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-center text-xs font-medium text-rose-600">
          {errorMsg}
        </div>
      )}

      {/* 3. Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Họ và tên"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Nhập họ và tên của bạn"
          autoComplete="name"
          error={fieldErrors.fullName}
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Nhập email của bạn"
          autoComplete="email"
          error={fieldErrors.email}
        />

        <Input
          label="Số điện thoại"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Nhập số điện thoại (VD: 0912345678)"
          autoComplete="tel"
          error={fieldErrors.phone}
        />

        <Input
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Tối thiểu 6 ký tự"
          autoComplete="new-password"
          error={fieldErrors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="cursor-pointer p-1 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Input
          label="Xác nhận mật khẩu"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="cursor-pointer p-1 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {/* Terms agreement checkbox */}
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={formData.agreedTerms}
              onChange={(e) => handleChange('agreedTerms', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              Tôi đồng ý với{' '}
              <a href="#" className="font-semibold text-emerald-600 hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="font-semibold text-emerald-600 hover:underline">
                Chính sách bảo mật
              </a>{' '}
              của InterVue.
            </span>
          </label>
          {fieldErrors.agreedTerms && (
            <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors.agreedTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Đăng ký tài khoản
        </Button>
      </form>

      {/* Switch to Login Link */}
      <div className="mt-4 text-center text-sm text-slate-700">
        <span>Bạn đã có tài khoản? </span>
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="cursor-pointer font-bold text-emerald-600 hover:underline"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
}

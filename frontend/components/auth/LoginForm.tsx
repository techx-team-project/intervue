'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginSchema, LoginFormData } from '@/schemas/auth.schema';

interface LoginFormProps {
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  onSuccess?: () => void;
}

export default function LoginForm({ onSwitchMode, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: keyof LoginFormData, value: string) => {
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
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof LoginFormData;
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
    }, 600);
  };

  return (
    <div className="w-full">
      {/* 1. Social Logins: Google, Facebook, Linkedin */}
      <SocialAuthButtons mode="login" />

      {/* 2. Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400 italic">Hoặc đăng nhập bằng email</span>
      </div>

      {/* General Error Alert */}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-center text-xs font-medium text-rose-600">
          {errorMsg}
        </div>
      )}

      {/* 3. Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Nhập email của bạn"
          autoComplete="email"
          error={fieldErrors.email}
        />

        {/* Password Field */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-semibold text-slate-800">
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => onSwitchMode('forgot-password')}
              className="cursor-pointer text-xs font-semibold text-emerald-600 transition-colors hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
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
        </div>

        {/* 4. Submit Button */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
        >
          Đăng nhập
        </Button>
      </form>

      {/* 5. Switch to Register Link */}
      <div className="mt-4 text-center text-sm text-slate-700">
        <span>Bạn chưa có tài khoản? </span>
        <button
          type="button"
          onClick={() => onSwitchMode('register')}
          className="cursor-pointer font-bold text-emerald-600 hover:underline"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}

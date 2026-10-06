'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';

interface LoginFormProps {
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  onSuccess?: () => void;
}

export default function LoginForm({ onSwitchMode, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email.');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

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
          <div className="w-full border-t border-dashed border-[#e2e8f0]" />
        </div>
        <span className="relative bg-white px-3 text-[12px] text-[#8c94a0] italic">Hoặc đăng nhập bằng email</span>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-center text-[13px] font-medium text-red-600">
          {errorMsg}
        </div>
      )}

      {/* 3. Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email-input" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
            Email
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            autoComplete="email"
            className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password-input" className="text-[13.5px] font-bold text-[#263a4d]">
              Password
            </label>
            <button
              type="button"
              onClick={() => onSwitchMode('forgot-password')}
              className="cursor-pointer text-[13px] font-semibold text-[#00b14f] transition-colors hover:underline"
            >
              Quên mật khẩu
            </button>
          </div>
          <div className="relative">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 pr-10 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#9ca3af] transition-colors hover:text-[#64748b]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 4. Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#00b14f] py-3 text-[14.5px] font-bold text-white shadow-xs transition-colors hover:bg-[#009643] active:scale-[0.99] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Đăng nhập</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* 5. Switch to Register Link */}
      <div className="mt-4 text-center text-[13.5px] text-[#263a4d]">
        <span>Bạn chưa có tài khoản? </span>
        <button
          type="button"
          onClick={() => onSwitchMode('register')}
          className="cursor-pointer font-bold text-[#00b14f] hover:underline"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}

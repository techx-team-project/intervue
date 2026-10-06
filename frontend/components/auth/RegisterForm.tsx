'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';

interface RegisterFormProps {
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  onSuccess?: () => void;
}

export default function RegisterForm({ onSwitchMode, onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
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
    }, 700);
  };

  return (
    <div className="w-full">
      {/* 1. Social Logins: Google, Facebook, Linkedin */}
      <SocialAuthButtons mode="register" />

      {/* 2. Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-[#e2e8f0]" />
        </div>
        <span className="relative bg-white px-3 text-[12px] text-[#8c94a0] italic">Hoặc đăng ký bằng email</span>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-center text-[13px] font-medium text-red-600">
          {errorMsg}
        </div>
      )}

      {/* 3. Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Họ và tên */}
        <div>
          <label htmlFor="register-fullname" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
            Họ và tên
          </label>
          <input
            id="register-fullname"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên"
            autoComplete="name"
            className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            autoComplete="email"
            className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label htmlFor="register-phone" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
            Số điện thoại
          </label>
          <input
            id="register-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            autoComplete="tel"
            className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="register-password" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
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

        {/* Nhập lại Password */}
        <div>
          <label htmlFor="register-confirm-password" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
            Nhập lại Password
          </label>
          <div className="relative">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 pr-10 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#9ca3af] transition-colors hover:text-[#64748b]"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-2 text-[12px] leading-snug text-[#64748b]">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#00b14f]"
            />
            <span>
              Tôi đã đọc và đồng ý với{' '}
              <span className="font-semibold text-[#00b14f] hover:underline">Điều khoản dịch vụ</span> và{' '}
              <span className="font-semibold text-[#00b14f] hover:underline">Chính sách bảo mật</span> của InterVue.
            </span>
          </label>
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
              <span>Đăng ký</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* 5. Switch to Login Link */}
      <div className="mt-4 text-center text-[13.5px] text-[#263a4d]">
        <span>Bạn đã có tài khoản? </span>
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="cursor-pointer font-bold text-[#00b14f] hover:underline"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
}

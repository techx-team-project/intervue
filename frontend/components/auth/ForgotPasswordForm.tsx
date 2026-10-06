'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
}

export default function ForgotPasswordForm({ onSwitchMode }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(60);
  const canResend = countdown === 0;

  useEffect(() => {
    if (!isSubmitted || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setCountdown(60);
    }, 700);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    alert(`Đã gửi lại liên kết khôi phục mật khẩu tới ${email}`);
  };

  return (
    <div className="w-full">
      <p className="mb-5 text-center text-[13.5px] leading-relaxed text-[#64748b]">
        Nhập email bạn đã đăng ký tài khoản để nhận liên kết đặt lại mật khẩu an toàn.
      </p>

      {/* Success Notification State */}
      {isSubmitted ? (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#00b14f]/15 text-[#00b14f]">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <h3 className="text-[15px] font-bold text-[#1e293b]">Đã gửi liên kết khôi phục</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-[#64748b]">
              Vui lòng kiểm tra hộp thư đến của <strong>{email}</strong> để tạo mật khẩu mới.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className={`text-[13px] font-semibold transition-colors ${
                canResend ? 'cursor-pointer text-[#00b14f] hover:underline' : 'cursor-not-allowed text-[#94a3b8]'
              }`}
            >
              {canResend ? 'Gửi lại email xác nhận' : `Gửi lại sau ${countdown}s`}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-2.5 text-center text-[13px] font-medium text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-[13.5px] font-bold text-[#263a4d]">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              autoComplete="email"
              className="w-full rounded-md border border-[#dcdfe4] bg-white px-3.5 py-2.5 text-[14px] text-[#263a4d] placeholder-[#9ca3af] transition-colors focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#00b14f] py-3 text-[14.5px] font-bold text-white shadow-xs transition-colors hover:bg-[#009643] active:scale-[0.99] disabled:opacity-70"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Gửi liên kết khôi phục</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Return to Login link */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13.5px] font-semibold text-[#00b14f] transition-colors hover:underline"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Quay lại Đăng nhập</span>
        </button>
      </div>
    </div>
  );
}

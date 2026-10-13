'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { forgotPasswordSchema } from '@/schemas/auth.schema';

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
}

export default function ForgotPasswordForm({ onSwitchMode }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
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

    const validationResult = forgotPasswordSchema.safeParse({ email });
    if (!validationResult.success) {
      setFieldError(validationResult.error.issues[0]?.message);
      return;
    }

    setFieldError(undefined);
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
  };

  return (
    <div className="w-full">
      <p className="mb-5 text-center text-sm leading-relaxed text-slate-500">
        Nhập email bạn đã đăng ký tài khoản để nhận liên kết đặt lại mật khẩu an toàn.
      </p>

      {/* Success Notification State */}
      {isSubmitted ? (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800">Đã gửi liên kết khôi phục</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Vui lòng kiểm tra hộp thư đến của <strong>{email}</strong> để tạo mật khẩu mới.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className={`text-sm font-semibold transition-colors ${
                canResend ? 'cursor-pointer text-emerald-600 hover:underline' : 'cursor-not-allowed text-slate-400'
              }`}
            >
              {canResend ? 'Gửi lại email xác nhận' : `Gửi lại sau ${countdown}s`}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-center text-xs font-medium text-rose-600">
              {errorMsg}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldError) setFieldError(undefined);
            }}
            placeholder="Nhập email của bạn"
            autoComplete="email"
            error={fieldError}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="mt-2 w-full rounded-xl py-3 text-sm font-bold"
            rightIcon={<ArrowRight className="h-4 w-4 stroke-[2.5]" />}
          >
            Gửi liên kết khôi phục
          </Button>
        </form>
      )}

      {/* Return to Login link */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:underline"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Quay lại Đăng nhập</span>
        </button>
      </div>
    </div>
  );
}

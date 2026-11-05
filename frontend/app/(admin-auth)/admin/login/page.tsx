'use client';

import { adminAuthApi } from '@/apiRequest/admin-auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { isApiError } from '@/lib/api-error';
import { toAdminSession } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Shield, ShieldAlert, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { toast } from 'sonner';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2FA Challenge State
  const [is2FAStage, setIs2FAStage] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email quản trị và mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminAuthApi.login({ email, password });

      if (res.requiresTwoFactor && res.tempToken) {
        setTempToken(res.tempToken);
        setIs2FAStage(true);
        toast.info('Vui lòng nhập mã xác thực 2 lớp (2FA) để hoàn tất đăng nhập.');
        return;
      }

      if (res.accessToken && res.admin) {
        useAuthStore.getState().setSession(toAdminSession(res), 'admin');
        toast.success('Đăng nhập Quản trị viên thành công!');
        router.replace(redirectUrl);
      }
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === 'ADMIN_ACCESS_REQUIRED' || err.status === 403) {
          setErrorMsg('Tài khoản của bạn không có quyền Quản trị viên (Admin).');
        } else if (err.code === 'INVALID_CREDENTIALS' || err.status === 401) {
          setErrorMsg('Email hoặc mật khẩu không chính xác.');
        } else {
          setErrorMsg(err.message || 'Đăng nhập không thành công.');
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ bảo mật.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!twoFactorCode.trim()) {
      setErrorMsg(useBackupCode ? 'Vui lòng nhập mã khôi phục dự phòng.' : 'Vui lòng nhập mã xác thực 6 chữ số.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminAuthApi.verifyTwoFactor({
        tempToken,
        code: twoFactorCode.trim(),
      });

      if (res.accessToken && res.admin) {
        useAuthStore.getState().setSession(toAdminSession(res), 'admin');
        toast.success('Xác thực 2 lớp thành công! Chào mừng Quản trị viên.');
        router.replace(redirectUrl);
      }
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
      } else {
        setErrorMsg('Lỗi xác thực, vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -ml-[25rem] h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -top-10 right-1/4 h-[25rem] w-[35rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/60 shadow-lg shadow-emerald-900/30">
            <Shield className="h-7 w-7 text-emerald-400" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-white sm:text-3xl">
          InterVue Fortress Admin
        </h2>
        <p className="mt-1.5 text-center text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Cổng Quản Trị Hệ Thống An Toàn Cao
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:px-10">
          {/* Security alert disclaimer */}
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-3.5 text-xs text-slate-300">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <span>
              Khu vực bảo mật cao dành riêng cho Quản trị viên. Toàn bộ thao tác đều được kiểm soát và ghi log IP.
            </span>
          </div>

          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs font-semibold text-rose-300">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {!is2FAStage ? (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Email quản trị viên
                </label>
                <div className="mt-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@intervue.com"
                    required
                    autoFocus
                    className="border-slate-700 bg-slate-950/80 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wider text-slate-300 uppercase">
                    Mật khẩu truy cập
                  </label>
                </div>
                <div className="mt-2">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="border-slate-700 bg-slate-950/80 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
                  leftIcon={<Lock className="h-4 w-4" />}
                >
                  Xác thực danh tính Admin
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handle2FAVerify} className="space-y-5">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/80 text-emerald-400">
                  {useBackupCode ? <KeyRound className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
                </div>
                <h3 className="mt-3 text-base font-bold text-white">
                  {useBackupCode ? 'Xác thực bằng mã khôi phục' : 'Xác thực 2 bước (TOTP 2FA)'}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {useBackupCode
                    ? 'Nhập một trong các mã dự phòng (8 ký tự) đã lưu khi bật 2FA.'
                    : 'Nhập mã 6 chữ số từ Google Authenticator hoặc Microsoft Authenticator.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-300 uppercase">
                  {useBackupCode ? 'Mã dự phòng (Backup Code)' : 'Mã xác thực 6 số'}
                </label>
                <div className="mt-2">
                  <Input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder={useBackupCode ? '8912-4019' : '123456'}
                    required
                    autoFocus
                    maxLength={useBackupCode ? 12 : 6}
                    className="border-slate-700 bg-slate-950/80 text-center font-mono text-lg font-bold tracking-widest text-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Hoàn tất đăng nhập
                </Button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupCode(!useBackupCode);
                      setTwoFactorCode('');
                      setErrorMsg('');
                    }}
                    className="cursor-pointer font-semibold text-emerald-400 hover:underline"
                  >
                    {useBackupCode ? 'Dùng ứng dụng xác thực' : 'Dùng mã dự phòng thay thế'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIs2FAStage(false);
                      setTempToken('');
                      setTwoFactorCode('');
                      setErrorMsg('');
                    }}
                    className="flex cursor-pointer items-center gap-1 font-semibold text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="h-3 w-3" /> Quay lại
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-400">
              ← Trở về trang chủ InterVue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

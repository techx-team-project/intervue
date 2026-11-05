'use client';

import { adminAuthApi } from '@/apiRequest/admin-auth';
import LeftChevronPattern from '@/components/auth/LeftChevronPattern';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { isApiError } from '@/lib/api-error';
import { toAdminSession } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { toast } from 'sonner';

function AdminLoginForm() {
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
      setErrorMsg('Please enter both your administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminAuthApi.login({ email, password });

      if (res.requiresTwoFactorSetup && res.tempToken) {
        toast.info('Mandatory Two-Factor Authentication setup required. Redirecting to security setup...');
        sessionStorage.setItem('admin_2fa_setup_token', res.tempToken);
        window.location.assign(`/admin/two-factor/setup?redirect=${encodeURIComponent(redirectUrl)}`);
        return;
      }

      if (res.requiresTwoFactor && res.tempToken) {
        setTempToken(res.tempToken);
        setIs2FAStage(true);
        toast.info('Please enter your Two-Factor Authentication (2FA) code to continue.');
        return;
      }

      if (res.accessToken && res.admin) {
        useAuthStore.getState().setSession(toAdminSession(res), 'admin');
        toast.success('Admin authentication successful! Welcome to the Admin Console.');
        window.location.assign(redirectUrl);
      }
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === 'ADMIN_ACCESS_REQUIRED' || err.status === 403) {
          setErrorMsg('Access denied: This account does not possess Administrator privileges.');
        } else if (err.code === 'INVALID_CREDENTIALS' || err.status === 401) {
          setErrorMsg('Invalid credentials. Please verify your email and password.');
        } else {
          setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
        }
      } else {
        setErrorMsg('Unable to connect to security gateway. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!twoFactorCode.trim()) {
      setErrorMsg(
        useBackupCode ? 'Please enter your recovery backup code.' : 'Please enter the 6-digit verification code.',
      );
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
        toast.success('Two-factor verification confirmed. Welcome, Administrator.');
        window.location.assign(redirectUrl);
      }
    } catch (err) {
      if (isApiError(err)) {
        setErrorMsg(err.message || 'Invalid or expired verification code.');
      } else {
        setErrorMsg('Verification error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-100/90 px-4 py-8 antialiased sm:py-12">
      {/* Brand accent patterns & ambient lighting */}
      <LeftChevronPattern />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[34rem] w-[34rem] rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-teal-500/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[28px_28px] opacity-25" />

      {/* Unified Elevated Card Container */}
      <main className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10">
        <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Visual Brand & Dynamic Floating Security Showcase */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#022c22] via-[#043d2e] to-[#011a14] p-8 text-white sm:p-10 lg:col-span-5 lg:flex">
            {/* SVG Background Coordinate Grid */}
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="admin-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#34d399" />
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#admin-grid-pattern)" />
              </svg>
            </div>

            {/* Glowing radial atmospheric accents */}
            <div className="pointer-events-none absolute top-12 left-1/2 -ml-32 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 -bottom-16 h-48 w-48 rounded-full bg-teal-400/20 blur-2xl" />

            {/* Header: Transparent Brand Logo & Mini Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.02]">
                <Image
                  src="/intervue-logo-white.png"
                  alt="InterVue"
                  width={140}
                  height={38}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase backdrop-blur-xs">
                <Sparkles className="h-3 w-3 text-emerald-300" />
                Operations
              </span>
            </div>

            {/* Centerpiece Artwork: Multi-Layered Visual Composition with Floating Cards */}
            <div className="relative z-10 my-auto py-6">
              {/* Artwork Container with Glowing Border */}
              <div className="relative mx-auto flex w-full max-w-sm flex-col items-center">
                {/* Background Artwork Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-emerald-400/30 bg-emerald-950/60 shadow-xl shadow-black/40">
                  <Image
                    src="/auth/recruiter-banner-02@2x.png"
                    alt="AI Matching & Platform Governance"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-top opacity-85 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011a14] via-transparent to-black/30" />

                  {/* Glowing center badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/70 px-2.5 py-1 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                    </span>
                    <span className="text-[11px] font-semibold text-white">Live Platform Status</span>
                  </div>
                </div>

                {/* Floating Glassmorphism Card 1: Security Shield */}
                <div className="animate-in fade-in slide-in-from-left-4 absolute -top-4 -left-3 flex items-center gap-2.5 rounded-xl border border-emerald-400/40 bg-slate-900/85 px-3.5 py-2 shadow-xl shadow-black/30 backdrop-blur-md duration-500">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wide text-emerald-300 uppercase">IAM Fortress</p>
                    <p className="text-xs font-bold text-white">Zero-Trust Protected</p>
                  </div>
                </div>

                {/* Floating Glassmorphism Card 2: Real-Time Vector Wave Chart */}
                <div className="animate-in fade-in slide-in-from-right-4 absolute -right-3 -bottom-4 flex items-center gap-3 rounded-xl border border-teal-400/40 bg-slate-900/85 px-3.5 py-2.5 shadow-xl shadow-black/30 backdrop-blur-md duration-700">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-bold tracking-wide text-teal-300 uppercase">Audit Trail</p>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                    {/* Mini SVG Sparkline Wave */}
                    <div className="mt-1 flex items-center gap-1.5">
                      <svg width="48" height="12" viewBox="0 0 48 12" fill="none" className="text-emerald-400">
                        <path
                          d="M1 9L8 4L16 8L24 2L32 7L40 3L47 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-mono text-[10px] font-bold text-white">100% OK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspiring Brand Slogan */}
              <div className="mt-8 text-center">
                <h3 className="text-lg font-black tracking-tight text-white xl:text-xl">Empowering Tech Recruitment</h3>
                <p className="mt-1 text-xs text-emerald-200/80">
                  Intelligent AI verification, audit trails, and platform integrity.
                </p>
              </div>
            </div>

            {/* Left Panel Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-medium text-emerald-200/60">
              <span>InterVue Security Console</span>
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-400" /> High-Assurance
              </span>
            </div>
          </div>

          {/* Right Column: Clean Minimalist Sign In Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
            {/* Mobile Header with transparent logo */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link href="/">
                <Image
                  src="/intervue-logo-transparent.png"
                  alt="InterVue"
                  width={130}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Console</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Sign in</h1>
            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
              Welcome back. Please enter your administrator credentials to continue.
            </p>

            {errorMsg && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
                <span className="shrink-0 font-bold">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {!is2FAStage ? (
              <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase">Work Email</label>
                  <div className="mt-1.5">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@intervue.com"
                      required
                      autoFocus
                      autoComplete="email"
                      leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                      className="border-slate-300 bg-white font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase">Password</label>
                  <div className="mt-1.5">
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      className="border-slate-300 bg-white font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                    leftIcon={<Lock className="h-4 w-4" />}
                  >
                    Sign in to Console
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handle2FAVerify} className="mt-6 space-y-5">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    {useBackupCode ? <KeyRound className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">
                    {useBackupCode ? 'Enter Backup Recovery Code' : 'Two-Factor Authentication'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {useBackupCode
                      ? 'Enter one of your 8-character backup recovery codes generated when 2FA was configured.'
                      : 'Enter the 6-digit verification code from your authenticator app (Google Authenticator, Microsoft Authenticator).'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    {useBackupCode ? 'Backup Recovery Code' : '6-Digit Verification Code'}
                  </label>
                  <div className="mt-1.5">
                    <Input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder={useBackupCode ? '8912-4019' : '123456'}
                      required
                      autoFocus
                      maxLength={useBackupCode ? 12 : 6}
                      className="border-slate-300 bg-white text-center font-mono text-2xl font-bold tracking-widest text-emerald-700 placeholder:text-slate-300 focus:border-emerald-600 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    Verify & Complete Sign In
                  </Button>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setUseBackupCode(!useBackupCode);
                        setTwoFactorCode('');
                        setErrorMsg('');
                      }}
                      className="cursor-pointer font-semibold text-emerald-600 hover:underline"
                    >
                      {useBackupCode ? 'Use authenticator app' : 'Use backup recovery code instead'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIs2FAStage(false);
                        setTempToken('');
                        setTwoFactorCode('');
                        setErrorMsg('');
                      }}
                      className="flex cursor-pointer items-center gap-1 font-semibold text-slate-500 hover:text-slate-800"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Form Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium">
                <Lock className="h-3 w-3 text-emerald-600" /> End-to-end encrypted session
              </span>
              <Link href="/" className="font-medium text-slate-500 transition hover:text-slate-800">
                ← Return to InterVue
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100/80" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

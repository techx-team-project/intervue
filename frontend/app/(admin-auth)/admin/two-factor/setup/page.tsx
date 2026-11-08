'use client';

import { adminAuthApi } from '@/apiRequest/admin-auth';
import LeftChevronPattern from '@/components/auth/LeftChevronPattern';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isApiError } from '@/lib/api-error';
import { toAdminSession } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  KeyRound,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { toast } from 'sonner';

function getStoredSetupToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('admin_2fa_setup_token');
}

function AdminTwoFactorSetupForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
  const tokenFromQuery = searchParams.get('tempToken');

  const {
    data: setupData,
    isLoading: isLoadingSetup,
    error: queryError,
  } = useQuery({
    queryKey: ['admin', '2fa-setup', tokenFromQuery],
    queryFn: () => {
      const token = tokenFromQuery || getStoredSetupToken();
      if (!token) throw new Error('Missing setup token');
      return adminAuthApi.setupTwoFactor(token);
    },
    retry: false,
  });

  const setupError = queryError
    ? isApiError(queryError)
      ? queryError.message
      : 'Your setup session has expired or is invalid. Please sign in again.'
    : '';

  // Step 2 & 3 state
  const [hasCopiedSecret, setHasCopiedSecret] = useState(false);
  const [hasCopiedCodes, setHasCopiedCodes] = useState(false);
  const [hasConfirmedBackup, setHasConfirmedBackup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const handleCopySecret = async () => {
    if (!setupData?.secret) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setHasCopiedSecret(true);
      toast.success('Secret key copied to clipboard.');
      setTimeout(() => setHasCopiedSecret(false), 2500);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const handleCopyCodes = async () => {
    if (!setupData?.backupCodes?.length) return;
    try {
      await navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
      setHasCopiedCodes(true);
      toast.success('All 8 emergency recovery codes copied to clipboard.');
      setTimeout(() => setHasCopiedCodes(false), 2500);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const handleDownloadCodes = () => {
    if (!setupData?.backupCodes?.length) return;
    const content = [
      '====================================================',
      'INTERVUE FORTRESS ADMIN CONSOLE - 2FA RECOVERY CODES',
      '====================================================',
      `Generated at: ${new Date().toISOString()}`,
      '',
      'INSTRUCTIONS:',
      '1. Store this file in a secure location (password manager, encrypted drive, or printout).',
      '2. Each recovery code can only be used ONCE to access your Administrator account.',
      '3. Once used, an emergency code is burned and permanently invalidated.',
      '',
      'EMERGENCY RECOVERY CODES:',
      ...setupData.backupCodes.map((code, idx) => `  [${idx + 1}] ${code}`),
      '',
      '====================================================',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intervue-admin-recovery-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Emergency recovery codes downloaded successfully.');
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setVerifyError('Please enter the 6-digit verification code from your authenticator app.');
      return;
    }

    if (!hasConfirmedBackup) {
      setVerifyError('Please confirm that you have saved your emergency recovery codes.');
      return;
    }

    const token = tokenFromQuery || getStoredSetupToken();
    if (!token) {
      setVerifyError('Your setup session has expired or is invalid. Please sign in again.');
      return;
    }

    setIsActivating(true);
    try {
      const res = await adminAuthApi.confirmTwoFactor({
        tempToken: token,
        code: verificationCode.trim(),
      });

      if (res.accessToken && res.admin) {
        sessionStorage.removeItem('admin_2fa_setup_token');
        useAuthStore.getState().setSession(toAdminSession(res), 'admin');
        toast.success('Two-factor authentication successfully activated! Welcome, Administrator.');
        window.location.assign(redirectUrl);
      }
    } catch (err) {
      if (isApiError(err)) {
        setVerifyError(
          err.message || 'Invalid verification code. Please check your authenticator clock and try again.',
        );
      } else {
        setVerifyError('An unexpected verification error occurred. Please try again.');
      }
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="bg-surface-container-high/90 relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 antialiased sm:py-12">
      {/* Ambient background accents */}
      <LeftChevronPattern />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[28px_28px] opacity-25" />

      {/* Elevated Card Container */}
      <main className="border-outline-variant/90 shadow-elevation-2 relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border bg-white shadow-slate-900/10">
        <div className="grid min-h-[660px] grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Visual Brand & Security Governance */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#022c22] via-[#043d2e] to-[#011a14] p-8 text-white sm:p-10 lg:col-span-5 lg:flex">
            {/* SVG Grid */}
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="admin-setup-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#34d399" />
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#admin-setup-grid)" />
              </svg>
            </div>

            {/* Glowing orbs */}

            {/* Header: Brand Logo */}
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Zero-Trust IAM
              </span>
            </div>

            {/* Middle: Title & Security Showcase */}
            <div className="relative z-10 my-auto py-8">
              <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-emerald-400 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                MANDATORY SECURITY ONBOARDING
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Enforced Two-Factor Authentication
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-emerald-100/80">
                To safeguard enterprise legal dossiers, platform identity governance, and high-trust candidate data, all
                administrators are strictly required to pair an RFC 6238 TOTP authenticator device.
              </p>

              {/* Security Pillars Cards */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">App & Hardware TOTP</h4>
                    <p className="text-label-sm text-emerald-100/70">
                      Compatible with Google Authenticator, 1Password, Microsoft Authenticator & Authy.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Cryptographic Recovery Vault</h4>
                    <p className="text-label-sm text-emerald-100/70">
                      8 single-use hashed recovery codes to prevent permanent account lockout.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-label-sm relative z-10 border-t border-emerald-500/20 pt-4 text-emerald-200/60">
              InterVue Enterprise Fortress Realm · NIST SP 800-63B Compliant
            </div>
          </div>

          {/* Right Column: 3-Step Wizard */}
          <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-7">
            {isLoadingSetup ? (
              <div className="my-auto flex flex-col items-center justify-center py-16 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                <p className="text-on-surface mt-4 text-sm font-semibold">Initiating cryptographic 2FA setup...</p>
                <p className="text-on-surface-variant mt-1 text-xs">
                  Generating secure seed and emergency recovery vault.
                </p>
              </div>
            ) : setupError ? (
              <div className="my-auto flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <h3 className="text-on-surface mt-4 text-base font-bold">Setup Session Expired</h3>
                <p className="text-on-surface-variant mt-1.5 max-w-sm text-xs leading-relaxed">{setupError}</p>
                <div className="mt-6">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Admin Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleActivate} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                      Admin Security Setup
                    </span>
                    <span className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-full px-2.5 py-0.5 font-semibold">
                      Step 1 of 3
                    </span>
                  </div>
                  <h1 className="text-on-surface mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                    Configure Authenticator App
                  </h1>
                  <p className="text-on-surface-variant mt-1 text-xs">
                    Complete the 3 quick steps below to pair your device and activate administrative console access.
                  </p>
                </div>

                {verifyError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-700">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <span>{verifyError}</span>
                  </div>
                )}

                {/* Step 1: Scan QR & Secret */}
                <div className="border-outline-variant/90 bg-surface-container-low/50 rounded-2xl border p-4 sm:p-5">
                  <div className="text-on-surface flex items-center gap-2 text-xs font-bold">
                    <span className="text-label-sm flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                      1
                    </span>
                    <span>Scan this QR Code with your Authenticator App</span>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    {/* QR Code Container */}
                    <div className="border-outline-variant flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border bg-white p-2 shadow-sm">
                      {setupData?.qrCodeDataUrl ? (
                        <Image
                          src={setupData.qrCodeDataUrl}
                          alt="2FA QR Code"
                          width={150}
                          height={150}
                          className="h-full w-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <QrCode className="text-outline h-20 w-20" />
                      )}
                    </div>

                    {/* Manual Entry Key */}
                    <div className="flex-1 space-y-2">
                      <p className="text-on-surface-variant text-xs">
                        Cannot scan QR? Enter this secret key manually into Google Authenticator, 1Password, or Authy:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="border-outline-variant text-on-surface flex-1 rounded-xl border bg-white px-3 py-2 font-mono text-xs font-bold select-all">
                          {setupData?.secret || '••••••••••••••••'}
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopySecret}
                          className="h-9 shrink-0 gap-1.5 px-3 text-xs font-semibold"
                        >
                          {hasCopiedSecret ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          {hasCopiedSecret ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <p className="text-label-sm text-on-surface-variant">
                        Type: Time-based (TOTP) · Algorithm: SHA1 · Digits: 6 · Interval: 30s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Emergency Recovery Codes */}
                <div className="border-outline-variant/90 bg-surface-container-low/50 rounded-2xl border p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-on-surface flex items-center gap-2 text-xs font-bold">
                      <span className="text-label-sm flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                        2
                      </span>
                      <span>Save Emergency Recovery Codes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyCodes}
                        className="text-label-sm inline-flex cursor-pointer items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        {hasCopiedCodes ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {hasCopiedCodes ? 'Copied All' : 'Copy All'}
                      </button>
                      <span className="text-outline">|</span>
                      <button
                        type="button"
                        onClick={handleDownloadCodes}
                        className="text-label-sm inline-flex cursor-pointer items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <Download className="h-3 w-3" />
                        Download (.txt)
                      </button>
                    </div>
                  </div>

                  <p className="text-on-surface-variant mt-2 text-xs">
                    Each code can be used <strong>only once</strong> if you lose your phone or authenticator app. Store
                    them securely:
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {setupData?.backupCodes?.map((code, idx) => (
                      <div
                        key={idx}
                        className="border-outline-variant text-on-surface rounded-lg border bg-white px-2.5 py-1.5 text-center font-mono text-xs font-bold tracking-wider shadow-xs"
                      >
                        {code}
                      </div>
                    ))}
                  </div>

                  <label className="mt-3.5 flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={hasConfirmedBackup}
                      onChange={(e) => setHasConfirmedBackup(e.target.checked)}
                      className="border-outline mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-on-surface text-xs font-medium select-none">
                      I have securely saved these emergency recovery codes in my password manager or safe storage.
                    </span>
                  </label>
                </div>

                {/* Step 3: Verification */}
                <div className="border-outline-variant/90 bg-surface-container-low/50 rounded-2xl border p-4 sm:p-5">
                  <div className="text-on-surface flex items-center gap-2 text-xs font-bold">
                    <span className="text-label-sm flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                      3
                    </span>
                    <span>Enter 6-Digit Code from Authenticator App</span>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="w-full sm:w-64">
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="text-on-surface text-center font-mono text-lg font-bold tracking-[0.35em]"
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isActivating || !hasConfirmedBackup || verificationCode.length !== 6}
                      className="shadow-elevation-1 h-10 flex-1 bg-emerald-600 font-bold text-white shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50"
                      isLoading={isActivating}
                      leftIcon={<ShieldCheck className="h-4 w-4" />}
                    >
                      Activate 2FA & Access Console
                    </Button>
                  </div>
                </div>

                {/* Return link */}
                <div className="text-center">
                  <Link
                    href="/admin/login"
                    className="text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1.5 text-xs font-medium transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Cancel and return to sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminTwoFactorSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-container-high flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <AdminTwoFactorSetupForm />
    </Suspense>
  );
}

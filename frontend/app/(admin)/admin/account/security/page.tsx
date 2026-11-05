'use client';

import { adminTwoFactorApi } from '@/apiRequest/admin-auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { isApiError } from '@/lib/api-error';
import type { TwoFactorSetup } from '@/types/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Check, Copy, Download, KeyRound, Lock, ShieldCheck, Smartphone, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function AdminSecurityPage() {
  const queryClient = useQueryClient();

  const { data: status } = useQuery({
    queryKey: ['admin', '2fa-status'],
    queryFn: () => adminTwoFactorApi.getStatus(),
  });

  // Reconfigure Modal State
  const [isReconfigOpen, setIsReconfigOpen] = useState(false);
  const [reconfigStep, setReconfigStep] = useState<'password' | 'scan'>('password');
  const [reconfigPassword, setReconfigPassword] = useState('');
  const [reconfigSetupData, setReconfigSetupData] = useState<TwoFactorSetup | null>(null);
  const [reconfigCode, setReconfigCode] = useState('');
  const [reconfigError, setReconfigError] = useState('');
  const [isReconfigLoading, setIsReconfigLoading] = useState(false);
  const [hasCopiedSecret, setHasCopiedSecret] = useState(false);

  // Regenerate Codes Modal State
  const [isRegenOpen, setIsRegenOpen] = useState(false);
  const [regenPassword, setRegenPassword] = useState('');
  const [newCodes, setNewCodes] = useState<string[] | null>(null);
  const [regenError, setRegenError] = useState('');
  const [isRegenLoading, setIsRegenLoading] = useState(false);
  const [hasCopiedCodes, setHasCopiedCodes] = useState(false);

  // Reconfigure Handlers
  const handleStartReconfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setReconfigError('');
    if (!reconfigPassword) {
      setReconfigError('Please enter your administrator password.');
      return;
    }

    setIsReconfigLoading(true);
    try {
      const data = await adminTwoFactorApi.initiateReconfigure(reconfigPassword);
      setReconfigSetupData(data);
      setReconfigStep('scan');
      setReconfigPassword('');
    } catch (err) {
      if (isApiError(err)) {
        setReconfigError(err.message || 'Incorrect password.');
      } else {
        setReconfigError('Unable to initiate reconfiguration.');
      }
    } finally {
      setIsReconfigLoading(false);
    }
  };

  const handleConfirmReconfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setReconfigError('');
    if (!reconfigCode || reconfigCode.length !== 6) {
      setReconfigError('Please enter the 6-digit verification code from your new authenticator app.');
      return;
    }

    setIsReconfigLoading(true);
    try {
      await adminTwoFactorApi.confirmReconfigure(reconfigCode);
      queryClient.invalidateQueries({ queryKey: ['admin', '2fa-status'] });
      setIsReconfigOpen(false);
      setReconfigStep('password');
      setReconfigCode('');
      setReconfigSetupData(null);
      toast.success('Authenticator device updated successfully! New emergency recovery codes have been generated.');
    } catch (err) {
      if (isApiError(err)) {
        setReconfigError(err.message || 'Invalid verification code. Please check your clock and try again.');
      } else {
        setReconfigError('Verification failed. Please try again.');
      }
    } finally {
      setIsReconfigLoading(false);
    }
  };

  // Regenerate Codes Handlers
  const handleRegenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegenError('');
    if (!regenPassword) {
      setRegenError('Please enter your administrator password.');
      return;
    }

    setIsRegenLoading(true);
    try {
      const codes = await adminTwoFactorApi.regenerateRecoveryCodes(regenPassword);
      setNewCodes(codes);
      setRegenPassword('');
      queryClient.invalidateQueries({ queryKey: ['admin', '2fa-status'] });
      toast.success('8 new emergency recovery codes generated! Previous codes are now invalid.');
    } catch (err) {
      if (isApiError(err)) {
        setRegenError(err.message || 'Incorrect password.');
      } else {
        setRegenError('Unable to generate recovery codes.');
      }
    } finally {
      setIsRegenLoading(false);
    }
  };

  const handleDownloadNewCodes = () => {
    if (!newCodes?.length) return;
    const content = [
      '====================================================',
      'INTERVUE FORTRESS ADMIN CONSOLE - 2FA RECOVERY CODES',
      '====================================================',
      `Regenerated at: ${new Date().toISOString()}`,
      '',
      'INSTRUCTIONS:',
      '1. Store this file in a secure location (password manager or encrypted drive).',
      '2. Each code can be used ONCE to access your administrator account.',
      '3. Once used, an emergency code is burned and permanently invalidated.',
      '',
      'EMERGENCY RECOVERY CODES:',
      ...newCodes.map((c, i) => `  [${i + 1}] ${c}`),
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
    toast.success('Recovery codes file downloaded.');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 antialiased">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Admin Console</span>
          <span>/</span>
          <span>Account Settings</span>
          <span>/</span>
          <span className="font-bold text-slate-900">Security & 2FA</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Security & Access Governance
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage hardware/software two-factor authentication, emergency recovery codes, and privileged session security.
        </p>
      </div>

      {/* Main Security Posture Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-[#022c22] via-[#043d2e] to-[#011a14] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Policy: Enforced & Active
                </span>
                <span className="text-xs text-emerald-200/60">NIST SP 800-63B</span>
              </div>
              <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">Two-Factor Authentication is Active</h2>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-emerald-100/80">
                All platform administrative logins are cryptographically protected via RFC 6238 Time-based One-Time
                Passwords (TOTP). This policy is mandatory and cannot be disabled.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setReconfigStep('password');
                setReconfigError('');
                setIsReconfigOpen(true);
              }}
              className="border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 hover:text-white"
            >
              Reconfigure Device
            </Button>
          </div>
        </div>
      </div>

      {/* Security Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Authenticator Device */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Active
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Authenticator Application</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Generates temporary 6-digit codes on your smartphone or password manager. Works with Google Authenticator,
              1Password, Microsoft Authenticator, and Authy.
            </p>

            <div className="mt-4 space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Method:</span>
                <span className="font-semibold text-slate-900">RFC 6238 TOTP (SHA-1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification Window:</span>
                <span className="font-semibold text-slate-900">30 seconds</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setReconfigStep('password');
                setReconfigError('');
                setIsReconfigOpen(true);
              }}
              className="w-full text-xs font-semibold"
            >
              Change Authenticator Device
            </Button>
          </div>
        </div>

        {/* Card 2: Emergency Recovery Codes */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {status ? `${status.remainingBackupCodes} of 8 remaining` : '8 of 8 remaining'}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Emergency Recovery Vault</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Single-use backup codes protect you from being locked out if your mobile device is broken, stolen, or
              unavailable. Each code expires immediately upon use.
            </p>

            <div className="mt-4 space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Encryption:</span>
                <span className="font-semibold text-slate-900">Hashed via SHA-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">Secured & Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewCodes(null);
                setRegenError('');
                setIsRegenOpen(true);
              }}
              className="w-full text-xs font-semibold"
            >
              Regenerate Backup Codes
            </Button>
          </div>
        </div>
      </div>

      {/* Card 3: Session Security & Auto-Lock */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Session Security & 15-Minute Auto-Lock</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                Enabled
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
              To defend against physical shoulder-surfing and unauthorized workstation access, your console
              automatically blurs and locks after 15 minutes of inactivity. Entering your administrator password unlocks
              the session immediately without restarting your workflow.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: Reconfigure Authenticator */}
      {isReconfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Change Authenticator Device</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReconfigOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reconfigStep === 'password' ? (
              <form onSubmit={handleStartReconfigure} className="mt-6 space-y-4">
                <p className="text-xs text-slate-600">
                  For your security, please verify your administrator password before generating a new authenticator QR
                  code.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Administrator Password</label>
                  <PasswordInput
                    placeholder="Enter current password"
                    value={reconfigPassword}
                    onChange={(e) => setReconfigPassword(e.target.value)}
                    className="mt-1.5"
                    autoFocus
                  />
                  {reconfigError && <p className="mt-1.5 text-xs text-rose-600">{reconfigError}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsReconfigOpen(false)}
                    className="text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isReconfigLoading}
                    className="bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Verify & Continue
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmReconfigure} className="mt-6 space-y-5">
                <p className="text-xs text-slate-600">
                  Scan this new QR code in your authenticator app. Once confirmed, your previous device will be
                  permanently disconnected.
                </p>

                {/* QR Container */}
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-40 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
                    {reconfigSetupData?.qrCodeDataUrl && (
                      <Image
                        src={reconfigSetupData.qrCodeDataUrl}
                        alt="New 2FA QR"
                        width={150}
                        height={150}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    )}
                  </div>

                  <div className="flex w-full items-center gap-2">
                    <code className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-center font-mono text-xs font-bold text-slate-800 select-all">
                      {reconfigSetupData?.secret}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!reconfigSetupData?.secret) return;
                        await navigator.clipboard.writeText(reconfigSetupData.secret);
                        setHasCopiedSecret(true);
                        toast.success('Secret key copied.');
                        setTimeout(() => setHasCopiedSecret(false), 2000);
                      }}
                      className="h-8 gap-1 px-2.5 text-xs"
                    >
                      {hasCopiedSecret ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {hasCopiedSecret ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Enter 6-Digit Code from New App
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={reconfigCode}
                    onChange={(e) => setReconfigCode(e.target.value.replace(/\D/g, ''))}
                    className="mt-1.5 text-center font-mono text-base font-bold tracking-widest text-slate-900"
                    autoFocus
                  />
                  {reconfigError && <p className="mt-1.5 text-xs text-rose-600">{reconfigError}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsReconfigOpen(false)}
                    className="text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isReconfigLoading}
                    disabled={isReconfigLoading || reconfigCode.length !== 6}
                    className="bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Confirm & Update Device
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Regenerate Recovery Codes */}
      {isRegenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Emergency Recovery Codes</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegenOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!newCodes ? (
              <form onSubmit={handleRegenerateCodes} className="mt-6 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    Regenerating recovery codes will <strong>immediately burn and invalidate all previous codes</strong>
                    . Make sure to download or save the new codes.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Administrator Password</label>
                  <PasswordInput
                    placeholder="Enter current password"
                    value={regenPassword}
                    onChange={(e) => setRegenPassword(e.target.value)}
                    className="mt-1.5"
                    autoFocus
                  />
                  {regenError && <p className="mt-1.5 text-xs text-rose-600">{regenError}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRegenOpen(false)}
                    className="text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isRegenLoading}
                    className="bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Generate 8 New Codes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600">Save these 8 new emergency codes in your password manager:</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(newCodes.join('\n'));
                        setHasCopiedCodes(true);
                        toast.success('Codes copied to clipboard.');
                        setTimeout(() => setHasCopiedCodes(false), 2000);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      {hasCopiedCodes ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {hasCopiedCodes ? 'Copied' : 'Copy All'}
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleDownloadNewCodes}
                      className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <Download className="h-3 w-3" />
                      Download (.txt)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {newCodes.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-center font-mono text-xs font-bold text-slate-800 shadow-xs"
                    >
                      {c}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setIsRegenOpen(false)}
                    className="bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Done & Saved
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Globe,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile';
}

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: 's-1',
    device: 'Windows 11 PC',
    browser: 'Chrome 124.0',
    location: 'Ho Chi Minh City, Vietnam',
    lastActive: 'Active now',
    isCurrent: true,
    type: 'desktop',
  },
  {
    id: 's-2',
    device: 'iPhone 15 Pro Max',
    browser: 'Safari Mobile 17.4',
    location: 'Hanoi, Vietnam',
    lastActive: '3 hours ago',
    isCurrent: false,
    type: 'mobile',
  },
  {
    id: 's-3',
    device: 'MacBook Pro M3',
    browser: 'Arc Browser 1.39',
    location: 'Da Nang, Vietnam',
    lastActive: '2 days ago',
    isCurrent: false,
    type: 'desktop',
  },
];

export default function AccountSecurityView() {
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [notice, setNotice] = useState('');

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setNotice('Device session signed out.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleRevokeOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setNotice('Signed out of all other devices.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary h-5 w-5" />
              <h1 className="text-xl font-black text-slate-800 sm:text-2xl">Account security</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">Manage your protections, sign-in details and active sessions.</p>
          </div>

          <Badge variant="success" size="md">
            <CheckCircle2 className="text-primary h-3.5 w-3.5" />
            <span>3 of 4 security tasks completed</span>
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">Primary email verified</div>
                <div className="truncate text-xs text-slate-500">nam.nguyen@techx.dev</div>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-emerald-700">Completed</span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">Recovery phone number</div>
                <div className="truncate text-xs text-slate-500">0988 ••• 321</div>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-emerald-700">Completed</span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">Strong password</div>
                <div className="truncate text-xs text-slate-500">A high-strength password is set</div>
              </div>
            </div>
            <Link
              href="/account/password"
              className="hover:text-primary shrink-0 text-xs font-semibold text-slate-500 hover:underline"
            >
              Change password
            </Link>
          </div>

          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white" />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-800">Two-factor authentication</div>
                <div className="truncate text-xs text-slate-500">Qua Authenticator App</div>
              </div>
            </div>
            <Link
              href="/account/two-factor"
              className="bg-primary inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
            >
              <span>Enable</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-800">Core protection settings</h2>

        <div className="mt-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Account email</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    Verified
                  </span>
                </div>
                <div className="text-xs text-slate-500">nam.nguyen@techx.dev</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Default</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Recovery phone number</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    Verified
                  </span>
                </div>
                <div className="text-xs text-slate-500">0988 ••• 321</div>
              </div>
            </div>
            <button type="button" className="text-primary cursor-pointer text-xs font-semibold hover:underline">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Sign-in password</div>
                <div className="text-xs text-slate-500">Last changed 45 days ago (high security)</div>
              </div>
            </div>
            <Link
              href="/account/password"
              className="text-primary inline-flex items-center gap-1 text-xs font-bold hover:underline"
            >
              <span>Change password</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Two-factor authentication</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                    Not active
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Requires a 6-digit code from Google/Microsoft Authenticator at sign-in
                </div>
              </div>
            </div>
            <Link
              href="/account/two-factor"
              className="bg-primary rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
            >
              Enable now
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Sessions & active devices</h2>
            <p className="text-xs text-slate-500">Review and revoke access from devices you do not recognise.</p>
          </div>

          {sessions.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRevokeOtherSessions}
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
            >
              Sign out other devices
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between rounded-xl border p-4 transition ${
                session.isCurrent
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-100 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    session.isCurrent ? 'text-primary bg-emerald-100' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {session.type === 'desktop' ? <Laptop className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      {session.device} • {session.browser}
                    </span>
                    {session.isCurrent && (
                      <span className="bg-primary rounded-full px-2 py-0.5 text-[10px] font-black text-white">
                        This device
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(session.id)}
                  className="cursor-pointer text-xs font-bold text-rose-600 hover:underline"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-800">Security alerts & notifications</h2>

        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-800">
                Email me when a new device or sign-in location is detected
              </div>
              <div className="text-xs text-slate-500">
                An instant alert is sent to nam.nguyen@techx.dev with the IP address and location.
              </div>
            </div>
            <input
              type="checkbox"
              checked={loginAlerts}
              onChange={(e) => setLoginAlerts(e.target.checked)}
              className="mt-1 h-5 w-5 rounded accent-emerald-600"
            />
          </label>

          <div className="border-t border-slate-100" />

          <label className="flex cursor-pointer items-start justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-800">
                Send a security code when the password or 2FA changes
              </div>
              <div className="text-xs text-slate-500">
                Require OTP verification before any core account setting can be changed.
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-1 h-5 w-5 rounded accent-emerald-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

type SecurityAlertsCardProps = { email: string };

export default function SecurityAlertsCard({ email }: SecurityAlertsCardProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-800">Security alerts & notifications</h2>

      <div className="mt-4 space-y-4">
        <label className="flex cursor-pointer items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-slate-800">
              Email me when a new device or sign-in location is detected
            </div>
            <div className="text-xs text-slate-500">
              An instant alert is sent to {email} with the IP address and location.
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
  );
}

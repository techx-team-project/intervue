'use client';

import { useState } from 'react';

type SecurityAlertsCardProps = { email: string };

export default function SecurityAlertsCard({ email }: SecurityAlertsCardProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs">
      <h2 className="text-on-surface text-base font-bold">Security alerts & notifications</h2>

      <div className="mt-4 space-y-4">
        <label className="flex cursor-pointer items-start justify-between gap-4">
          <div>
            <div className="text-on-surface text-sm font-bold">
              Email me when a new device or sign-in location is detected
            </div>
            <div className="text-on-surface-variant text-xs">
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

        <div className="border-outline-variant border-t" />

        <label className="flex cursor-pointer items-start justify-between gap-4">
          <div>
            <div className="text-on-surface text-sm font-bold">
              Send a security code when the password or 2FA changes
            </div>
            <div className="text-on-surface-variant text-xs">
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

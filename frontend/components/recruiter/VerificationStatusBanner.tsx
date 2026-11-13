'use client';

import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function VerificationStatusBanner() {
  const { profile, isLoading } = useCompanyVerification();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading || profile.canPublish || isDismissed) return null;

  return (
    <div className="border-outline-variant flex flex-col gap-3 rounded-xl border border-l-4 border-l-amber-500 bg-white py-4 pr-3 pl-5 sm:flex-row sm:items-center sm:gap-5">
      <div className="min-w-0 flex-1">
        <p className="text-navy text-body-md font-semibold">
          Complete verification to post jobs ({profile.stepsCompleted}/{profile.stepsTotal} steps)
        </p>
        <div
          className="mt-2 flex max-w-xs gap-1"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={profile.stepsTotal}
          aria-valuenow={profile.stepsCompleted}
        >
          {Array.from({ length: profile.stepsTotal }, (_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full ${index < profile.stepsCompleted ? 'bg-amber-500' : 'bg-surface-container-high'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={profile.nextStepUrl}
          className="bg-navy text-body-sm rounded-lg px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          {profile.nextStepLabel}
        </Link>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Close"
          className="text-outline hover:bg-surface-container-low hover:text-navy cursor-pointer rounded-lg p-2 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

'use client';

import { ROUTES } from '@/constants/routes';
import type { RecruiterVerificationStatus } from '@/types/recruiter';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface VerificationStatusBannerProps {
  verification: RecruiterVerificationStatus;
}

export default function VerificationStatusBanner({ verification }: VerificationStatusBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (verification.level === 'verified' || isDismissed) return null;

  return (
    <div className="border-outline-variant flex flex-col gap-3 rounded-xl border border-l-4 border-l-amber-500 bg-white py-4 pr-3 pl-5 sm:flex-row sm:items-center sm:gap-5">
      <div className="min-w-0 flex-1">
        <p className="text-navy text-body-md font-semibold">
          Complete verification to post jobs ({verification.stepsCompleted}/{verification.stepsTotal} steps)
        </p>
        <div
          className="mt-2 flex max-w-xs gap-1"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={verification.stepsTotal}
          aria-valuenow={verification.stepsCompleted}
        >
          {Array.from({ length: verification.stepsTotal }, (_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full ${index < verification.stepsCompleted ? 'bg-amber-500' : 'bg-surface-container-high'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.RECRUITER_COMPANY_VERIFICATION}
          className="bg-navy text-body-sm rounded-lg px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          {verification.nextStepLabel}
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

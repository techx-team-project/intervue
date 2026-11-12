'use client';

import Spinner from '@/components/common/Spinner';
import { ROUTES } from '@/constants/routes';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CompanyVerificationHero } from './CompanyVerificationHero';
import { VerificationChecklist } from './VerificationChecklist';

export function CompanyVerificationView() {
  const { profile, isLoading, error } = useCompanyVerification();
  const [showBottomBanner, setShowBottomBanner] = useState(true);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900">
        <p className="font-bold">{error}</p>
        <p className="mt-1 text-xs text-rose-700">Please refresh the page or contact platform support.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6">
        {/* Main unified card layout (Left = Emerald Hero stats, Right = Checklist) */}
        <div className="border-outline-variant/90 mx-auto grid max-w-7xl grid-cols-1 items-stretch overflow-hidden rounded-xl border bg-white lg:grid-cols-12">
          {/* Left Column (6 cols on lg) */}
          <div className="flex flex-col bg-[#009647] lg:col-span-6">
            <CompanyVerificationHero profile={profile} />
          </div>

          {/* Right Column (6 cols on lg) */}
          <div className="flex flex-col bg-white lg:col-span-6">
            <VerificationChecklist profile={profile} />
          </div>
        </div>
      </div>

      {/* Bottom informational banner */}
      {showBottomBanner && (
        <div className="bg-primary-deep sticky bottom-0 z-30 -mx-2 mt-6 -mb-6 overflow-hidden text-white shadow-[0_-6px_18px_-8px_rgba(0,0,0,0.35)] sm:-mx-3 sm:-mb-5 lg:-mx-5">
          <div className="flex items-stretch">
            <div
              aria-hidden
              className="bg-primary relative hidden w-36 shrink-0 overflow-hidden border-r border-white/20 sm:block"
            >
              <div className="relative flex h-full flex-col items-center justify-center gap-1">
                <ShieldCheck className="h-9 w-9 text-white drop-shadow-sm" strokeWidth={1.75} />
                <span className="text-label-sm rounded-full bg-emerald-900/60 px-2.5 py-0.5 font-bold tracking-wide text-white uppercase">
                  Verified Trust
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 py-4 pr-10 pl-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4 sm:pr-12 sm:pl-6">
              <div className="min-w-0 space-y-0.5">
                <p className="text-body-md leading-snug font-bold sm:text-sm">
                  Why verify your employer credentials on InterVue?
                </p>
                <p className="text-body-sm leading-snug text-white/90">
                  Verified companies receive up to 3.5x higher applicant response rates, official enterprise badges, and
                  priority placement in software engineering candidate searches.
                </p>
              </div>

              <Link
                href={ROUTES.RECRUITER_JOBS_CREATE}
                className="text-primary-deep hover:bg-primary-light shrink-0 self-start rounded-lg bg-white px-4 py-2 text-xs font-bold transition active:scale-95 sm:self-auto"
              >
                Create Job Draft
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBottomBanner(false)}
            className="absolute top-2.5 right-3 rounded p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

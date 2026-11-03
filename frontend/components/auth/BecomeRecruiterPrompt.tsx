'use client';

import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BecomeRecruiterDialog from './BecomeRecruiterDialog';

export default function BecomeRecruiterPrompt() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-12">
      <div className="-mt-16 flex max-w-4xl flex-col items-center gap-8 sm:-mt-24 sm:flex-row sm:gap-14 md:-mt-28 md:gap-16">
        {/* Left: InterVue Brand Logo */}
        <div className="flex shrink-0 items-center justify-center">
          <Link href={ROUTES.HOME} className="transition-opacity hover:opacity-85">
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={340}
              height={100}
              className="h-20 w-auto object-contain sm:h-24 md:h-28"
              priority
            />
          </Link>
        </div>

        {/* Vertical divider */}
        <div className="hidden h-36 w-[1.5px] bg-slate-200/90 sm:block sm:h-44 md:h-48" />

        {/* Right: Recruiter activation info */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-[40px]">
            Recruiter Workspace
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            Your account does not have Recruiter privileges yet. Enable this role to post tech jobs and manage
            applicants.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 sm:justify-start">
            <Button
              className="bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 sm:text-base"
              onClick={() => setIsDialogOpen(true)}
            >
              Activate Recruiter Role
            </Button>
            <Link
              href={ROUTES.HOME}
              className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline sm:text-base"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>

      <BecomeRecruiterDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}

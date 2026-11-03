'use client';

import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useState } from 'react';
import BecomeRecruiterDialog from './BecomeRecruiterDialog';

export default function BecomeRecruiterPrompt() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-lg font-bold text-slate-800">Recruiter area</h1>
      <p className="max-w-md text-sm text-slate-600">
        Your account does not have the recruiter role yet. Enable it to post jobs and manage applications.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => setIsDialogOpen(true)}>Become a recruiter</Button>
        <Link href={ROUTES.HOME} className="text-sm font-semibold text-emerald-600 hover:underline">
          Back to home
        </Link>
      </div>
      <BecomeRecruiterDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}

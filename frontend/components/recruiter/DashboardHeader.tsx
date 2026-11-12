'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  companyName: string;
}

export default function DashboardHeader({ companyName }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-body-sm text-on-surface-variant truncate">{companyName}</p>
        <h1 className="text-navy mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">
          {user?.name ? `Hi ${user.name}, what is new today?` : 'Hiring overview'}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={ROUTES.RECRUITER_CANDIDATES}
          className="border-outline-variant text-navy hover:bg-surface-container-low text-body-sm inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 font-semibold transition"
        >
          <Search className="h-4 w-4" />
          Find candidates
        </Link>
        <Link
          href={ROUTES.RECRUITER_SERVICES}
          className="border-outline-variant text-navy hover:bg-surface-container-low text-body-sm inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 font-semibold transition"
        >
          <ShoppingBag className="h-4 w-4" />
          Buy services
        </Link>
        <Link
          href={ROUTES.RECRUITER_JOBS_CREATE}
          className="bg-primary hover:bg-primary-hover text-body-sm inline-flex h-10 items-center gap-2 rounded-lg px-4 font-semibold text-white transition"
        >
          <Plus className="h-4 w-4" />
          Post a job
        </Link>
      </div>
    </header>
  );
}

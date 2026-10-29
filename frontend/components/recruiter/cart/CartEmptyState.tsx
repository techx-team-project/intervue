'use client';

import { ROUTES } from '@/constants/routes';
import { RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CartEmptyStateProps {
  onRestoreDefaults: () => void;
}

export default function CartEmptyState({ onRestoreDefaults }: CartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xs">
      <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <ShoppingBag className="h-12 w-12 stroke-[1.5]" />
        <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <h3 className="text-navy text-lg font-bold sm:text-xl">Your cart is empty</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        You haven&apos;t added any recruitment service packages yet. Explore our featured job placement and AI candidate
        matching solutions to boost your hiring speed.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={ROUTES.RECRUITER_DASHBOARD}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00b14f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00873c]"
        >
          Explore packages
        </Link>

        <button
          type="button"
          onClick={onRestoreDefaults}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>Restore sample cart</span>
        </button>
      </div>
    </div>
  );
}

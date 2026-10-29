'use client';

import { cn } from '@/lib/utils';
import type { AdminUserStats } from '@/lib/admin-user';
import type { AdminUserSegment } from '@/types/admin-user';
import { Ban, Lock, MailWarning, UserCheck, UserPlus, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AdminUserStatsRowProps {
  stats: AdminUserStats;
  activeSegment: AdminUserSegment;
  onSelectSegment: (segment: AdminUserSegment) => void;
}

interface Tile {
  key: string;
  label: string;
  value: number;
  caption: string;
  icon: LucideIcon;
  tone: string;
  segment?: AdminUserSegment;
}

// Every value is counted from the accounts already loaded — no targets, no
// trends, nothing the product spec has not defined.
export default function AdminUserStatsRow({ stats, activeSegment, onSelectSegment }: AdminUserStatsRowProps) {
  const tiles: Tile[] = [
    {
      key: 'total',
      label: 'Total accounts',
      value: stats.total,
      caption: `${stats.candidates} candidates · ${stats.recruiters} recruiters · ${stats.admins} admins`,
      icon: Users,
      tone: 'bg-slate-100 text-slate-600',
      segment: 'all',
    },
    {
      key: 'active',
      label: 'Active',
      value: stats.active,
      caption: `${stats.activeLast7Days} signed in this week`,
      icon: UserCheck,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      key: 'new',
      label: 'New this week',
      value: stats.newLast7Days,
      caption: 'Registered in the last 7 days',
      icon: UserPlus,
      tone: 'bg-sky-50 text-sky-600',
    },
    {
      key: 'locked',
      label: 'Locked',
      value: stats.locked,
      caption: 'Security hold, reversible',
      icon: Lock,
      tone: 'bg-amber-50 text-amber-600',
      segment: 'locked',
    },
    {
      key: 'banned',
      label: 'Banned',
      value: stats.banned,
      caption: 'Policy enforcement',
      icon: Ban,
      tone: 'bg-rose-50 text-rose-600',
      segment: 'banned',
    },
    {
      key: 'unverified',
      label: 'Unverified email',
      value: stats.unverified,
      caption: 'Cannot receive a reset link',
      icon: MailWarning,
      tone: 'bg-violet-50 text-violet-600',
      segment: 'unverified',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        const isActive = tile.segment !== undefined && tile.segment === activeSegment;
        const isClickable = tile.segment !== undefined;

        const content = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', tile.tone)}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-navy dark:text-forest-50 text-xl font-black">
                {tile.value.toLocaleString('en-GB')}
              </span>
            </span>

            <span className="mt-2 block">
              <span className="text-navy dark:text-forest-100 block text-[12.5px] font-bold">{tile.label}</span>
              <span className="dark:text-forest-400 mt-0.5 block truncate text-[11px] text-[#94a3b8]">
                {tile.caption}
              </span>
            </span>
          </>
        );

        const shell = cn(
          'dark:border-forest-800 dark:bg-forest-900 block rounded-2xl border border-[#e9eaec] bg-white p-3.5 text-left shadow-xs transition',
          isActive && 'border-primary/50 ring-primary/15 ring-2',
          isClickable && 'dark:hover:bg-forest-850/40 cursor-pointer hover:border-[#cbd5e1] hover:bg-[#f8fafc]',
        );

        if (!isClickable) {
          return (
            <div key={tile.key} className={shell}>
              {content}
            </div>
          );
        }

        return (
          <button
            key={tile.key}
            type="button"
            onClick={() => onSelectSegment(tile.segment as AdminUserSegment)}
            aria-pressed={isActive}
            className={shell}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

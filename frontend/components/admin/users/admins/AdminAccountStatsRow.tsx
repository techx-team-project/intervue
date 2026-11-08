import { ADMIN_PERMISSION_META } from '@/constants/admin-user';
import type { AdminAccountStats } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import { Gavel, ShieldCheck, ShieldOff, Timer, UserCog } from 'lucide-react';

interface AdminAccountStatsRowProps {
  stats: AdminAccountStats;
}

export default function AdminAccountStatsRow({ stats }: AdminAccountStatsRowProps) {
  const fullyCovered = stats.withTwoFactor === stats.active;

  const tiles = [
    {
      key: 'total',
      label: 'Admin accounts',
      value: String(stats.total),
      caption: `${stats.active} active`,
      icon: UserCog,
      tone: 'bg-surface-container-high text-on-surface-variant',
    },
    {
      key: 'twoFactor',
      label: 'Two-factor on',
      value: `${stats.withTwoFactor}/${stats.active}`,
      caption: fullyCovered ? 'Every active admin is covered' : 'Chase the rest',
      icon: fullyCovered ? ShieldCheck : ShieldOff,
      tone: fullyCovered ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600',
    },
    {
      key: 'expiring',
      label: 'Grants expiring',
      value: String(stats.expiringGrants),
      caption: 'Within 30 days',
      icon: Timer,
      tone: 'bg-sky-50 text-sky-600',
    },
    {
      key: 'decisions',
      label: 'Decisions · 30 days',
      value: stats.decisionsLast30Days.toLocaleString('en-GB'),
      caption: 'Approvals, rejections and restrictions',
      icon: Gavel,
      tone: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;

          return (
            <div
              key={tile.key}
              className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-3.5 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', tile.tone)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-navy dark:text-forest-50 text-xl font-bold">{tile.value}</span>
              </div>

              <p className="text-navy dark:text-forest-100 text-body-sm mt-2 font-bold">{tile.label}</p>
              <p className="dark:text-forest-400 text-label-sm text-outline mt-0.5 truncate">{tile.caption}</p>
            </div>
          );
        })}
      </div>

      {stats.uncoveredPermissions.length > 0 && (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-3.5 shadow-xs">
          <p className="text-navy dark:text-forest-50 text-body-sm font-bold">
            {stats.uncoveredPermissions.length} permission{stats.uncoveredPermissions.length === 1 ? '' : 's'} nobody
            holds
          </p>
          <p className="dark:text-forest-300 text-label-sm text-on-surface-variant mt-0.5">
            Work in these areas cannot be actioned by any active admin today.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {stats.uncoveredPermissions.map((permission) => (
              <span
                key={permission}
                className="text-label-sm rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 ring-1 ring-amber-200 ring-inset"
              >
                {ADMIN_PERMISSION_META[permission].label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

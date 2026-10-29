'use client';

import AdminUserStatusBadge from '@/components/admin/users/AdminUserStatusBadge';
import UserAvatar from '@/components/ui/UserAvatar';
import { ADMIN_PERMISSION_META } from '@/constants/admin-user';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { AdminAccountListItem } from '@/types/admin-user';
import { formatDate, formatRelativeDay } from '@/utils/datetime';
import { Clock, ExternalLink, Gavel, Pencil, ShieldCheck, ShieldOff, Timer } from 'lucide-react';
import Link from 'next/link';

interface AdminAccountsTableProps {
  accounts: AdminAccountListItem[];
  onEdit: (account: AdminAccountListItem) => void;
}

export default function AdminAccountsTable({ accounts, onEdit }: AdminAccountsTableProps) {
  return (
    <div className="space-y-2.5">
      {accounts.map((account) => (
        <article
          key={account.id}
          className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <UserAvatar fullName={account.name} image={account.image} size="md" />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`${ROUTES.ADMIN_USERS}/${account.id}`}
                    className="text-navy dark:text-forest-50 hover:text-primary truncate text-[14px] font-bold transition-colors"
                  >
                    {account.name}
                  </Link>
                  {account.isCurrentAdmin && (
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
                      You
                    </span>
                  )}
                  <AdminUserStatusBadge status={account.status} />
                </div>

                <p className="dark:text-forest-300 mt-0.5 truncate text-[12.5px] text-[#64748b]">{account.email}</p>

                <p className="mt-1 text-[11.5px] text-[#94a3b8]">
                  Admin since {formatDate(account.grantedAt)}
                  {account.grantedByName ? ` · granted by ${account.grantedByName}` : ''}
                </p>

                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-[#94a3b8]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 shrink-0" />
                    {account.lastSignInAt ? `Active ${formatRelativeDay(account.lastSignInAt)}` : 'Never signed in'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Gavel className="h-3 w-3 shrink-0" />
                    {account.decisionsLast30Days} decisions in 30 days
                  </span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold',
                  account.twoFactorEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
                )}
              >
                {account.twoFactorEnabled ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <ShieldOff className="h-3.5 w-3.5" />
                )}
                {account.twoFactorEnabled ? '2FA on' : '2FA off'}
              </span>

              <button
                type="button"
                onClick={() => onEdit(account)}
                className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Permissions
              </button>

              <Link
                href={`${ROUTES.ADMIN_USERS}/${account.id}`}
                aria-label={`Open the full account record for ${account.name}`}
                className="dark:text-forest-300 dark:hover:bg-forest-850 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="dark:border-forest-800 mt-3 border-t border-[#f1f5f9] pt-3">
            {account.expiresAt && (
              <p className="mb-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-700">
                <Timer className="h-3.5 w-3.5" />
                Admin role expires {formatDate(account.expiresAt)}
              </p>
            )}

            {account.permissions.length === 0 ? (
              <p className="text-[12px] text-[#94a3b8]">No permission granted yet — this admin can only sign in.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {account.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="dark:bg-forest-850 dark:text-forest-200 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                  >
                    {ADMIN_PERMISSION_META[permission].label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

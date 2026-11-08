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
          className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-4 shadow-xs"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <UserAvatar fullName={account.name} image={account.image} size="md" />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`${ROUTES.ADMIN_USERS}/${account.id}`}
                    className="text-navy dark:text-forest-50 hover:text-primary text-body-md truncate font-bold transition-colors"
                  >
                    {account.name}
                  </Link>
                  {account.isCurrentAdmin && (
                    <span className="bg-primary/10 text-primary text-label-sm rounded-full px-2 py-0.5 font-bold">
                      You
                    </span>
                  )}
                  <AdminUserStatusBadge status={account.status} />
                </div>

                <p className="dark:text-forest-300 text-body-sm text-on-surface-variant mt-0.5 truncate">
                  {account.email}
                </p>

                <p className="text-label-sm text-outline mt-1">
                  Admin since {formatDate(account.grantedAt)}
                  {account.grantedByName ? ` · granted by ${account.grantedByName}` : ''}
                </p>

                <p className="text-label-sm text-outline mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
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
                  'text-label-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold',
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
                className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 border-outline-variant text-body-sm text-on-surface hover:bg-surface-container-low inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-bold transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Permissions
              </button>

              <Link
                href={`${ROUTES.ADMIN_USERS}/${account.id}`}
                aria-label={`Open the full account record for ${account.name}`}
                className="dark:text-forest-300 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="dark:border-forest-800 border-outline-variant mt-3 border-t pt-3">
            {account.expiresAt && (
              <p className="text-label-sm mb-2 inline-flex items-center gap-1.5 font-semibold text-amber-700">
                <Timer className="h-3.5 w-3.5" />
                Admin role expires {formatDate(account.expiresAt)}
              </p>
            )}

            {account.permissions.length === 0 ? (
              <p className="text-body-sm text-outline">No permission granted yet — this admin can only sign in.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {account.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="dark:bg-forest-850 dark:text-forest-200 bg-surface-container-high text-label-sm text-on-surface-variant rounded-md px-2 py-0.5 font-semibold"
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

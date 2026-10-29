'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import { USER_PAGE_SIZE } from '@/constants/admin-user';
import { ROUTES } from '@/constants/routes';
import { buildAdminAccountStats, pageCount, paginate } from '@/lib/admin-user';
import type { AdminAccountFormData } from '@/schemas/admin-user.schema';
import type { AdminAccountListData, AdminAccountListItem } from '@/types/admin-user';
import { ArrowLeft, Plus, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import AdminAccountPermissionsDialog from './AdminAccountPermissionsDialog';
import AdminAccountStatsRow from './AdminAccountStatsRow';
import AdminAccountsTable from './AdminAccountsTable';

interface AdminAccountsListViewProps {
  data: AdminAccountListData;
}

export default function AdminAccountsListView({ data }: AdminAccountsListViewProps) {
  const [accounts, setAccounts] = useState(data.accounts);
  const [editing, setEditing] = useState<AdminAccountListItem | null>(null);
  const [page, setPage] = useState(1);

  const stats = useMemo(() => buildAdminAccountStats(accounts), [accounts]);
  const withoutTwoFactor = accounts.filter((account) => account.status === 'ACTIVE' && !account.twoFactorEnabled);

  const totalPages = pageCount(accounts.length, USER_PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const visibleAccounts = paginate(accounts, safePage, USER_PAGE_SIZE);

  const saveAccount = (form: AdminAccountFormData) => {
    if (!editing) return;
    const target = editing;
    setEditing(null);
    setAccounts((previous) =>
      previous.map((account) =>
        account.id === target.id
          ? {
              ...account,
              permissions: form.permissions,
              expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
            }
          : account,
      ),
    );
    toast.success(`Updated the permissions for ${target.name}`);
  };

  return (
    <div className="space-y-4">
      <AdminPageHeader
        description="Who can reach this panel, what they are allowed to do, and who granted it."
        count={accounts.length}
        countLabel="admins"
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_USERS}
              className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              All users
            </Link>

            <Link
              href={ROUTES.ADMIN_ADMINS_CREATE}
              className="bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create admin
            </Link>
          </>
        }
      />

      <AdminAccountStatsRow stats={stats} />

      {withoutTwoFactor.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-amber-900">
              {withoutTwoFactor.length === 1
                ? '1 admin account has no two-factor authentication'
                : `${withoutTwoFactor.length} admin accounts have no two-factor authentication`}
            </p>
            <p className="mt-0.5 text-[12.5px] text-amber-800">
              {withoutTwoFactor.map((account) => account.name).join(', ')}. An admin account without a second factor is
              the weakest point of the whole panel.
            </p>
          </div>
        </div>
      )}

      <AdminAccountsTable accounts={visibleAccounts} onEdit={setEditing} />

      <Pagination
        page={safePage}
        pageCount={totalPages}
        totalItems={accounts.length}
        pageSize={USER_PAGE_SIZE}
        onPageChange={setPage}
      />

      {editing && (
        <AdminAccountPermissionsDialog account={editing} onClose={() => setEditing(null)} onConfirm={saveAccount} />
      )}
    </div>
  );
}

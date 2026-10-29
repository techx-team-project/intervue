'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ROUTES } from '@/constants/routes';
import type { AdminAccountFormData } from '@/schemas/admin-user.schema';
import type { AdminAccountListData, AdminAccountListItem } from '@/types/admin-user';
import { ArrowLeft, Plus, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import AdminAccountFormDialog from './AdminAccountFormDialog';
import AdminAccountsTable from './AdminAccountsTable';

interface AdminAccountsListViewProps {
  data: AdminAccountListData;
}

export default function AdminAccountsListView({ data }: AdminAccountsListViewProps) {
  const [accounts, setAccounts] = useState(data.accounts);
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<AdminAccountListItem | null>(null);

  const withoutTwoFactor = accounts.filter((account) => account.status === 'ACTIVE' && !account.twoFactorEnabled);

  const createAccount = (form: AdminAccountFormData) => {
    setIsCreating(false);
    setAccounts((previous) => [
      ...previous,
      {
        id: Math.max(...previous.map((account) => account.id)) + 1,
        name: form.name,
        email: form.email,
        image: null,
        status: 'ACTIVE',
        twoFactorEnabled: false,
        permissions: form.permissions,
        grantedByName: previous.find((account) => account.isCurrentAdmin)?.name ?? null,
        grantedAt: new Date().toISOString(),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        isCurrentAdmin: false,
      },
    ]);
    toast.success(`Invitation sent to ${form.email}`);
  };

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
        title="Admin accounts"
        description="Who can reach this panel, what they are allowed to do, and who granted it."
        count={accounts.length}
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_USERS}
              className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              All users
            </Link>

            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="bg-primary hover:bg-primary-hover inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create admin
            </button>
          </>
        }
      />

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

      <AdminAccountsTable accounts={accounts} onEdit={setEditing} />

      {isCreating && <AdminAccountFormDialog onClose={() => setIsCreating(false)} onConfirm={createAccount} />}

      {editing && <AdminAccountFormDialog account={editing} onClose={() => setEditing(null)} onConfirm={saveAccount} />}
    </div>
  );
}

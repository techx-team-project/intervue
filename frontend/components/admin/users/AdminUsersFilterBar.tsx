'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { USER_ROLE_META, USER_SORT_OPTIONS, USER_STATUS_META } from '@/constants/admin-user';
import type { AdminUserSort, AdminUserStatus } from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminUsersFilterBarProps {
  search: string;
  role: RoleType | '';
  status: AdminUserStatus | '';
  sort: AdminUserSort;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: RoleType | '') => void;
  onStatusChange: (value: AdminUserStatus | '') => void;
  onSortChange: (value: AdminUserSort) => void;
}

const DEBOUNCE_MS = 300;

const ROLE_OPTIONS = (Object.keys(USER_ROLE_META) as RoleType[]).map((role) => ({
  value: role,
  label: USER_ROLE_META[role].label,
}));

const STATUS_OPTIONS = (Object.keys(USER_STATUS_META) as AdminUserStatus[]).map((status) => ({
  value: status,
  label: USER_STATUS_META[status].label,
}));

export default function AdminUsersFilterBar({
  search,
  role,
  status,
  sort,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
}: AdminUsersFilterBarProps) {
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex-1">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by name, email, phone or account id..."
          leftIcon={<Search className="h-4 w-4" />}
          rightElement={
            draft.length > 0 ? (
              <button
                type="button"
                onClick={() => setDraft('')}
                aria-label="Clear search"
                className="cursor-pointer rounded-md p-0.5 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            ) : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-150">
        <Select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as RoleType | '')}
          placeholder="All roles"
          options={ROLE_OPTIONS}
        />

        <Select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as AdminUserStatus | '')}
          placeholder="All statuses"
          options={STATUS_OPTIONS}
        />

        <Select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as AdminUserSort)}
          options={USER_SORT_OPTIONS}
        />
      </div>
    </div>
  );
}

'use client';

import { USER_ROLE_META } from '@/constants/admin-user';
import { ROLES } from '@/constants/auth';
import { isGrantActive, roleRemovalBlockedReason } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import type { GrantRoleFormData } from '@/schemas/admin-user.schema';
import type { AdminUserListItem, AdminUserRoleGrant } from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import { formatDate } from '@/utils/datetime';
import { Plus, Timer, UserMinus } from 'lucide-react';
import { useState } from 'react';
import AdminUserGrantRoleDialog from './AdminUserGrantRoleDialog';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserRolesTabProps {
  user: AdminUserListItem;
  allUsers: AdminUserListItem[];
  currentAdminId: number;
  onGrant: (data: GrantRoleFormData) => void;
  onRevoke: (role: RoleType) => void;
}

const ALL_ROLES: RoleType[] = [ROLES.CANDIDATE, ROLES.RECRUITER, ROLES.ADMIN];

function grantSource(grant: AdminUserRoleGrant): string {
  return grant.grantedByName ?? 'Self-service';
}

export default function AdminUserRolesTab({
  user,
  allUsers,
  currentAdminId,
  onGrant,
  onRevoke,
}: AdminUserRolesTabProps) {
  const [isGranting, setIsGranting] = useState(false);

  const held = new Set(user.roles.filter(isGrantActive).map((grant) => grant.role));
  const grantableRoles = ALL_ROLES.filter((role) => !held.has(role));

  return (
    <>
      <AdminUserPanel
        title="Roles"
        description="One account can hold several roles. Each grant records who issued it and when it lapses."
        actions={
          grantableRoles.length > 0 ? (
            <button
              type="button"
              onClick={() => setIsGranting(true)}
              className="bg-primary hover:bg-primary-hover inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Grant role
            </button>
          ) : (
            <span className="dark:text-forest-400 text-[11.5px] text-[#94a3b8]">Every role is already active</span>
          )
        }
      >
        <ul className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
          {user.roles.map((grant) => {
            const active = isGrantActive(grant);
            const blocked = roleRemovalBlockedReason(user, grant.role, currentAdminId, allUsers);

            return (
              <li key={grant.role} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ring-1 ring-inset',
                        USER_ROLE_META[grant.role].chipClassName,
                        !active && 'opacity-50',
                      )}
                    >
                      {USER_ROLE_META[grant.role].label}
                    </span>

                    {!active && <span className="text-[11px] font-bold text-[#94a3b8] uppercase">Expired</span>}

                    {active && grant.expiresAt && (
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-amber-700">
                        <Timer className="h-3 w-3" />
                        Until {formatDate(grant.expiresAt)}
                      </span>
                    )}
                  </span>

                  <p className="dark:text-forest-300 mt-1 text-[11.5px] text-[#64748b]">
                    Granted by {grantSource(grant)} · {formatDate(grant.grantedAt)}
                  </p>
                </div>

                {blocked ? (
                  <span
                    title={blocked}
                    className="dark:text-forest-400 inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-slate-400"
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                    Revoke
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRevoke(grant.role)}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[12px] font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/10"
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                    Revoke
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </AdminUserPanel>

      {isGranting && (
        <AdminUserGrantRoleDialog
          userName={user.name}
          grantableRoles={grantableRoles}
          onClose={() => setIsGranting(false)}
          onConfirm={(data) => {
            setIsGranting(false);
            onGrant(data);
          }}
        />
      )}
    </>
  );
}

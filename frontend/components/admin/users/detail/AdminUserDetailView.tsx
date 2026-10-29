'use client';

import { useAdminUserActions, type AdminUserAction } from '@/hooks/useAdminUserActions';
import { lockBlockedReason } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import type { GrantRoleFormData } from '@/schemas/admin-user.schema';
import type { AdminUserActivityEntry, AdminUserDetail, AdminUserListData, AdminUserSession } from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import AdminUserActivityTab from './AdminUserActivityTab';
import AdminUserDetailHeader from './AdminUserDetailHeader';
import AdminUserOverviewTab from './AdminUserOverviewTab';
import AdminUserRolesTab from './AdminUserRolesTab';
import AdminUserSecurityTab from './AdminUserSecurityTab';
import AdminUserSessionsTab from './AdminUserSessionsTab';

interface AdminUserDetailViewProps {
  detail: AdminUserDetail;
  listData: AdminUserListData;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'roles', label: 'Roles' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'security', label: 'Security' },
  { id: 'activity', label: 'Activity' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const ACTION_SUMMARY: Record<AdminUserAction, string> = {
  lock: 'Account locked',
  unlock: 'Account unlocked',
  revokeSessions: 'All sessions revoked',
  resetTwoFactor: 'Two-factor authentication reset',
  sendPasswordReset: 'Password reset email sent',
};

const ACTION_KIND: Record<AdminUserAction, AdminUserActivityEntry['kind']> = {
  lock: 'locked',
  unlock: 'unlocked',
  revokeSessions: 'sessionsRevoked',
  resetTwoFactor: 'twoFactorReset',
  sendPasswordReset: 'passwordResetSent',
};

export default function AdminUserDetailView({ detail, listData }: AdminUserDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState<AdminUserSession[]>(detail.sessions);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(detail.twoFactorEnabled);
  const [activity, setActivity] = useState<AdminUserActivityEntry[]>(detail.activity);
  const [roles, setRoles] = useState(detail.roles);

  const currentAdminName = listData.users.find((entry) => entry.id === listData.currentAdminId)?.name ?? 'You';

  const recordActivity = useCallback(
    (kind: AdminUserActivityEntry['kind'], summary: string, reason?: string) => {
      setActivity((previous) => [
        {
          id: `local-${kind}-${Date.now()}`,
          kind,
          summary,
          actorName: currentAdminName,
          reason: reason ?? null,
          at: new Date().toISOString(),
        },
        ...previous,
      ]);
    },
    [currentAdminName],
  );

  const handleResolved = useCallback(
    (action: AdminUserAction, userIds: number[], reason?: string) => {
      if (!userIds.includes(detail.id)) return;

      if (action === 'lock' || action === 'revokeSessions') {
        setSessions((previous) => previous.map((session) => ({ ...session, revoked: true, isCurrent: false })));
      }

      if (action === 'resetTwoFactor') setTwoFactorEnabled(false);

      recordActivity(ACTION_KIND[action], ACTION_SUMMARY[action], reason);
    },
    [detail.id, recordActivity],
  );

  const { users, requestLock, requestConfirm, actionModals } = useAdminUserActions(
    listData.users,
    listData.currentAdminId,
    handleResolved,
  );

  const user = { ...(users.find((entry) => entry.id === detail.id) ?? detail), roles };
  const isSelf = user.id === listData.currentAdminId;
  const activeTab = (TABS.find((tab) => tab.id === searchParams.get('tab'))?.id ?? 'overview') as TabId;

  const selectTab = (tab: TabId) => {
    const next = new URLSearchParams(searchParams.toString());
    if (tab === 'overview') next.delete('tab');
    else next.set('tab', tab);
    const query = next.toString();
    router.replace(query.length > 0 ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const grantRole = (data: GrantRoleFormData) => {
    setRoles((previous) => [
      ...previous.filter((grant) => grant.role !== data.role),
      {
        role: data.role,
        grantedAt: new Date().toISOString(),
        grantedByName: currentAdminName,
        expiresAt: data.isTemporary && data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      },
    ]);
    recordActivity('roleGranted', `${data.role} role granted`, data.reason);
    toast.success(`Granted the ${data.role} role to ${user.name}`);
  };

  const revokeRole = (role: RoleType) => {
    setRoles((previous) => previous.filter((grant) => grant.role !== role));
    recordActivity('roleRevoked', `${role} role revoked`);
    toast.success(`Revoked the ${role} role from ${user.name}`);
  };

  return (
    <div className="space-y-4">
      <AdminUserDetailHeader
        user={user}
        isSelf={isSelf}
        lockBlockedReason={lockBlockedReason(user, listData.currentAdminId, users)}
        onLock={() => requestLock([user])}
        onUnlock={() => requestConfirm('unlock', [user])}
        onRevokeSessions={() => requestConfirm('revokeSessions', [user])}
      />

      <div className="dark:border-forest-800 -mx-1 overflow-x-auto border-b border-[#e9eaec] px-1">
        <div role="tablist" aria-label="Account sections" className="flex min-w-max items-center gap-1">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectTab(tab.id)}
                className={cn(
                  'relative cursor-pointer px-3 py-2.5 text-[13px] font-bold whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'dark:text-forest-300 dark:hover:text-forest-100 text-[#64748b] hover:text-[#334155]',
                )}
              >
                {tab.label}
                {isActive && <span className="bg-primary absolute inset-x-2 -bottom-px h-0.5 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && <AdminUserOverviewTab detail={detail} user={user} />}

      {activeTab === 'roles' && (
        <AdminUserRolesTab
          user={user}
          allUsers={users}
          currentAdminId={listData.currentAdminId}
          onGrant={grantRole}
          onRevoke={revokeRole}
        />
      )}

      {activeTab === 'sessions' && (
        <AdminUserSessionsTab sessions={sessions} onRevokeAll={() => requestConfirm('revokeSessions', [user])} />
      )}

      {activeTab === 'security' && (
        <AdminUserSecurityTab
          user={user}
          twoFactorEnabled={twoFactorEnabled}
          onResetTwoFactor={() => requestConfirm('resetTwoFactor', [user])}
          onSendPasswordReset={() => requestConfirm('sendPasswordReset', [user])}
        />
      )}

      {activeTab === 'activity' && <AdminUserActivityTab activity={activity} />}

      {actionModals}
    </div>
  );
}

'use client';

import { adminUserApi } from '@/apiRequest/admin-user';
import { useAdminUserActions, type AdminUserAction } from '@/hooks/useAdminUserActions';
import { restrictBlockedReason } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import type { GrantRoleFormData } from '@/schemas/admin-user.schema';
import type {
  AdminUserActivityEntry,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserSession,
  AdminUserSignIn,
} from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminUserActivityTab from './AdminUserActivityTab';
import AdminUserDetailHeader from './AdminUserDetailHeader';
import AdminUserOverviewTab from './AdminUserOverviewTab';
import AdminUserRolesTab from './AdminUserRolesTab';
import AdminUserSecurityTab from './AdminUserSecurityTab';
import AdminUserSessionsTab from './AdminUserSessionsTab';
import AdminUserSignInHistory from './AdminUserSignInHistory';

interface AdminUserDetailViewProps {
  detail: AdminUserDetail;
  allUsers: AdminUserListItem[];
  currentAdminId: number;
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
  ban: 'Account banned',
  unban: 'Account unbanned',
  revokeSessions: 'All sessions revoked',
  resetTwoFactor: 'Two-factor authentication reset',
  sendPasswordReset: 'Password reset email sent',
  restore: 'Account restored',
};

const ACTION_KIND: Record<AdminUserAction, AdminUserActivityEntry['kind']> = {
  ban: 'banned',
  unban: 'unbanned',
  revokeSessions: 'sessionsRevoked',
  resetTwoFactor: 'twoFactorReset',
  sendPasswordReset: 'passwordResetSent',
  restore: 'restored',
};

export default function AdminUserDetailView({ detail, allUsers, currentAdminId }: AdminUserDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState<AdminUserSession[]>(detail.sessions);
  const [signIns, setSignIns] = useState<AdminUserSignIn[]>(detail.signIns);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(detail.twoFactorEnabled);
  const [activity, setActivity] = useState<AdminUserActivityEntry[]>(detail.activity);
  const [roles, setRoles] = useState(detail.roles);

  const currentAdminName = allUsers.find((entry) => entry.id === currentAdminId)?.name ?? 'You';

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

      if (action === 'ban' || action === 'revokeSessions') {
        setSessions((previous) => previous.map((session) => ({ ...session, revoked: true, isCurrent: false })));
      }

      if (action === 'resetTwoFactor') setTwoFactorEnabled(false);

      recordActivity(ACTION_KIND[action], ACTION_SUMMARY[action], reason);
    },
    [detail.id, recordActivity],
  );

  const { users, requestRestrict, requestConfirm, actionModals } = useAdminUserActions(
    allUsers,
    currentAdminId,
    handleResolved,
  );

  const user = { ...(users.find((entry) => entry.id === detail.id) ?? detail), roles };
  const isSelf = user.id === currentAdminId;
  const activeTab = (TABS.find((tab) => tab.id === searchParams.get('tab'))?.id ?? 'overview') as TabId;

  const selectTab = (tab: TabId) => {
    const next = new URLSearchParams(searchParams.toString());
    if (tab === 'overview') next.delete('tab');
    else next.set('tab', tab);
    const query = next.toString();
    router.replace(query.length > 0 ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (activeTab === 'sessions') {
      adminUserApi
        .getUserSessions(detail.id)
        .then((liveSessions) => setSessions(liveSessions))
        .catch(() => {});
      adminUserApi
        .getUserSignIns(detail.id)
        .then((page) => {
          if (page.items) setSignIns(page.items);
        })
        .catch(() => {});
    } else if (activeTab === 'activity') {
      adminUserApi
        .getUserActivities(detail.id)
        .then((page) => setActivity(page.items))
        .catch(() => {});
    }
  }, [activeTab, detail.id]);

  const handleRevokeSingleSession = async (sessionId: number | string) => {
    try {
      await adminUserApi.revokeSession(detail.id, sessionId);
      setSessions((previous) =>
        previous.map((session) =>
          String(session.id) === String(sessionId) ? { ...session, revoked: true, isCurrent: false } : session,
        ),
      );
      recordActivity('sessionsRevoked', `Session #${sessionId} revoked`);
      toast.success('Session revoked successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke session');
    }
  };

  const grantRole = async (data: GrantRoleFormData) => {
    try {
      const updated = await adminUserApi.grantRole(detail.id, {
        role: data.role,
        expiresAt: data.isTemporary && data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
        reason: data.reason,
      });
      setRoles(updated.roles);
      recordActivity('roleGranted', `${data.role} role granted`, data.reason);
      toast.success(`Granted the ${data.role} role to ${user.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to grant role');
    }
  };

  const revokeRole = async (role: RoleType) => {
    try {
      const updated = await adminUserApi.revokeRole(detail.id, role);
      setRoles(updated.roles);
      recordActivity('roleRevoked', `${role} role revoked`);
      toast.success(`Revoked the ${role} role from ${user.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke role');
    }
  };

  return (
    <div className="space-y-4">
      <AdminUserDetailHeader
        user={user}
        isSelf={isSelf}
        banBlockedReason={restrictBlockedReason(user, 'ban', currentAdminId, users)}
        onRestrict={(kind) => requestRestrict(kind, [user])}
        onLift={(kind) => requestConfirm(kind, [user])}
        onRevokeSessions={() => requestConfirm('revokeSessions', [user])}
      />

      <div className="dark:border-forest-800 border-outline-variant -mx-1 overflow-x-auto border-b px-1">
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
                  'text-body-md relative cursor-pointer px-3 py-2.5 font-bold whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'dark:text-forest-300 dark:hover:text-forest-100 text-on-surface-variant hover:text-on-surface-variant',
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
          currentAdminId={currentAdminId}
          onGrant={grantRole}
          onRevoke={revokeRole}
        />
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <AdminUserSessionsTab
            sessions={sessions}
            onRevokeAll={() => requestConfirm('revokeSessions', [user])}
            onRevokeSession={handleRevokeSingleSession}
          />
          <AdminUserSignInHistory signIns={signIns} />
        </div>
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

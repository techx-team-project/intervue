'use client';

import AdminUserConfirmDialog from '@/components/admin/users/AdminUserConfirmDialog';
import AdminUserRestrictDialog from '@/components/admin/users/AdminUserRestrictDialog';
import { RESTRICTION_META } from '@/constants/admin-user';
import { restrictBlockedReason } from '@/lib/admin-user';
import type { RestrictUserFormData } from '@/schemas/admin-user.schema';
import type { AdminUserListItem, AdminUserRestrictionKind } from '@/types/admin-user';
import { useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export type AdminUserConfirmKind = 'unlock' | 'unban' | 'revokeSessions' | 'resetTwoFactor' | 'sendPasswordReset';

export type AdminUserAction = AdminUserRestrictionKind | AdminUserConfirmKind;

interface RestrictRequest {
  kind: AdminUserRestrictionKind;
  users: AdminUserListItem[];
}

interface ConfirmRequest {
  kind: AdminUserConfirmKind;
  users: AdminUserListItem[];
}

interface ConfirmCopy {
  title: string;
  description: string;
  consequences: string[];
  confirmLabel: string;
}

function plural(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? '' : 's'}`;
}

function subjectOf(users: AdminUserListItem[]): string {
  return users.length === 1 ? users[0].name : `${users.length} accounts`;
}

function confirmCopy({ kind, users }: ConfirmRequest): ConfirmCopy {
  const subject = subjectOf(users);
  const sessionCount = users.reduce((total, user) => total + user.activeSessionCount, 0);

  switch (kind) {
    case 'unlock':
    case 'unban': {
      const isUnban = kind === 'unban';
      return {
        title: `${isUnban ? 'Unban' : 'Unlock'} — ${subject}`,
        description: 'Sign-in is restored immediately.',
        consequences: [
          'Sign-in is allowed again right away',
          'Existing sessions stay revoked — the user signs in fresh',
          isUnban
            ? 'Public content becomes visible again'
            : 'Public content was never hidden, so nothing changes there',
          `The original ${isUnban ? 'ban' : 'lock'} and its reason remain in the audit log`,
        ],
        confirmLabel:
          users.length === 1
            ? `${isUnban ? 'Unban' : 'Unlock'} account`
            : `${isUnban ? 'Unban' : 'Unlock'} ${users.length} accounts`,
      };
    }
    case 'revokeSessions':
      return {
        title: `Revoke all sessions — ${subject}`,
        description: 'Signs the account out of every device.',
        consequences: [
          `Revokes ${plural(sessionCount, 'refresh token')}`,
          'The live access token is blacklisted until it expires, at most 15 minutes',
          'This cannot be undone — the user has to sign in again',
        ],
        confirmLabel: 'Revoke sessions',
      };
    case 'resetTwoFactor':
      return {
        title: `Reset two-factor — ${subject}`,
        description: 'Removes the authenticator secret and every recovery code.',
        consequences: [
          'The account signs in with its password alone until two-factor is set up again',
          'All recovery codes are invalidated',
          'This cannot be undone — ask the user to re-enable two-factor',
        ],
        confirmLabel: 'Reset two-factor',
      };
    case 'sendPasswordReset':
    default:
      return {
        title: `Send password reset — ${subject}`,
        description: 'Emails a single-use reset link to the account address.',
        consequences: [
          'The link can be used once and expires on its own',
          'The current password keeps working until the link is used',
          'No session is revoked',
        ],
        confirmLabel: 'Send reset email',
      };
  }
}

export function useAdminUserActions(
  initialUsers: AdminUserListItem[],
  currentAdminId: number,
  onResolved?: (action: AdminUserAction, userIds: number[], reason?: string) => void,
) {
  const [users, setUsers] = useState(initialUsers);
  const [restrictRequest, setRestrictRequest] = useState<RestrictRequest | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);

  const currentAdminName = users.find((user) => user.id === currentAdminId)?.name ?? 'You';

  const patchUsers = useCallback((ids: number[], changes: (user: AdminUserListItem) => AdminUserListItem) => {
    setUsers((previous) => previous.map((user) => (ids.includes(user.id) ? changes(user) : user)));
  }, []);

  const undoableToast = useCallback(
    (message: string) => {
      const snapshot = users;
      toast.success(message, { action: { label: 'Undo', onClick: () => setUsers(snapshot) } });
    },
    [users],
  );

  const requestRestrict = useCallback(
    (kind: AdminUserRestrictionKind, targets: AdminUserListItem[]) => {
      const allowed = targets.filter((user) => restrictBlockedReason(user, kind, currentAdminId, users) === null);
      const blocked = targets.length - allowed.length;

      if (allowed.length === 0) {
        toast.error(
          targets.length === 1
            ? (restrictBlockedReason(targets[0], kind, currentAdminId, users) ?? '')
            : `None of the selected accounts can be ${kind === 'ban' ? 'banned' : 'locked'}`,
        );
        return;
      }

      if (blocked > 0) toast.warning(`${plural(blocked, 'account')} skipped — they cannot be restricted`);

      setRestrictRequest({ kind, users: allowed });
    },
    [currentAdminId, users],
  );

  const confirmRestrict = useCallback(
    (data: RestrictUserFormData) => {
      if (!restrictRequest) return;
      const { kind, users: targets } = restrictRequest;
      setRestrictRequest(null);

      patchUsers(
        targets.map((user) => user.id),
        (user) => ({
          ...user,
          status: RESTRICTION_META[kind].status,
          activeSessionCount: 0,
          restrictionImpact: { ...user.restrictionImpact, activeSessionCount: 0 },
          restriction: {
            kind,
            reason: data.reason,
            detail: data.detail?.length ? data.detail : null,
            at: new Date().toISOString(),
            byName: currentAdminName,
            expiresAt: data.isTemporary && data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
          },
        }),
      );

      onResolved?.(
        kind,
        targets.map((user) => user.id),
        data.reason,
      );
      undoableToast(`${kind === 'ban' ? 'Banned' : 'Locked'} ${subjectOf(targets)} — ${data.reason}`);
    },
    [restrictRequest, patchUsers, undoableToast, currentAdminName, onResolved],
  );

  const confirmPending = useCallback(() => {
    if (!confirmRequest) return;
    const { kind, users: targets } = confirmRequest;
    const ids = targets.map((user) => user.id);
    setConfirmRequest(null);
    onResolved?.(kind, ids);

    switch (kind) {
      case 'unlock':
      case 'unban':
        patchUsers(ids, (user) => ({ ...user, status: 'ACTIVE', restriction: null }));
        undoableToast(`${kind === 'unban' ? 'Unbanned' : 'Unlocked'} ${subjectOf(targets)}`);
        return;
      case 'revokeSessions':
        patchUsers(ids, (user) => ({
          ...user,
          activeSessionCount: 0,
          restrictionImpact: { ...user.restrictionImpact, activeSessionCount: 0 },
        }));
        toast.success(`Signed ${subjectOf(targets)} out of every device`);
        return;
      case 'resetTwoFactor':
        toast.success(`Two-factor reset for ${subjectOf(targets)}`);
        return;
      case 'sendPasswordReset':
      default:
        toast.success(`Password reset email sent to ${subjectOf(targets)}`);
    }
  }, [confirmRequest, patchUsers, undoableToast, onResolved]);

  const requestConfirm = useCallback((kind: AdminUserConfirmKind, targets: AdminUserListItem[]) => {
    if (targets.length === 0) return;
    setConfirmRequest({ kind, users: targets });
  }, []);

  const actionModals: ReactNode = (
    <>
      {restrictRequest && (
        <AdminUserRestrictDialog
          kind={restrictRequest.kind}
          users={restrictRequest.users}
          onClose={() => setRestrictRequest(null)}
          onConfirm={confirmRestrict}
        />
      )}

      {confirmRequest && (
        <AdminUserConfirmDialog
          {...confirmCopy(confirmRequest)}
          onClose={() => setConfirmRequest(null)}
          onConfirm={confirmPending}
        />
      )}
    </>
  );

  return { users, requestRestrict, requestConfirm, actionModals };
}

'use client';

import AdminUserConfirmDialog from '@/components/admin/users/AdminUserConfirmDialog';
import AdminUserLockDialog from '@/components/admin/users/AdminUserLockDialog';
import { lockBlockedReason } from '@/lib/admin-user';
import type { LockUserFormData } from '@/schemas/admin-user.schema';
import type { AdminUserListItem } from '@/types/admin-user';
import { useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export type AdminUserConfirmKind = 'unlock' | 'revokeSessions' | 'resetTwoFactor' | 'sendPasswordReset';

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
      return {
        title: `Unlock — ${subject}`,
        description: 'Sign-in is restored immediately.',
        consequences: [
          'Sign-in is allowed again right away',
          'Existing sessions stay revoked — the user signs in fresh',
          'The original lock and its reason remain in the audit log',
        ],
        confirmLabel: users.length === 1 ? 'Unlock account' : `Unlock ${users.length} accounts`,
      };
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

export type AdminUserAction = 'lock' | AdminUserConfirmKind;

export function useAdminUserActions(
  initialUsers: AdminUserListItem[],
  currentAdminId: number,
  onResolved?: (action: AdminUserAction, userIds: number[], reason?: string) => void,
) {
  const [users, setUsers] = useState(initialUsers);
  const [lockRequest, setLockRequest] = useState<AdminUserListItem[] | null>(null);
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

  const requestLock = useCallback(
    (targets: AdminUserListItem[]) => {
      const blocked = targets.filter((user) => lockBlockedReason(user, currentAdminId, users) !== null);
      const allowed = targets.filter((user) => lockBlockedReason(user, currentAdminId, users) === null);

      if (allowed.length === 0) {
        toast.error(
          blocked.length === 1
            ? (lockBlockedReason(blocked[0], currentAdminId, users) ?? '')
            : 'None of the selected accounts can be locked',
        );
        return;
      }

      if (blocked.length > 0) {
        toast.warning(`${plural(blocked.length, 'account')} skipped — they cannot be locked`);
      }

      setLockRequest(allowed);
    },
    [currentAdminId, users],
  );

  const confirmLock = useCallback(
    (data: LockUserFormData) => {
      if (!lockRequest) return;
      const targets = lockRequest;
      setLockRequest(null);

      patchUsers(
        targets.map((user) => user.id),
        (user) => ({
          ...user,
          status: 'LOCKED',
          activeSessionCount: 0,
          lockImpact: { ...user.lockImpact, activeSessionCount: 0 },
          lock: {
            reason: data.reason,
            detail: data.detail?.length ? data.detail : null,
            at: new Date().toISOString(),
            byName: currentAdminName,
          },
        }),
      );

      onResolved?.(
        'lock',
        targets.map((user) => user.id),
        data.reason,
      );
      undoableToast(`Locked ${subjectOf(targets)} — ${data.reason}`);
    },
    [lockRequest, patchUsers, undoableToast, currentAdminName, onResolved],
  );

  const confirmPending = useCallback(() => {
    if (!confirmRequest) return;
    const { kind, users: targets } = confirmRequest;
    const ids = targets.map((user) => user.id);
    setConfirmRequest(null);
    onResolved?.(kind, ids);

    switch (kind) {
      case 'unlock':
        patchUsers(ids, (user) => ({ ...user, status: 'ACTIVE', lock: null }));
        undoableToast(`Unlocked ${subjectOf(targets)}`);
        return;
      case 'revokeSessions':
        patchUsers(ids, (user) => ({
          ...user,
          activeSessionCount: 0,
          lockImpact: { ...user.lockImpact, activeSessionCount: 0 },
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
      {lockRequest && (
        <AdminUserLockDialog users={lockRequest} onClose={() => setLockRequest(null)} onConfirm={confirmLock} />
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

  return { users, requestLock, requestConfirm, actionModals };
}

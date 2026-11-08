'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { USER_ROLE_META } from '@/constants/admin-user';
import { ROLES } from '@/constants/auth';
import { grantRoleSchema, type GrantRoleFormData } from '@/schemas/admin-user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollText, ShieldAlert } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

interface AdminUserGrantRoleDialogProps {
  userName: string;
  grantableRoles: GrantRoleFormData['role'][];
  onClose: () => void;
  onConfirm: (data: GrantRoleFormData) => void;
}

export default function AdminUserGrantRoleDialog({
  userName,
  grantableRoles,
  onClose,
  onConfirm,
}: AdminUserGrantRoleDialogProps) {
  const { handleSubmit, register, control, formState } = useForm<GrantRoleFormData>({
    resolver: zodResolver(grantRoleSchema),
    defaultValues: { role: grantableRoles[0], isTemporary: false, expiresAt: '', reason: '' },
  });

  const role = useWatch({ control, name: 'role' });
  const isTemporary = useWatch({ control, name: 'isTemporary' });

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title={`Grant a role — ${userName}`}
      description="The grant records who issued it and when it lapses."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onConfirm)}>Grant role</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Select
          label="Role"
          options={grantableRoles.map((entry) => ({ value: entry, label: USER_ROLE_META[entry].label }))}
          {...register('role')}
        />

        {role === ROLES.ADMIN && (
          <p className="text-body-sm flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-800">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            An admin role grants access to this panel. Prefer a temporary grant and keep permissions as narrow as the
            work needs.
          </p>
        )}

        <label className="text-body-md text-on-surface flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            {...register('isTemporary')}
            className="accent-primary border-outline mt-0.5 h-4 w-4 cursor-pointer rounded"
          />
          <span>
            Temporary grant
            <span className="text-label-sm text-on-surface-variant mt-0.5 block">
              The role stops counting as active after the expiry date — nothing has to be revoked by hand.
            </span>
          </span>
        </label>

        {isTemporary && (
          <Input
            type="date"
            label="Expires on"
            error={formState.errors.expiresAt?.message}
            {...register('expiresAt')}
          />
        )}

        <div>
          <label htmlFor="admin-grant-reason" className="text-body-md text-on-surface font-semibold">
            Reason
          </label>
          <Textarea
            id="admin-grant-reason"
            rows={2}
            placeholder="Why does this account need the role?"
            className="mt-2"
            {...register('reason')}
          />
          {formState.errors.reason && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{formState.errors.reason.message}</p>
          )}
        </div>

        <p className="bg-surface-container-low text-on-surface-variant flex items-start gap-2 rounded-lg px-3 py-2 text-xs">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp. The next token refresh picks up the new role.
        </p>
      </div>
    </Modal>
  );
}

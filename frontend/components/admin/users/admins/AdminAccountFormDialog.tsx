'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { adminAccountSchema, type AdminAccountFormData } from '@/schemas/admin-user.schema';
import type { AdminPermission } from '@/types/admin';
import type { AdminAccountListItem } from '@/types/admin-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck, ScrollText } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import AdminPermissionPicker from './AdminPermissionPicker';

interface AdminAccountFormDialogProps {
  account?: AdminAccountListItem;
  onClose: () => void;
  onConfirm: (data: AdminAccountFormData) => void;
}

export default function AdminAccountFormDialog({ account, onClose, onConfirm }: AdminAccountFormDialogProps) {
  const isEdit = account !== undefined;
  const { handleSubmit, register, control, formState } = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: {
      name: account?.name ?? '',
      email: account?.email ?? '',
      permissions: account?.permissions ?? [],
      expiresAt: account?.expiresAt ? account.expiresAt.slice(0, 10) : '',
    },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title={isEdit ? `Edit admin — ${account.name}` : 'Create an admin account'}
      description={
        isEdit
          ? 'Changing permissions takes effect on the next token refresh.'
          : 'The invitee sets their own password from an email link. Admins never set a password for someone else.'
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onConfirm)}>{isEdit ? 'Save changes' : 'Send invitation'}</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input label="Full name" error={formState.errors.name?.message} readOnly={isEdit} {...register('name')} />

        <Input
          label="Email"
          type="email"
          error={formState.errors.email?.message}
          readOnly={isEdit}
          helperText={isEdit ? 'The email belongs to the account record and is changed by the user.' : undefined}
          {...register('email')}
        />

        <Controller
          control={control}
          name="permissions"
          render={({ field }) => (
            <AdminPermissionPicker
              selected={field.value}
              error={formState.errors.permissions?.message}
              onToggle={(permission: AdminPermission) =>
                field.onChange(
                  field.value.includes(permission)
                    ? field.value.filter((entry) => entry !== permission)
                    : [...field.value, permission],
                )
              }
            />
          )}
        />

        <Input
          type="date"
          label="Admin role expires on"
          helperText="Leave empty for a permanent grant. A dated grant stops being active on its own."
          error={formState.errors.expiresAt?.message}
          {...register('expiresAt')}
        />

        {!isEdit && (
          <p className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-[12.5px] text-sky-800">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
            An invitation is emailed to this address. The account becomes an admin only after the invitee verifies the
            email and signs in.
          </p>
        )}

        <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp.
        </p>
      </div>
    </Modal>
  );
}

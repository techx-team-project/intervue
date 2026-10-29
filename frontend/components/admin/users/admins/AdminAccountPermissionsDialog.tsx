'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { adminAccountSchema, type AdminAccountFormData } from '@/schemas/admin-user.schema';
import type { AdminPermission } from '@/types/admin';
import type { AdminAccountListItem } from '@/types/admin-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollText } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import AdminPermissionPicker from './AdminPermissionPicker';

interface AdminAccountPermissionsDialogProps {
  account: AdminAccountListItem;
  onClose: () => void;
  onConfirm: (data: AdminAccountFormData) => void;
}

export default function AdminAccountPermissionsDialog({
  account,
  onClose,
  onConfirm,
}: AdminAccountPermissionsDialogProps) {
  const { handleSubmit, register, control, formState } = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: {
      name: account.name,
      email: account.email,
      permissions: account.permissions,
      expiresAt: account.expiresAt ? account.expiresAt.slice(0, 10) : '',
    },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title={`Permissions — ${account.name}`}
      description="Changes take effect on the account's next token refresh."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onConfirm)}>Save changes</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <input type="hidden" {...register('name')} />
        <input type="hidden" {...register('email')} />

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
          helperText="Leave empty for a permanent grant."
          error={formState.errors.expiresAt?.message}
          {...register('expiresAt')}
        />

        <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp.
        </p>
      </div>
    </Modal>
  );
}

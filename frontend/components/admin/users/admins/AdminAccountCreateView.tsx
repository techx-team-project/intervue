'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { adminAccountSchema, type AdminAccountFormData } from '@/schemas/admin-user.schema';
import type { AdminPermission } from '@/types/admin';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MailCheck, ScrollText, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AdminPermissionPicker from './AdminPermissionPicker';

export default function AdminAccountCreateView() {
  const router = useRouter();
  const { handleSubmit, register, control, formState } = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: { name: '', email: '', permissions: [], expiresAt: '' },
  });

  const submit = (form: AdminAccountFormData) => {
    toast.success(`Invitation sent to ${form.email}`, {
      description: `${form.permissions.length} permission${form.permissions.length === 1 ? '' : 's'} will apply once they sign in.`,
    });
    router.push(ROUTES.ADMIN_ADMINS);
  };

  return (
    <div className="space-y-4">
      <AdminPageHeader
        description="Invite someone to the admin panel and decide exactly what they may reach."
        actions={
          <Link
            href={ROUTES.ADMIN_ADMINS}
            className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to admin accounts
          </Link>
        }
      />

      <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <section className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e9eaec] bg-white p-5 shadow-xs">
            <h2 className="text-navy dark:text-forest-50 text-[14px] font-bold">Who is being invited</h2>
            <p className="dark:text-forest-300 mt-0.5 text-[12px] text-[#64748b]">
              The invitee sets their own password from an email link. Admins never set a password for someone else.
            </p>

            <div className="mt-4 space-y-4">
              <Input
                label="Full name"
                placeholder="Nguyễn Văn A"
                error={formState.errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Work email"
                type="email"
                placeholder="name@intervue.vn"
                error={formState.errors.email?.message}
                {...register('email')}
              />

              <Input
                type="date"
                label="Admin role expires on"
                helperText="Leave empty for a permanent grant. A dated grant stops being active on its own."
                error={formState.errors.expiresAt?.message}
                {...register('expiresAt')}
              />
            </div>
          </section>

          <section className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e9eaec] bg-white p-5 shadow-xs">
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
          </section>
        </div>

        <aside className="space-y-3">
          <div className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-xs">
            <h2 className="text-navy dark:text-forest-50 text-[13px] font-bold">Before you invite</h2>

            <p className="mt-3 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-[12.5px] text-sky-800">
              <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
              An invitation is emailed to this address. The account becomes an admin only after the invitee verifies the
              email and signs in.
            </p>

            <p className="mt-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-800">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              Grant only the permissions the work needs, and prefer a dated grant for temporary help. Admin access
              cannot be self-assigned, so every grant is traceable to you.
            </p>

            <p className="mt-2 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Recorded against your admin account with a timestamp.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Button type="submit">Send invitation</Button>
              <Link
                href={ROUTES.ADMIN_ADMINS}
                className="dark:text-forest-300 dark:hover:bg-forest-850 rounded-xl px-3 py-2 text-center text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

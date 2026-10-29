'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { RESTRICTION_META, RESTRICTION_REASON_PRESETS } from '@/constants/admin-user';
import { cn } from '@/lib/utils';
import { restrictUserSchema, type RestrictUserFormData } from '@/schemas/admin-user.schema';
import type { AdminUserListItem, AdminUserRestrictionKind } from '@/types/admin-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface AdminUserRestrictDialogProps {
  kind: AdminUserRestrictionKind;
  users: AdminUserListItem[];
  onClose: () => void;
  onConfirm: (data: RestrictUserFormData) => void;
}

function plural(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? '' : 's'}`;
}

export default function AdminUserRestrictDialog({ kind, users, onClose, onConfirm }: AdminUserRestrictDialogProps) {
  const [isCustomReason, setIsCustomReason] = useState(false);
  const { handleSubmit, setValue, register, control, formState } = useForm<RestrictUserFormData>({
    resolver: zodResolver(restrictUserSchema),
    defaultValues: { reason: '', detail: '', notifyUser: true, isTemporary: false, expiresAt: '' },
  });

  const reason = useWatch({ control, name: 'reason' });
  const isTemporary = useWatch({ control, name: 'isTemporary' });

  const meta = RESTRICTION_META[kind];
  const isBan = kind === 'ban';
  const isBulk = users.length > 1;
  const subject = isBulk ? `${users.length} accounts` : users[0].name;

  const sessionCount = users.reduce((total, user) => total + user.restrictionImpact.activeSessionCount, 0);
  const jobPostCount = users.reduce((total, user) => total + user.restrictionImpact.publishedJobPostCount, 0);
  const applicationCount = users.reduce((total, user) => total + user.restrictionImpact.applicationsInProgressCount, 0);

  const consequences: string[] = [
    sessionCount > 0 ? `Revokes ${plural(sessionCount, 'active session')} immediately` : 'No active session to revoke',
    isBulk
      ? 'Blocks sign-in on every selected account until an admin lifts it'
      : 'Blocks sign-in until an admin lifts it',
  ];

  if (jobPostCount > 0) {
    consequences.push(
      isBan
        ? `Hides ${plural(jobPostCount, 'published job post')} from the public site — confirm the policy`
        : `${plural(jobPostCount, 'published job post')} stay visible — confirm the policy`,
    );
  }

  if (applicationCount > 0) {
    consequences.push(`${plural(applicationCount, 'application')} in progress are not withdrawn`);
  }

  if (isBan) {
    consequences.push('Recorded as a policy decision — unbanning does not erase it');
  }

  const selectReason = (preset: string) => {
    setIsCustomReason(false);
    setValue('reason', preset, { shouldValidate: true });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title={isBulk ? `${meta.verb} ${subject}` : `${meta.verb} account — ${subject}`}
      description={`${meta.blurb} ${
        isBulk
          ? 'The same reason is recorded once per account in the audit log.'
          : 'The reason is sent to the user and recorded in the audit log.'
      }`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onConfirm)}>
            {isBulk ? `${meta.verb} ${users.length} accounts` : `${meta.verb} account`}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <fieldset>
          <legend className="text-[13px] font-semibold text-slate-700">Reason</legend>

          <div className="mt-2 space-y-1.5">
            {RESTRICTION_REASON_PRESETS[kind].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => selectReason(preset)}
                className={cn(
                  'flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-left text-[13px] transition-colors',
                  !isCustomReason && reason === preset
                    ? 'border-rose-300 bg-rose-50 font-semibold text-rose-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50',
                )}
              >
                {preset}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsCustomReason(true);
                setValue('reason', '', { shouldValidate: false });
              }}
              className={cn(
                'flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-left text-[13px] transition-colors',
                isCustomReason
                  ? 'border-rose-300 bg-rose-50 font-semibold text-rose-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50',
              )}
            >
              Write another reason
            </button>
          </div>

          {isCustomReason ? (
            <Input
              autoFocus
              placeholder={`State the reason this account is being ${isBan ? 'banned' : 'locked'}`}
              className="mt-2"
              {...register('reason')}
            />
          ) : (
            <input type="hidden" {...register('reason')} />
          )}

          {formState.errors.reason && (
            <p className="mt-2 text-xs font-medium text-rose-600">{formState.errors.reason.message}</p>
          )}
        </fieldset>

        <div>
          <label htmlFor="admin-restrict-detail" className="text-[13px] font-semibold text-slate-700">
            Note for the user <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <Textarea
            id="admin-restrict-detail"
            rows={3}
            placeholder="Tell them exactly what to fix so the account can be restored."
            className="mt-2"
            {...register('detail')}
          />
          {formState.errors.detail && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{formState.errors.detail.message}</p>
          )}
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="flex items-center gap-2 text-[12.5px] font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            What this {isBan ? 'ban' : 'lock'} does
          </p>
          <ul className="mt-2 space-y-1 text-[12.5px] text-amber-800">
            {consequences.map((consequence) => (
              <li key={consequence} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{consequence}</span>
              </li>
            ))}
          </ul>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-slate-700">
          <input
            type="checkbox"
            {...register('isTemporary')}
            className="accent-primary mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300"
          />
          <span>
            Lift automatically on a date
            <span className="mt-0.5 block text-[11.5px] text-slate-500">
              Leave off to keep it in place until an admin lifts it by hand.
            </span>
          </span>
        </label>

        {isTemporary && (
          <Input type="date" label="Lifts on" error={formState.errors.expiresAt?.message} {...register('expiresAt')} />
        )}

        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700">
          <input
            type="checkbox"
            {...register('notifyUser')}
            className="accent-primary h-4 w-4 cursor-pointer rounded border-slate-300"
          />
          Email the user the reason
        </label>

        <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp. {meta.liftVerb} is recorded too — neither entry can be
          deleted.
        </p>
      </div>
    </Modal>
  );
}

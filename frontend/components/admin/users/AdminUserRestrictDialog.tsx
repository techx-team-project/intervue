'use client';

import { isoDateAfterDays } from '@/utils/datetime';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { RESTRICTION_META, RESTRICTION_REASON_PRESETS } from '@/constants/admin-user';
import { ADMIN_EXPIRY_MAX_DAYS } from '@/constants/admin-user';
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
    consequences.push(`Hides ${plural(jobPostCount, 'published job post')} from the public site — confirm the policy`);
  }

  if (applicationCount > 0) {
    consequences.push(`${plural(applicationCount, 'application')} in progress are not withdrawn`);
  }

  consequences.push('Recorded as a policy decision — unbanning does not erase it');

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
          <legend className="text-body-md text-on-surface font-semibold">Reason</legend>

          <div className="mt-2 space-y-1.5">
            {RESTRICTION_REASON_PRESETS[kind].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => selectReason(preset)}
                className={cn(
                  'text-body-md flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-left transition-colors',
                  !isCustomReason && reason === preset
                    ? 'border-rose-300 bg-rose-50 font-semibold text-rose-800'
                    : 'border-outline-variant text-on-surface hover:bg-surface-container-low',
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
                'text-body-md flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-left transition-colors',
                isCustomReason
                  ? 'border-rose-300 bg-rose-50 font-semibold text-rose-800'
                  : 'border-outline-variant text-on-surface hover:bg-surface-container-low',
              )}
            >
              Write another reason
            </button>
          </div>

          {isCustomReason ? (
            <Input
              autoFocus
              placeholder="State the reason this account is being banned"
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
          <label htmlFor="admin-restrict-detail" className="text-body-md text-on-surface font-semibold">
            Note for the user <span className="text-outline font-normal">(optional)</span>
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
          <p className="text-body-sm flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            What this ban does
          </p>
          <ul className="text-body-sm mt-2 space-y-1 text-amber-800">
            {consequences.map((consequence) => (
              <li key={consequence} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{consequence}</span>
              </li>
            ))}
          </ul>
        </div>

        <label className="text-body-md text-on-surface flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            {...register('isTemporary')}
            className="accent-primary border-outline mt-0.5 h-4 w-4 cursor-pointer rounded"
          />
          <span>
            Lift automatically on a date
            <span className="text-label-sm text-on-surface-variant mt-0.5 block">
              Leave off to keep it in place until an admin lifts it by hand.
            </span>
          </span>
        </label>

        {isTemporary && (
          <Input
            type="date"
            min={isoDateAfterDays(1)}
            max={isoDateAfterDays(ADMIN_EXPIRY_MAX_DAYS)}
            label="Lifts on"
            error={formState.errors.expiresAt?.message}
            {...register('expiresAt')}
          />
        )}

        <label className="text-body-md text-on-surface flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            {...register('notifyUser')}
            className="accent-primary border-outline h-4 w-4 cursor-pointer rounded"
          />
          Email the user the reason
        </label>

        <p className="bg-surface-container-low text-on-surface-variant flex items-start gap-2 rounded-lg px-3 py-2 text-xs">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp. {meta.liftVerb} is recorded too — neither entry can be
          deleted.
        </p>
      </div>
    </Modal>
  );
}

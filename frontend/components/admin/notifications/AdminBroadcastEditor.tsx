'use client';

import AdminUserConfirmDialog from '@/components/admin/users/AdminUserConfirmDialog';
import NotificationMarkdown from '@/components/common/NotificationMarkdown';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { useAdminBroadcast } from '@/hooks/useAdminBroadcasts';
import { broadcastSchema, type BroadcastFormValues } from '@/schemas/notification.schema';
import type { AudiencePreviewResource } from '@/types/notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Eye, Send, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AdminBroadcastEditorProps {
  broadcastId: number | null;
}

const AUDIENCE_OPTIONS = [
  { value: 'CANDIDATE', label: 'All candidates' },
  { value: 'RECRUITER', label: 'All recruiters' },
  { value: 'ADMIN', label: 'All administrators' },
];

const SEVERITY_OPTIONS = [
  { value: 'INFO', label: 'Info' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'DANGER', label: 'Critical' },
];

const EMPTY_FORM: BroadcastFormValues = {
  audience: 'CANDIDATE',
  severity: 'INFO',
  title: '',
  summary: '',
  bodyMarkdown: '',
  actionUrl: '',
  actionLabel: '',
  scheduledAt: '',
};

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function AdminBroadcastEditor({ broadcastId }: AdminBroadcastEditorProps) {
  const router = useRouter();
  const { broadcast, audience, isLoading, isError, create, update, send, isSaving, isSending } =
    useAdminBroadcast(broadcastId);
  const [confirmSend, setConfirmSend] = useState(false);

  const isLocked = broadcast !== null && broadcast.status !== 'DRAFT' && broadcast.status !== 'SCHEDULED';

  const { control, handleSubmit, reset, formState } = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    values: broadcast
      ? {
          audience: broadcast.audience,
          severity: broadcast.severity,
          title: broadcast.title,
          summary: broadcast.summary,
          bodyMarkdown: broadcast.bodyMarkdown,
          actionUrl: broadcast.actionUrl ?? '',
          actionLabel: broadcast.actionLabel ?? '',
          scheduledAt: toLocalInput(broadcast.scheduledAt),
        }
      : EMPTY_FORM,
  });

  const previewBody = useWatch({ control, name: 'bodyMarkdown' });
  const previewTitle = useWatch({ control, name: 'title' });

  const persist = async (values: BroadcastFormValues) => {
    const payload = {
      audience: values.audience,
      severity: values.severity,
      title: values.title.trim(),
      summary: values.summary.trim(),
      bodyMarkdown: values.bodyMarkdown.trim(),
      actionUrl: values.actionUrl?.trim() || null,
      actionLabel: values.actionLabel?.trim() || null,
      scheduledAt: values.scheduledAt ? new Date(values.scheduledAt).toISOString() : null,
    };

    if (broadcastId === null) {
      const created = await create(payload);
      toast.success('Draft saved');
      router.replace(`${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/${created.id}/edit`);
      return;
    }
    await update(payload);
    reset(values);
    toast.success('Announcement updated');
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await persist(values);
    } catch {
      toast.error('Could not save the announcement');
    }
  });

  const handleSend = async () => {
    setConfirmSend(false);
    try {
      await send();
      toast.success('Announcement is being delivered');
      router.push(ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS);
    } catch {
      toast.error('Could not send the announcement');
    }
  };

  if (broadcastId !== null && isLoading) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="dark:bg-forest-800 h-10 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (broadcastId !== null && isError) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-slate-200 bg-white py-16 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 stroke-[1.5] text-amber-500" />
        <p className="dark:text-forest-300 mt-3 text-sm font-semibold text-slate-600">Announcement not found</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="dark:text-forest-50 text-xl font-black text-slate-900 sm:text-2xl">
            {broadcastId === null ? 'New announcement' : 'Edit announcement'}
          </h1>
          {broadcast && (
            <p className="dark:text-forest-400 mt-1 text-xs text-slate-500">
              Status: <span className="font-bold">{broadcast.status}</span>
              {broadcast.deliveredCount > 0 && ` · delivered to ${broadcast.deliveredCount.toLocaleString()}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS)}
          >
            Back
          </Button>
          <Button type="submit" size="sm" disabled={isSaving || isLocked}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          {broadcastId !== null && !isLocked && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isSending || formState.isDirty}
              onClick={() => setConfirmSend(true)}
              title={formState.isDirty ? 'Save your changes before sending' : undefined}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {isSending ? 'Sending…' : 'Send now'}
            </Button>
          )}
        </div>
      </div>

      {isLocked && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          This announcement has already been {broadcast?.status.toLowerCase()} and can no longer be changed. Publish a
          new announcement to issue a correction.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="dark:border-forest-800 dark:bg-forest-900 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="audience"
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label="Audience"
                  options={AUDIENCE_OPTIONS}
                  error={fieldState.error?.message}
                  disabled={isLocked}
                />
              )}
            />
            <Controller
              control={control}
              name="severity"
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label="Severity"
                  options={SEVERITY_OPTIONS}
                  error={fieldState.error?.message}
                  disabled={isLocked}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <Input {...field} label="Title" error={fieldState.error?.message} disabled={isLocked} />
            )}
          />

          <Controller
            control={control}
            name="summary"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Summary"
                rows={2}
                helperText="Shown in the bell dropdown and the list row."
                error={fieldState.error?.message}
                disabled={isLocked}
              />
            )}
          />

          <Controller
            control={control}
            name="bodyMarkdown"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Body (Markdown)"
                rows={10}
                helperText="Supports ## headings, **bold** and - bullet lists."
                error={fieldState.error?.message}
                disabled={isLocked}
              />
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="actionUrl"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Action URL (optional)"
                  placeholder="/jobs"
                  error={fieldState.error?.message}
                  disabled={isLocked}
                />
              )}
            />
            <Controller
              control={control}
              name="actionLabel"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Action label (optional)"
                  error={fieldState.error?.message}
                  disabled={isLocked}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="scheduledAt"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="datetime-local"
                label="Schedule (optional)"
                helperText="Leave empty to keep it as a draft you send manually."
                error={fieldState.error?.message}
                disabled={isLocked}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <AudienceCard preview={audience} />

          <div className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <p className="dark:text-forest-400 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <Eye className="h-3.5 w-3.5" />
              Live preview
            </p>
            <h2 className="dark:text-forest-50 mt-3 text-lg leading-snug font-black text-slate-900">
              {previewTitle || 'Announcement title'}
            </h2>
            <div className="dark:text-forest-200 mt-4 text-sm text-slate-700">
              {previewBody ? (
                <NotificationMarkdown content={previewBody} />
              ) : (
                <p className="dark:text-forest-500 text-slate-400">Body preview appears here as you type.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {confirmSend && broadcast && (
        <AdminUserConfirmDialog
          title="Send this announcement now?"
          description={broadcast.title}
          consequences={[
            audience
              ? `${audience.estimatedRecipients.toLocaleString()} ${broadcast.audience.toLowerCase()} account(s) will receive it.`
              : 'Every active account in the selected audience will receive it.',
            'Recipients who switched off system notifications are skipped automatically.',
            'A sent announcement can no longer be edited, cancelled or deleted.',
          ]}
          confirmLabel="Send now"
          onClose={() => setConfirmSend(false)}
          onConfirm={handleSend}
        />
      )}
    </form>
  );
}

function AudienceCard({ preview }: { preview: AudiencePreviewResource | null }) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <p className="dark:text-forest-400 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        <Users className="h-3.5 w-3.5" />
        Estimated recipients
      </p>
      {preview ? (
        <>
          <p className="dark:text-forest-50 mt-2 text-3xl font-black text-slate-900">
            {preview.estimatedRecipients.toLocaleString()}
          </p>
          <p className="dark:text-forest-400 mt-1 text-xs text-slate-500">
            Active {preview.audience.toLowerCase()} accounts that have not switched off system notifications.
          </p>
        </>
      ) : (
        <p className="dark:text-forest-400 mt-2 text-xs text-slate-500">
          Save the draft first to see how many accounts will receive it.
        </p>
      )}
    </div>
  );
}

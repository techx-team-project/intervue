'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { useAdminFreeQuotas, useUpdateAdminFreeQuotas } from '@/hooks/useFreeQuotas';
import type { FreeQuotaSettings, SaveFreeQuotaSettingsInput } from '@/types/free-quota';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, BriefcaseBusiness, RotateCcw, Save, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuotaDraft {
  aiResumeMatchFreePerMonth: string;
  aiJdGenerateFreePerMonth: string;
  cvReviewFreePerDay: string;
  candidateStarterCredits: string;
  connectDailyInviteLimit: string;
  companyFreePhotoLimit: string;
  jobFreePostLimit: string;
  jobFreeMaxDays: string;
  jobReviewFirstCount: string;
  candidateDailyApplicationLimit: string;
  requireJobSlot: boolean;
}

type NumericQuotaKey = Exclude<keyof QuotaDraft, 'requireJobSlot'>;

const QUOTA_BOUNDS: Record<NumericQuotaKey, { max: number; label: string; helper: string }> = {
  aiResumeMatchFreePerMonth: {
    max: 10_000,
    label: 'AI Resume Match / month',
    helper: 'Free monthly matches per company before consuming paid credits or add-ons.',
  },
  aiJdGenerateFreePerMonth: {
    max: 10_000,
    label: 'AI JD Generate / month',
    helper: 'Free monthly AI job-description drafts per company.',
  },
  connectDailyInviteLimit: {
    max: 10_000,
    label: 'Connect daily invites / recruiter',
    helper: 'Daily InterVue Connect invitation cap per recruiter (Asia/Ho_Chi_Minh day).',
  },
  companyFreePhotoLimit: {
    max: 100,
    label: 'Company free gallery photos',
    helper: 'Maximum company profile photos without an active Brand Page upgrade (minimum 10 with Brand Page).',
  },
  jobFreePostLimit: {
    max: 100,
    label: 'Free job posts / company',
    helper: 'Total job posts a company can publish for free, over its lifetime, before it must buy a package.',
  },
  candidateDailyApplicationLimit: {
    max: 500,
    label: 'Applications / candidate / day',
    helper: 'Applications a candidate can submit per day (Asia/Ho_Chi_Minh). Withdrawing does not give one back.',
  },
  jobReviewFirstCount: {
    max: 100,
    label: 'Jobs reviewed before going live',
    helper:
      'A company needs this many approved jobs before its posts go live without admin review (0 turns review off).',
  },
  jobFreeMaxDays: {
    max: 365,
    label: 'Free job duration (days)',
    helper: 'Longest a free job can stay open, counted from the day it is published.',
  },
  cvReviewFreePerDay: {
    max: 1_000,
    label: 'Candidate CV Review / day',
    helper: 'Free daily AI CV reviews per candidate before starter/paid credits are needed.',
  },
  candidateStarterCredits: {
    max: 1_000,
    label: 'Candidate starter credits',
    helper: 'Welcome credits granted automatically when a new candidate wallet is initialized.',
  },
};

function toDraft(settings: FreeQuotaSettings): QuotaDraft {
  return {
    aiResumeMatchFreePerMonth: String(settings.aiResumeMatchFreePerMonth),
    aiJdGenerateFreePerMonth: String(settings.aiJdGenerateFreePerMonth),
    cvReviewFreePerDay: String(settings.cvReviewFreePerDay),
    candidateStarterCredits: String(settings.candidateStarterCredits),
    connectDailyInviteLimit: String(settings.connectDailyInviteLimit),
    companyFreePhotoLimit: String(settings.companyFreePhotoLimit),
    jobFreePostLimit: String(settings.jobFreePostLimit),
    jobFreeMaxDays: String(settings.jobFreeMaxDays),
    jobReviewFirstCount: String(settings.jobReviewFirstCount),
    candidateDailyApplicationLimit: String(settings.candidateDailyApplicationLimit),
    requireJobSlot: settings.requireJobSlot,
  };
}

function validateQuotaDraft(draft: QuotaDraft):
  | { payload: SaveFreeQuotaSettingsInput; errors: Partial<Record<NumericQuotaKey, string>> }
  | {
      payload: null;
      errors: Partial<Record<NumericQuotaKey, string>>;
    } {
  const errors: Partial<Record<NumericQuotaKey, string>> = {};
  const parsed = {} as Record<NumericQuotaKey, number>;

  (Object.keys(QUOTA_BOUNDS) as NumericQuotaKey[]).forEach((key) => {
    const raw = draft[key].trim();
    const num = Number(raw);
    const max = QUOTA_BOUNDS[key].max;
    if (!raw || !Number.isInteger(num) || num < 0 || num > max) {
      errors[key] = `Integer 0–${max.toLocaleString('en-US')}`;
    } else {
      parsed[key] = num;
    }
  });

  if (Object.keys(errors).length > 0) {
    return { payload: null, errors };
  }

  return {
    payload: {
      aiResumeMatchFreePerMonth: parsed.aiResumeMatchFreePerMonth,
      aiJdGenerateFreePerMonth: parsed.aiJdGenerateFreePerMonth,
      cvReviewFreePerDay: parsed.cvReviewFreePerDay,
      candidateStarterCredits: parsed.candidateStarterCredits,
      connectDailyInviteLimit: parsed.connectDailyInviteLimit,
      companyFreePhotoLimit: parsed.companyFreePhotoLimit,
      jobFreePostLimit: parsed.jobFreePostLimit,
      jobFreeMaxDays: parsed.jobFreeMaxDays,
      jobReviewFirstCount: parsed.jobReviewFirstCount,
      candidateDailyApplicationLimit: parsed.candidateDailyApplicationLimit,
      requireJobSlot: draft.requireJobSlot,
    },
    errors: {},
  };
}

interface FreeQuotasFormProps {
  settings: FreeQuotaSettings;
}

function FreeQuotasForm({ settings }: FreeQuotasFormProps) {
  const [draft, setDraft] = useState<QuotaDraft>(() => toDraft(settings));
  const [submitted, setSubmitted] = useState(false);
  const updateMutation = useUpdateAdminFreeQuotas();

  const validation = validateQuotaDraft(draft);
  const fieldErrors = submitted ? validation.errors : {};

  const baseline = toDraft(settings);
  const isDirty = (Object.keys(baseline) as Array<keyof QuotaDraft>).some((key) => draft[key] !== baseline[key]);

  const handleSave = async () => {
    setSubmitted(true);
    if (!validation.payload) return;
    try {
      const updated = await updateMutation.mutateAsync(validation.payload);
      setDraft(toDraft(updated));
      setSubmitted(false);
      toast.success('Free quota settings updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const renderNumberField = (key: NumericQuotaKey) => {
    const meta = QUOTA_BOUNDS[key];
    return (
      <Input
        key={key}
        label={meta.label}
        type="number"
        min={0}
        max={meta.max}
        radius="lg"
        value={draft[key]}
        onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
        error={fieldErrors[key]}
        helperText={!fieldErrors[key] ? meta.helper : undefined}
        className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 py-2 text-sm font-semibold tabular-nums"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <div>
            <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Company & Recruiter Free Quotas</h2>
            <p className="dark:text-forest-300 text-on-surface-variant text-xs">
              Monthly AI allowances and daily outreach caps applied automatically to every company.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderNumberField('aiResumeMatchFreePerMonth')}
          {renderNumberField('aiJdGenerateFreePerMonth')}
          {renderNumberField('connectDailyInviteLimit')}
          {renderNumberField('companyFreePhotoLimit')}
        </div>
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <Users className="text-primary h-4 w-4" />
          <div>
            <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Candidate Free Tier</h2>
            <p className="dark:text-forest-300 text-on-surface-variant text-xs">
              Daily AI CV review usage and initial starter credit grant for newly initialized wallets.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderNumberField('cvReviewFreePerDay')}
          {renderNumberField('candidateStarterCredits')}
          {renderNumberField('candidateDailyApplicationLimit')}
        </div>
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <BriefcaseBusiness className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Require paid job post slot to publish</h2>
              <p className="dark:text-forest-300 text-on-surface-variant mt-0.5 text-xs">
                When enabled, companies must hold an active JOB_POST_SLOT before publishing a new job post. Disable
                during free-launch promotions.
              </p>
            </div>
          </div>
          <Switch
            checked={draft.requireJobSlot}
            onChange={(checked) => setDraft((current) => ({ ...current, requireJobSlot: checked }))}
            ariaLabel="Toggle require paid job post slot to publish"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderNumberField('jobFreePostLimit')}
          {renderNumberField('jobFreeMaxDays')}
          {renderNumberField('jobReviewFirstCount')}
        </div>
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col gap-3 rounded-lg border bg-white px-5 py-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="dark:text-forest-300 text-on-surface-variant text-xs">
          {settings.updatedAt ? `Last updated: ${formatDateTime(settings.updatedAt)}` : 'Using seeded default values'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!isDirty || updateMutation.isPending}
            onClick={() => {
              setDraft(toDraft(settings));
              setSubmitted(false);
            }}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            className="dark:border-forest-700 dark:text-forest-100"
          >
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
            isLoading={updateMutation.isPending}
            disabled={!isDirty}
            onClick={() => void handleSave()}
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save free quotas
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFreeQuotasView() {
  const { data, isLoading, isError, refetch } = useAdminFreeQuotas(true);

  return (
    <div className="space-y-5 pb-12">
      <AdminPageHeader description="Runtime free-tier limits applied automatically to every company and candidate." />

      {isLoading ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white px-6 py-12 text-center">
          <p className="dark:text-forest-300 text-on-surface-variant text-sm">Loading free quota settings...</p>
        </div>
      ) : isError || !data ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center gap-3 rounded-lg border bg-white px-6 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
          <p className="text-navy dark:text-forest-50 text-sm font-semibold">Unable to load free quota settings</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <FreeQuotasForm key={data.updatedAt ?? 'default'} settings={data} />
      )}
    </div>
  );
}

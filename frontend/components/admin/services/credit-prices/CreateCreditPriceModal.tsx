'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { BOOST_TIER_OPTIONS } from '@/constants/service-package';
import {
  CONVERTIBLE_CREDIT_TYPE_OPTIONS,
  createEmptyCreditPriceDraft,
  creditPairKey,
  formatRecruiterCreditPreview,
  getAvailableCreditPairs,
  isTimeBoxedEntitlement,
  MAX_CREDIT_COST,
  MAX_CREDIT_DURATION_DAYS,
  validateCreditPriceDraft,
  type CreateCreditPriceDraft,
} from '@/lib/admin-credit-prices';
import type { CreateCreditPriceInput, CreditPrice } from '@/types/credit';
import type { EntitlementType } from '@/types/service-package';
import { AlertTriangle, CheckCircle2, Coins } from 'lucide-react';
import { useState } from 'react';

interface CreateCreditPriceModalProps {
  isOpen: boolean;
  prices: CreditPrice[];
  isCreating: boolean;
  onClose: () => void;
  onCreate: (payload: CreateCreditPriceInput) => Promise<boolean>;
}

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

interface CreateCreditPriceModalBodyProps {
  prices: CreditPrice[];
  isCreating: boolean;
  onClose: () => void;
  onCreate: (payload: CreateCreditPriceInput) => Promise<boolean>;
}

function CreateCreditPriceModalBody({ prices, isCreating, onClose, onCreate }: CreateCreditPriceModalBodyProps) {
  const { configuredKeys, nextAvailable } = getAvailableCreditPairs(prices);
  const allConfigured = nextAvailable === null;

  const [draft, setDraft] = useState<CreateCreditPriceDraft>(() =>
    createEmptyCreditPriceDraft(prices.length + 1, nextAvailable),
  );
  const [submitted, setSubmitted] = useState(false);

  const isBoost = draft.entitlementType === 'JOB_BOOST';
  const timeBoxed = isTimeBoxedEntitlement(draft.entitlementType);
  const effectiveTier = isBoost ? Number(draft.tier) : 1;
  const isDuplicatePair = configuredKeys.has(creditPairKey(draft.entitlementType, effectiveTier));

  const validation = validateCreditPriceDraft(draft.entitlementType, draft);
  const fieldErrors = submitted ? validation.fieldErrors : {};

  const serviceOptions = CONVERTIBLE_CREDIT_TYPE_OPTIONS.map((option) => {
    if (option.value === 'JOB_BOOST') {
      const boostCount = [1, 2, 3].filter((tier) => configuredKeys.has(creditPairKey('JOB_BOOST', tier))).length;
      return {
        value: option.value,
        label:
          boostCount === 3
            ? `${option.label} (All tiers configured)`
            : `${option.label} (${boostCount}/3 tiers configured)`,
      };
    }
    const exists = configuredKeys.has(creditPairKey(option.value, 1));
    return {
      value: option.value,
      label: exists ? `${option.label} (Configured)` : option.label,
    };
  });

  const tierOptions = BOOST_TIER_OPTIONS.map((option) => ({
    value: option.value,
    label: configuredKeys.has(creditPairKey('JOB_BOOST', Number(option.value)))
      ? `${option.label} (Configured)`
      : option.label,
  }));

  const handleSubmit = async () => {
    setSubmitted(true);
    if (allConfigured || isDuplicatePair || !validation.payload) {
      return;
    }
    if (!Number.isInteger(effectiveTier) || effectiveTier < 1 || effectiveTier > 3) {
      return;
    }

    const ok = await onCreate({
      ...validation.payload,
      entitlementType: draft.entitlementType,
      tier: effectiveTier,
    });
    if (ok) {
      onClose();
    }
  };

  const activeCount = prices.filter((item) => item.active).length;

  if (allConfigured) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/45">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-1.5 text-sm">
              <p className="font-bold text-emerald-950 dark:text-emerald-100">
                All {prices.length} eligible credit conversion rules are configured
              </p>
              <p className="leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
                The platform supports one exchange price per eligible service and boost tier (10 single-level services +
                3 Job ranking boost tiers). Right now {activeCount} of {prices.length} rules are active.
              </p>
            </div>
          </div>
        </div>

        <p className="dark:text-forest-300 text-on-surface-variant text-sm leading-relaxed">
          To adjust credit cost, duration in days, recruiter-facing label, display order, or turn any option on/off,
          edit its row directly in the table and click <strong className="dark:text-forest-100">Save</strong>.
        </p>

        <div className="dark:border-forest-800 border-outline-variant flex justify-end border-t pt-4">
          <Button type="button" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:[&_label]:text-forest-100 space-y-4">
      {isDuplicatePair && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-3.5 py-3 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            A credit price already exists for <strong>{draft.entitlementType}</strong> (tier {effectiveTier}). Select an
            unconfigured pair or edit the existing row instead.
          </span>
        </div>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Select
          label="Service *"
          value={draft.entitlementType}
          onChange={(event) => {
            const nextType = event.target.value as EntitlementType;
            setDraft((current) => ({
              ...current,
              entitlementType: nextType,
              tier: nextType === 'JOB_BOOST' ? current.tier : '1',
              durationDays:
                isTimeBoxedEntitlement(nextType) && !current.durationDays.trim() ? '30' : current.durationDays,
            }));
          }}
          options={serviceOptions}
          disabled={isCreating}
          className={CONTROL_DARK_CLASS}
        />

        {isBoost ? (
          <Select
            label="Boost tier *"
            value={draft.tier}
            onChange={(event) => setDraft((current) => ({ ...current, tier: event.target.value }))}
            options={tierOptions}
            disabled={isCreating}
            className={CONTROL_DARK_CLASS}
          />
        ) : (
          <Input label="Tier" value="Single level (no boost tiers)" disabled className={CONTROL_DARK_CLASS} />
        )}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-3">
        <Input
          label="Credits *"
          type="number"
          min={1}
          max={MAX_CREDIT_COST}
          value={draft.creditCost}
          onChange={(event) => setDraft((current) => ({ ...current, creditCost: event.target.value }))}
          error={fieldErrors.creditCost}
          disabled={isCreating}
          className={CONTROL_DARK_CLASS}
        />
        <Input
          label={timeBoxed ? 'Duration (days) *' : 'Duration (days)'}
          type="number"
          min={1}
          max={MAX_CREDIT_DURATION_DAYS}
          placeholder={timeBoxed ? 'e.g. 30' : 'Optional'}
          value={draft.durationDays}
          onChange={(event) => setDraft((current) => ({ ...current, durationDays: event.target.value }))}
          error={fieldErrors.durationDays}
          helperText={!fieldErrors.durationDays ? (timeBoxed ? 'Required (1–3650)' : 'Optional per use') : undefined}
          disabled={isCreating}
          className={CONTROL_DARK_CLASS}
        />
        <Input
          label="Display order"
          type="number"
          min={0}
          value={draft.displayOrder}
          onChange={(event) => setDraft((current) => ({ ...current, displayOrder: event.target.value }))}
          error={fieldErrors.displayOrder}
          disabled={isCreating}
          className={CONTROL_DARK_CLASS}
        />
      </div>

      <Input
        label="Label shown to recruiters *"
        maxLength={255}
        placeholder="e.g. 01 tin tuyển dụng trong 30 ngày"
        value={draft.label}
        onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
        error={fieldErrors.label}
        disabled={isCreating}
        className={CONTROL_DARK_CLASS}
      />

      <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/60 flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs">
        <Coins className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          <p className="dark:text-forest-300 text-on-surface-variant font-medium">
            Preview in recruiter &ldquo;Convert credits&rdquo; dropdown
          </p>
          <p className="text-navy dark:text-forest-50 mt-0.5 truncate font-semibold">
            {formatRecruiterCreditPreview(draft.label, draft.creditCost)}
          </p>
        </div>
      </div>

      <label className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant bg-surface-container-low/50 flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3">
        <div>
          <p className="text-on-surface dark:text-forest-100 text-sm font-semibold">Active for exchange</p>
          <p className="text-on-surface-variant dark:text-forest-400 text-xs">
            Recruiters can exchange credits for this item immediately once active.
          </p>
        </div>
        <Switch
          checked={draft.active}
          onChange={(value) => setDraft((current) => ({ ...current, active: value }))}
          disabled={isCreating}
          ariaLabel="Active for exchange"
        />
      </label>

      <div className="dark:border-forest-800 border-outline-variant mt-2 flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>
        <Button onClick={() => void handleSubmit()} isLoading={isCreating} disabled={isDuplicatePair}>
          Create rule
        </Button>
      </div>
    </div>
  );
}

export default function CreateCreditPriceModal({
  isOpen,
  prices,
  isCreating,
  onClose,
  onCreate,
}: CreateCreditPriceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      radius="2xl"
      title={
        <h3 className="text-on-surface dark:text-forest-50 text-lg font-bold sm:text-xl">New credit exchange rule</h3>
      }
      description={
        <span className="dark:text-forest-300">
          Define how many credits recruiters spend for one unit of an eligible service.
        </span>
      }
      className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-50"
    >
      {isOpen && (
        <CreateCreditPriceModalBody prices={prices} isCreating={isCreating} onClose={onClose} onCreate={onCreate} />
      )}
    </Modal>
  );
}

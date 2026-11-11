'use client';

import { adminCreditPriceApi } from '@/apiRequest/credit';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import { BOOST_TIER_OPTIONS, ENTITLEMENT_TYPE_OPTIONS } from '@/constants/service-package';
import { DURATION_REQUIRED_ENTITLEMENT_TYPES } from '@/schemas/service-package.schema';
import type { CreateCreditPriceInput, CreditPrice, SaveCreditPriceInput } from '@/types/credit';
import type { EntitlementType } from '@/types/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, Check, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AdminCreditPricesViewProps {
  initialPrices: CreditPrice[];
}

type Draft = {
  creditCost: string;
  durationDays: string;
  label: string;
  active: boolean;
  displayOrder: string;
};

type CreateDraft = Draft & {
  entitlementType: EntitlementType;
  tier: string;
};

const CONVERTIBLE_TYPE_OPTIONS = ENTITLEMENT_TYPE_OPTIONS.filter(
  (option) => option.value !== 'CREDIT' && option.value !== 'AD_SLOT_WEEK',
);

const MAX_DURATION_DAYS = 3650;

function createEmptyDraft(displayOrder: number): CreateDraft {
  return {
    entitlementType: 'JOB_POST_SLOT',
    tier: '1',
    creditCost: '10',
    durationDays: '30',
    label: '',
    active: true,
    displayOrder: String(displayOrder),
  };
}

function toDraft(price: CreditPrice): Draft {
  return {
    creditCost: String(price.creditCost),
    durationDays: price.durationDays === null ? '' : String(price.durationDays),
    label: price.label,
    active: price.active,
    displayOrder: String(price.displayOrder),
  };
}

function validateAndBuildPayload(entitlementType: EntitlementType, draft: Draft): SaveCreditPriceInput | string {
  const creditCost = Number(draft.creditCost);
  if (!Number.isInteger(creditCost) || creditCost < 1) {
    return 'Credits must be a positive whole number.';
  }

  const trimmedDuration = draft.durationDays.trim();
  const requiresDuration = DURATION_REQUIRED_ENTITLEMENT_TYPES.has(entitlementType);
  if (requiresDuration && trimmedDuration === '') {
    return `Duration in days is required for ${entitlementType}.`;
  }

  let durationDays: number | null = null;
  if (trimmedDuration !== '') {
    const parsedDuration = Number(trimmedDuration);
    if (!Number.isInteger(parsedDuration) || parsedDuration < 1 || parsedDuration > MAX_DURATION_DAYS) {
      return `Duration in days must be a whole number between 1 and ${MAX_DURATION_DAYS}.`;
    }
    durationDays = parsedDuration;
  }

  const label = draft.label.trim();
  if (!label) {
    return 'Label shown to recruiters is required.';
  }

  const displayOrder = Number(draft.displayOrder);
  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    return 'Display order must be 0 or greater.';
  }

  return {
    creditCost,
    durationDays,
    label,
    active: draft.active,
    displayOrder,
  };
}

export default function AdminCreditPricesView({ initialPrices }: AdminCreditPricesViewProps) {
  const [prices, setPrices] = useState(initialPrices);
  const [drafts, setDrafts] = useState<Record<number, Draft>>(() =>
    Object.fromEntries(initialPrices.map((price) => [price.id, toDraft(price)])),
  );
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPrice, setNewPrice] = useState<CreateDraft>(() => createEmptyDraft(initialPrices.length + 1));

  const patch = (id: number, change: Partial<Draft>) => {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...change } }));
    setSavedId(null);
  };

  const handleCreate = async () => {
    const payloadOrError = validateAndBuildPayload(newPrice.entitlementType, newPrice);
    if (typeof payloadOrError === 'string') {
      setError(payloadOrError);
      return;
    }

    const tier = newPrice.entitlementType === 'JOB_BOOST' ? Number(newPrice.tier) : 1;
    if (!Number.isInteger(tier) || tier < 1 || tier > 3) {
      setError('Boost tier must be between 1 and 3.');
      return;
    }

    const payload: CreateCreditPriceInput = {
      ...payloadOrError,
      entitlementType: newPrice.entitlementType,
      tier,
    };

    setCreating(true);
    setError(null);
    try {
      const created = await adminCreditPriceApi.create(payload);
      setPrices((current) => [...current, created].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id));
      setDrafts((current) => ({ ...current, [created.id]: toDraft(created) }));
      setNewPrice(createEmptyDraft(prices.length + 2));
      setCreateOpen(false);
      setSavedId(created.id);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setCreating(false);
    }
  };

  const save = async (price: CreditPrice) => {
    const payloadOrError = validateAndBuildPayload(price.entitlementType, drafts[price.id]);
    if (typeof payloadOrError === 'string') {
      setError(payloadOrError);
      return;
    }

    setSavingId(price.id);
    setError(null);
    try {
      const saved = await adminCreditPriceApi.update(price.id, payloadOrError);
      setPrices((current) => current.map((item) => (item.id === price.id ? saved : item)));
      setDrafts((current) => ({ ...current, [price.id]: toDraft(saved) }));
      setSavedId(price.id);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setSavingId(null);
    }
  };

  const createRequiresDuration = DURATION_REQUIRED_ENTITLEMENT_TYPES.has(newPrice.entitlementType);
  const createIsBoost = newPrice.entitlementType === 'JOB_BOOST';

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={ROUTES.ADMIN_SERVICE_PACKAGES}
            className="text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1.5 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Service packages
          </Link>
          <h1 className="text-on-surface mt-2 text-xl font-bold">Credit prices</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            What a recruiter pays in credits for one unit of each service. Credits are bought through the FLEX packages;
            this table is the only place that decides what they are worth.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setError(null);
            setCreateOpen((open) => !open);
          }}
        >
          {createOpen ? 'Cancel create' : 'Create credit price'}
        </Button>
      </div>

      {createOpen && (
        <div className="border-primary/40 space-y-4 rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-on-surface text-base font-bold">New credit exchange rule</h2>
              <p className="text-on-surface-variant text-xs">
                Only JOB_BOOST supports tiers 1–3; time-boxed entitlements require a positive duration in days.
              </p>
            </div>
            <Button size="sm" isLoading={creating} onClick={handleCreate}>
              Create rule
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Service *"
              value={newPrice.entitlementType}
              onChange={(event) => {
                const nextType = event.target.value as EntitlementType;
                setNewPrice((current) => ({
                  ...current,
                  entitlementType: nextType,
                  tier: nextType === 'JOB_BOOST' ? current.tier : '1',
                  durationDays:
                    DURATION_REQUIRED_ENTITLEMENT_TYPES.has(nextType) && !current.durationDays.trim()
                      ? '30'
                      : current.durationDays,
                }));
              }}
              options={CONVERTIBLE_TYPE_OPTIONS}
            />
            {createIsBoost ? (
              <Select
                label="Boost tier *"
                value={newPrice.tier}
                onChange={(event) => setNewPrice((current) => ({ ...current, tier: event.target.value }))}
                options={BOOST_TIER_OPTIONS}
              />
            ) : (
              <Input label="Tier" value="1 (default)" disabled />
            )}
            <Input
              label="Credits *"
              type="number"
              min={1}
              value={newPrice.creditCost}
              onChange={(event) => setNewPrice((current) => ({ ...current, creditCost: event.target.value }))}
            />
            <Input
              label={createRequiresDuration ? 'Duration (days) *' : 'Duration (days)'}
              type="number"
              min={1}
              max={MAX_DURATION_DAYS}
              placeholder={createRequiresDuration ? 'Required (e.g. 30)' : 'Optional'}
              value={newPrice.durationDays}
              onChange={(event) => setNewPrice((current) => ({ ...current, durationDays: event.target.value }))}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <Input
                label="Label shown to recruiters *"
                placeholder="e.g. Tin đăng tiêu chuẩn (30 ngày)"
                value={newPrice.label}
                onChange={(event) => setNewPrice((current) => ({ ...current, label: event.target.value }))}
              />
            </div>
            <Input
              label="Display order"
              type="number"
              min={0}
              value={newPrice.displayOrder}
              onChange={(event) => setNewPrice((current) => ({ ...current, displayOrder: event.target.value }))}
            />
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={newPrice.active}
                onChange={(value) => setNewPrice((current) => ({ ...current, active: value }))}
                ariaLabel="Active credit price"
              />
              <span className="text-on-surface text-sm font-medium">Active for exchange</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      <div className="border-outline-variant overflow-x-auto rounded-2xl border bg-white shadow-2xs">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="border-outline-variant text-on-surface-variant border-b text-xs">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Service</th>
              <th className="px-4 py-3 text-left font-semibold">Tier</th>
              <th className="px-4 py-3 text-left font-semibold">Credits</th>
              <th className="px-4 py-3 text-left font-semibold">Days</th>
              <th className="px-4 py-3 text-left font-semibold">Label shown to recruiters</th>
              <th className="px-4 py-3 text-left font-semibold">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => {
              const draft = drafts[price.id];
              const requiresDuration = DURATION_REQUIRED_ENTITLEMENT_TYPES.has(price.entitlementType);
              return (
                <tr key={price.id} className="border-outline-variant border-b last:border-0">
                  <td className="text-on-surface px-4 py-3 font-semibold">{price.entitlementType}</td>
                  <td className="text-on-surface-variant px-4 py-3">{price.tier}</td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min={1}
                      value={draft.creditCost}
                      onChange={(event) => patch(price.id, { creditCost: event.target.value })}
                      className="w-28"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min={1}
                      max={MAX_DURATION_DAYS}
                      value={draft.durationDays}
                      onChange={(event) => patch(price.id, { durationDays: event.target.value })}
                      placeholder={requiresDuration ? 'Required' : '—'}
                      className="w-24"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={draft.label}
                      onChange={(event) => patch(price.id, { label: event.target.value })}
                      className="min-w-[260px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={draft.active}
                      onChange={(value) => patch(price.id, { active: value })}
                      ariaLabel={`Active: ${price.entitlementType}`}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-2">
                      {savedId === price.id && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                          Saved
                        </span>
                      )}
                      <Button size="sm" variant="neutral" isLoading={savingId === price.id} onClick={() => save(price)}>
                        Save
                      </Button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

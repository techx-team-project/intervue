'use client';

import { adminCreditPriceApi } from '@/apiRequest/credit';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import type { CreditPrice, SaveCreditPriceInput } from '@/types/credit';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
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

function toDraft(price: CreditPrice): Draft {
  return {
    creditCost: String(price.creditCost),
    durationDays: price.durationDays === null ? '' : String(price.durationDays),
    label: price.label,
    active: price.active,
    displayOrder: String(price.displayOrder),
  };
}

function toPayload(draft: Draft): SaveCreditPriceInput {
  return {
    creditCost: Number(draft.creditCost),
    durationDays: draft.durationDays.trim() === '' ? null : Number(draft.durationDays),
    label: draft.label.trim(),
    active: draft.active,
    displayOrder: Number(draft.displayOrder),
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

  const patch = (id: number, change: Partial<Draft>) => {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...change } }));
    setSavedId(null);
  };

  const save = async (id: number) => {
    setSavingId(id);
    setError(null);
    try {
      const saved = await adminCreditPriceApi.update(id, toPayload(drafts[id]));
      setPrices((current) => current.map((price) => (price.id === id ? saved : price)));
      setDrafts((current) => ({ ...current, [id]: toDraft(saved) }));
      setSavedId(id);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5 pb-16">
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
                      value={draft.durationDays}
                      onChange={(event) => patch(price.id, { durationDays: event.target.value })}
                      placeholder="—"
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
                      <Button
                        size="sm"
                        variant="neutral"
                        isLoading={savingId === price.id}
                        onClick={() => save(price.id)}
                      >
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

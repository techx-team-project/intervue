'use client';

import { adminAdApi } from '@/apiRequest/ads';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import type { AdSlot, SaveAdSlotInput } from '@/types/ads';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check } from 'lucide-react';
import { useState } from 'react';

type Draft = {
  name: string;
  description: string;
  pricePerWeek: string;
  houseImageUrl: string;
  houseTargetUrl: string;
  active: boolean;
  displayOrder: string;
};

function toDraft(slot: AdSlot): Draft {
  return {
    name: slot.name,
    description: slot.description ?? '',
    pricePerWeek: String(slot.pricePerWeek),
    houseImageUrl: slot.houseImageUrl ?? '',
    houseTargetUrl: slot.houseTargetUrl ?? '',
    active: slot.active,
    displayOrder: String(slot.displayOrder),
  };
}

function toPayload(draft: Draft): SaveAdSlotInput {
  return {
    name: draft.name.trim(),
    description: draft.description.trim() || null,
    pricePerWeek: Number(draft.pricePerWeek),
    houseImageUrl: draft.houseImageUrl.trim() || null,
    houseTargetUrl: draft.houseTargetUrl.trim() || null,
    active: draft.active,
    displayOrder: Number(draft.displayOrder),
  };
}

export default function AdminAdSlotsView({ initialSlots }: { initialSlots: AdSlot[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [drafts, setDrafts] = useState<Record<number, Draft>>(() =>
    Object.fromEntries(initialSlots.map((slot) => [slot.id, toDraft(slot)])),
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
      const saved = await adminAdApi.updateSlot(id, toPayload(drafts[id]));
      setSlots((current) => current.map((slot) => (slot.id === id ? saved : slot)));
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
        <h1 className="text-on-surface text-xl font-bold">Ad slots</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          One buyer per slot per ISO week. The house ad fills any week nobody bought, so a slot is never blank.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      <ul className="space-y-4">
        {slots.map((slot) => {
          const draft = drafts[slot.id];
          return (
            <li key={slot.id} className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-on-surface font-semibold">
                  {slot.code}
                  <span className="text-on-surface-variant ml-2 text-xs font-normal">
                    {slot.placement} · {slot.width}×{slot.height}
                  </span>
                </p>
                <span className="inline-flex items-center gap-2">
                  {savedId === slot.id && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      Saved
                    </span>
                  )}
                  <Button size="sm" variant="neutral" isLoading={savingId === slot.id} onClick={() => save(slot.id)}>
                    Save
                  </Button>
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name"
                  value={draft.name}
                  onChange={(event) => patch(slot.id, { name: event.target.value })}
                />
                <Input
                  label="Price per week (VND)"
                  type="number"
                  min={1}
                  value={draft.pricePerWeek}
                  onChange={(event) => patch(slot.id, { pricePerWeek: event.target.value })}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Description"
                    rows={2}
                    value={draft.description}
                    onChange={(event) => patch(slot.id, { description: event.target.value })}
                  />
                </div>
                <Input
                  label="House ad image URL"
                  value={draft.houseImageUrl}
                  onChange={(event) => patch(slot.id, { houseImageUrl: event.target.value })}
                  helperText="Shown when nobody bought the week"
                />
                <Input
                  label="House ad link"
                  value={draft.houseTargetUrl}
                  onChange={(event) => patch(slot.id, { houseTargetUrl: event.target.value })}
                />
                <Input
                  label="Display order"
                  type="number"
                  min={0}
                  value={draft.displayOrder}
                  onChange={(event) => patch(slot.id, { displayOrder: event.target.value })}
                />
                <label className="flex items-end gap-3 text-sm">
                  <Switch
                    checked={draft.active}
                    onChange={(value) => patch(slot.id, { active: value })}
                    ariaLabel={`Active: ${slot.code}`}
                    size="sm"
                  />
                  <span className="text-on-surface font-medium">On sale</span>
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

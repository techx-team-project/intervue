'use client';

import { adminAdApi } from '@/apiRequest/ads';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import type { AdSlot, CreateAdSlotInput, SaveAdSlotInput } from '@/types/ads';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, Plus } from 'lucide-react';
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

type CreateDraft = {
  code: string;
  name: string;
  placement: 'HOME' | 'JOBS';
  description: string;
  width: string;
  height: string;
  pricePerWeek: string;
  servicePackageId: string;
  houseImageUrl: string;
  houseTargetUrl: string;
  active: boolean;
  displayOrder: string;
};

const EMPTY_CREATE_DRAFT: CreateDraft = {
  code: '',
  name: '',
  placement: 'HOME',
  description: '',
  width: '1200',
  height: '250',
  pricePerWeek: '2500000',
  servicePackageId: '',
  houseImageUrl: '',
  houseTargetUrl: '',
  active: true,
  displayOrder: '0',
};

export default function AdminAdSlotsView({ initialSlots }: { initialSlots: AdSlot[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [drafts, setDrafts] = useState<Record<number, Draft>>(() =>
    Object.fromEntries(initialSlots.map((slot) => [slot.id, toDraft(slot)])),
  );
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<CreateDraft>(EMPTY_CREATE_DRAFT);

  const patch = (id: number, change: Partial<Draft>) => {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...change } }));
    setSavedId(null);
  };

  const handleCreate = async () => {
    const code = newSlot.code.trim().toUpperCase();
    const width = Number(newSlot.width);
    const height = Number(newSlot.height);
    const pricePerWeek = Number(newSlot.pricePerWeek);
    const displayOrder = Number(newSlot.displayOrder);
    if (!/^[A-Z0-9_]+$/.test(code)) {
      setError('Slot code must contain only uppercase letters, digits, or underscores.');
      return;
    }
    if (!newSlot.name.trim()) {
      setError('Slot name is required.');
      return;
    }
    if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
      setError('Width and height must be positive integers.');
      return;
    }
    if (!Number.isInteger(pricePerWeek) || pricePerWeek <= 0) {
      setError('Price per week must be a positive whole number.');
      return;
    }

    const payload: CreateAdSlotInput = {
      code,
      name: newSlot.name.trim(),
      placement: newSlot.placement,
      description: newSlot.description.trim() || null,
      width,
      height,
      pricePerWeek,
      servicePackageId: newSlot.servicePackageId.trim() ? Number(newSlot.servicePackageId) : null,
      houseImageUrl: newSlot.houseImageUrl.trim() || null,
      houseTargetUrl: newSlot.houseTargetUrl.trim() || null,
      active: newSlot.active,
      displayOrder: Number.isInteger(displayOrder) && displayOrder >= 0 ? displayOrder : 0,
    };

    setCreating(true);
    setError(null);
    try {
      const created = await adminAdApi.createSlot(payload);
      setSlots((current) => [...current, created].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id));
      setDrafts((current) => ({ ...current, [created.id]: toDraft(created) }));
      setNewSlot({ ...EMPTY_CREATE_DRAFT, displayOrder: String(slots.length + 1) });
      setCreateOpen(false);
      setSavedId(created.id);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setCreating(false);
    }
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-on-surface text-xl font-bold">Ad slots</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            One buyer per slot per ISO week. The house ad fills any week nobody bought, so a slot is never blank.
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
          {createOpen ? 'Cancel create' : 'Create ad slot'}
        </Button>
      </div>

      {createOpen && (
        <div className="border-primary/40 space-y-4 rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-on-surface text-base font-bold">New banner ad slot</h2>
              <p className="text-on-surface-variant text-xs">
                Leave Linked Package ID blank to auto-create a matching BANNER_&lt;CODE&gt; service package.
              </p>
            </div>
            <Button size="sm" isLoading={creating} onClick={handleCreate}>
              Create slot
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Code"
              placeholder="e.g. JOBS_SIDEBAR"
              value={newSlot.code}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
            />
            <Input
              label="Name"
              placeholder="e.g. Sidebar Banner - Jobs"
              value={newSlot.name}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Select
              label="Placement"
              value={newSlot.placement}
              onChange={(event) =>
                setNewSlot((prev) => ({ ...prev, placement: event.target.value as 'HOME' | 'JOBS' }))
              }
              options={[
                { value: 'HOME', label: 'HOME — Homepage' },
                { value: 'JOBS', label: 'JOBS — Jobs directory' },
              ]}
            />
            <Input
              label="Width (px)"
              type="number"
              min={1}
              value={newSlot.width}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, width: event.target.value }))}
            />
            <Input
              label="Height (px)"
              type="number"
              min={1}
              value={newSlot.height}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, height: event.target.value }))}
            />
            <Input
              label="Price per week (VND)"
              type="number"
              min={1}
              value={newSlot.pricePerWeek}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, pricePerWeek: event.target.value }))}
            />
            <Input
              label="Linked service package ID (optional)"
              type="number"
              min={1}
              placeholder="Auto-create if empty"
              value={newSlot.servicePackageId}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, servicePackageId: event.target.value }))}
            />
            <Input
              label="Display order"
              type="number"
              min={0}
              value={newSlot.displayOrder}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, displayOrder: event.target.value }))}
            />
            <label className="flex items-end gap-3 pb-2 text-sm">
              <Switch
                checked={newSlot.active}
                onChange={(value) => setNewSlot((prev) => ({ ...prev, active: value }))}
                ariaLabel="Active new ad slot"
                size="sm"
              />
              <span className="text-on-surface font-medium">On sale</span>
            </label>
            <div className="sm:col-span-2 lg:col-span-3">
              <Textarea
                label="Description"
                rows={2}
                value={newSlot.description}
                onChange={(event) => setNewSlot((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <Input
              label="House ad image URL (optional)"
              value={newSlot.houseImageUrl}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, houseImageUrl: event.target.value }))}
            />
            <Input
              label="House ad link (optional)"
              value={newSlot.houseTargetUrl}
              onChange={(event) => setNewSlot((prev) => ({ ...prev, houseTargetUrl: event.target.value }))}
            />
          </div>
        </div>
      )}

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

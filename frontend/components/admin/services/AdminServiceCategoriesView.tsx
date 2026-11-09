'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import type { AdminServiceCategory, SaveServiceCategoryInput } from '@/types/admin-service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AdminServiceCategoriesViewProps {
  initialCategories: AdminServiceCategory[];
}

type CategoryDraft = {
  id: number | null;
  code: string;
  name: string;
  headline: string;
  description: string;
  needKey: string;
  displayOrder: string;
  isActive: boolean;
};

const EMPTY_DRAFT: CategoryDraft = {
  id: null,
  code: '',
  name: '',
  headline: '',
  description: '',
  needKey: '',
  displayOrder: '1',
  isActive: true,
};

function toDraft(category: AdminServiceCategory): CategoryDraft {
  return {
    id: category.id,
    code: category.code,
    name: category.name,
    headline: category.headline,
    description: category.description ?? '',
    needKey: category.needKey ?? '',
    displayOrder: String(category.displayOrder),
    isActive: category.isActive,
  };
}

function toPayload(draft: CategoryDraft): SaveServiceCategoryInput {
  return {
    code: draft.code.trim().toUpperCase(),
    name: draft.name.trim(),
    headline: draft.headline.trim(),
    description: draft.description.trim() || null,
    needKey: draft.needKey.trim().toUpperCase() || null,
    displayOrder: Number(draft.displayOrder),
    isActive: draft.isActive,
  };
}

export default function AdminServiceCategoriesView({ initialCategories }: AdminServiceCategoriesViewProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [draft, setDraft] = useState<CategoryDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = async () => setCategories(await adminServicePackageApi.listCategories());

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setError(null);
    setIsSaving(true);
    try {
      if (draft.id === null) {
        await adminServicePackageApi.createCategory(toPayload(draft));
      } else {
        await adminServicePackageApi.updateCategory(draft.id, toPayload(draft));
      }
      await refresh();
      setDraft(null);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: AdminServiceCategory) => {
    setError(null);
    try {
      await adminServicePackageApi.deleteCategory(category.id);
      await refresh();
    } catch (cause) {
      setError(getErrorMessage(cause));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ADMIN_SERVICE_PACKAGES}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-navy text-xl font-bold">Service categories</h1>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              Sections of the buy-services page, in display order.
            </p>
          </div>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDraft({ ...EMPTY_DRAFT })}>
          New category
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {error}
        </div>
      )}

      {draft && (
        <form
          onSubmit={handleSave}
          className="border-outline-variant grid gap-4 rounded-2xl border bg-white p-5 shadow-2xs sm:grid-cols-2"
        >
          <Input
            label="Code"
            value={draft.code}
            onChange={(event) => setDraft({ ...draft, code: event.target.value })}
            required
          />
          <Input
            label="Name"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            helperText="Short green label, e.g. TOP JOBS"
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Headline"
              value={draft.headline}
              onChange={(event) => setDraft({ ...draft, headline: event.target.value })}
              helperText="Text after the divider, e.g. ĐĂNG TIN TUYỂN DỤNG HIỆU SUẤT CAO"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              rows={2}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
          </div>
          <Input
            label="Need key"
            value={draft.needKey}
            onChange={(event) => setDraft({ ...draft, needKey: event.target.value })}
            helperText="REACH, CONNECT, HIGHLIGHT or BRANDING — used by the suggestion modal"
          />
          <Input
            label="Display order"
            type="number"
            min={0}
            value={draft.displayOrder}
            onChange={(event) => setDraft({ ...draft, displayOrder: event.target.value })}
            required
          />
          <label className="flex items-center gap-3 text-sm">
            <Switch
              checked={draft.isActive}
              onChange={(checked) => setDraft({ ...draft, isActive: checked })}
              ariaLabel="Active"
              size="sm"
            />
            <span className="text-on-surface font-medium">Visible to recruiters</span>
          </label>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="neutral" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {draft.id === null ? 'Create category' : 'Save changes'}
            </Button>
          </div>
        </form>
      )}

      <div className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
                <th className="py-3.5 pr-4 pl-6">Code</th>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Headline</th>
                <th className="px-4 py-3.5">Need key</th>
                <th className="px-4 py-3.5 text-center">Order</th>
                <th className="px-4 py-3.5 text-center">Packages</th>
                <th className="px-4 py-3.5 text-center">Active</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="text-on-surface py-3.5 pr-4 pl-6 font-mono font-bold">{category.code}</td>
                  <td className="text-on-surface px-4 py-3.5">{category.name}</td>
                  <td className="text-on-surface-variant px-4 py-3.5">{category.headline}</td>
                  <td className="text-on-surface-variant px-4 py-3.5">{category.needKey ?? '—'}</td>
                  <td className="text-on-surface-variant px-4 py-3.5 text-center">{category.displayOrder}</td>
                  <td className="text-on-surface-variant px-4 py-3.5 text-center">{category.packageCount}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        category.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {category.isActive ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setDraft(toDraft(category))}
                        className="text-primary cursor-pointer font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(category)}
                        disabled={category.packageCount > 0}
                        className="text-outline cursor-pointer rounded-lg p-1.5 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Delete ${category.code}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { adminVoucherApi } from '@/apiRequest/voucher';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import type { AdminVoucher, SaveVoucherInput, VoucherDiscountType, VoucherStatus } from '@/types/voucher';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AdminVouchersViewProps {
  initialVouchers: AdminVoucher[];
}

type Draft = {
  id: number | null;
  code: string;
  label: string;
  description: string;
  discountType: VoucherDiscountType;
  discountValue: string;
  maxDiscount: string;
  minOrderValue: string;
  startsAt: string;
  endsAt: string;
  usageLimit: string;
  perCompanyLimit: string;
  status: VoucherStatus;
};

const EMPTY_DRAFT: Draft = {
  id: null,
  code: '',
  label: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: '10',
  maxDiscount: '',
  minOrderValue: '0',
  startsAt: '',
  endsAt: '',
  usageLimit: '',
  perCompanyLimit: '1',
  status: 'ACTIVE',
};

function toDraft(voucher: AdminVoucher): Draft {
  return {
    id: voucher.id,
    code: voucher.code,
    label: voucher.label,
    description: voucher.description ?? '',
    discountType: voucher.discountType,
    discountValue: String(voucher.discountValue),
    maxDiscount: voucher.maxDiscount === null ? '' : String(voucher.maxDiscount),
    minOrderValue: String(voucher.minOrderValue),
    startsAt: voucher.startsAt ? voucher.startsAt.slice(0, 10) : '',
    endsAt: voucher.endsAt ? voucher.endsAt.slice(0, 10) : '',
    usageLimit: voucher.usageLimit === null ? '' : String(voucher.usageLimit),
    perCompanyLimit: voucher.perCompanyLimit === null ? '' : String(voucher.perCompanyLimit),
    status: voucher.status,
  };
}

function optionalNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value);
}

// A date-only input means the whole day in Vietnam, so the end bound closes at midnight local
function toInstant(value: string, endOfDay: boolean): string | null {
  if (!value) return null;
  return new Date(`${value}T${endOfDay ? '23:59:59' : '00:00:00'}+07:00`).toISOString();
}

function toPayload(draft: Draft): SaveVoucherInput {
  return {
    code: draft.code.trim().toUpperCase(),
    label: draft.label.trim(),
    description: draft.description.trim() || null,
    discountType: draft.discountType,
    discountValue: Number(draft.discountValue),
    maxDiscount: optionalNumber(draft.maxDiscount),
    minOrderValue: Number(draft.minOrderValue),
    startsAt: toInstant(draft.startsAt, false),
    endsAt: toInstant(draft.endsAt, true),
    usageLimit: optionalNumber(draft.usageLimit),
    perCompanyLimit: optionalNumber(draft.perCompanyLimit),
    status: draft.status,
  };
}

export default function AdminVouchersView({ initialVouchers }: AdminVouchersViewProps) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (change: Partial<Draft>) => setDraft((current) => (current ? { ...current, ...change } : current));

  const save = async () => {
    if (!draft) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = toPayload(draft);
      const saved = draft.id ? await adminVoucherApi.update(draft.id, payload) : await adminVoucherApi.create(payload);
      setVouchers((current) =>
        draft.id ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current],
      );
      setDraft(null);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href={ROUTES.ADMIN_SERVICE_PACKAGES}
            className="text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1.5 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Service packages
          </Link>
          <h1 className="text-on-surface mt-2 text-xl font-bold">Vouchers</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Discount codes recruiters type at checkout. VAT is charged on the amount after the discount.
          </p>
        </div>
        {!draft && (
          <Button size="sm" onClick={() => setDraft(EMPTY_DRAFT)}>
            <Plus className="h-4 w-4" aria-hidden />
            New voucher
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      {draft && (
        <section className="border-outline-variant grid gap-4 rounded-2xl border bg-white p-5 shadow-2xs sm:grid-cols-2">
          <Input
            label="Code"
            value={draft.code}
            onChange={(event) => patch({ code: event.target.value.toUpperCase() })}
            disabled={draft.id !== null}
            helperText={draft.id ? 'A code already handed out is never rewritten' : 'A-Z, 0-9, dash and underscore'}
          />
          <Input label="Label" value={draft.label} onChange={(event) => patch({ label: event.target.value })} />
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              value={draft.description}
              onChange={(event) => patch({ description: event.target.value })}
              rows={2}
            />
          </div>
          <Select
            label="Discount type"
            value={draft.discountType}
            onChange={(event) => patch({ discountType: event.target.value as VoucherDiscountType })}
            options={[
              { value: 'PERCENTAGE', label: 'Percentage (%)' },
              { value: 'FIXED', label: 'Fixed amount (VND)' },
            ]}
          />
          <Input
            label={draft.discountType === 'PERCENTAGE' ? 'Percent off' : 'Amount off (VND)'}
            type="number"
            min={1}
            value={draft.discountValue}
            onChange={(event) => patch({ discountValue: event.target.value })}
          />
          <Input
            label="Max discount (VND)"
            type="number"
            min={1}
            value={draft.maxDiscount}
            onChange={(event) => patch({ maxDiscount: event.target.value })}
            placeholder="No cap"
          />
          <Input
            label="Minimum order (VND)"
            type="number"
            min={0}
            value={draft.minOrderValue}
            onChange={(event) => patch({ minOrderValue: event.target.value })}
          />
          <Input
            label="Starts on"
            type="date"
            value={draft.startsAt}
            onChange={(event) => patch({ startsAt: event.target.value })}
          />
          <Input
            label="Ends on"
            type="date"
            value={draft.endsAt}
            onChange={(event) => patch({ endsAt: event.target.value })}
          />
          <Input
            label="Total redemptions"
            type="number"
            min={1}
            value={draft.usageLimit}
            onChange={(event) => patch({ usageLimit: event.target.value })}
            placeholder="Unlimited"
          />
          <Input
            label="Per company"
            type="number"
            min={1}
            value={draft.perCompanyLimit}
            onChange={(event) => patch({ perCompanyLimit: event.target.value })}
            placeholder="Unlimited"
          />
          <Select
            label="Status"
            value={draft.status}
            onChange={(event) => patch({ status: event.target.value as VoucherStatus })}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />
          <div className="flex items-end justify-end gap-3 sm:col-span-2">
            <Button variant="neutral" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={save} isLoading={isSaving}>
              {draft.id ? 'Save changes' : 'Create voucher'}
            </Button>
          </div>
        </section>
      )}

      <div className="border-outline-variant overflow-x-auto rounded-2xl border bg-white shadow-2xs">
        <table className="w-full min-w-[880px] text-sm">
          <thead className="border-outline-variant text-on-surface-variant border-b text-xs">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Code</th>
              <th className="px-4 py-3 text-left font-semibold">Discount</th>
              <th className="px-4 py-3 text-left font-semibold">Min order</th>
              <th className="px-4 py-3 text-left font-semibold">Window</th>
              <th className="px-4 py-3 text-left font-semibold">Used</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-on-surface-variant px-4 py-10 text-center text-xs">
                  No voucher has been created yet.
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-outline-variant border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-on-surface font-semibold">{voucher.code}</p>
                    <p className="text-on-surface-variant text-xs">{voucher.label}</p>
                  </td>
                  <td className="text-on-surface px-4 py-3">
                    {voucher.discountType === 'PERCENTAGE'
                      ? `${voucher.discountValue}%${voucher.maxDiscount ? ` (cap ${voucher.maxDiscount.toLocaleString('vi-VN')}đ)` : ''}`
                      : `${voucher.discountValue.toLocaleString('vi-VN')}đ`}
                  </td>
                  <td className="text-on-surface-variant px-4 py-3">
                    {voucher.minOrderValue.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="text-on-surface-variant px-4 py-3 text-xs">
                    {voucher.startsAt || voucher.endsAt
                      ? `${voucher.startsAt ? formatDate(voucher.startsAt) : '—'} → ${voucher.endsAt ? formatDate(voucher.endsAt) : '—'}`
                      : 'Always on'}
                  </td>
                  <td className="text-on-surface-variant px-4 py-3">
                    {voucher.usedCount}
                    {voucher.usageLimit === null ? '' : ` / ${voucher.usageLimit}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        voucher.status === 'ACTIVE'
                          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700'
                          : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600'
                      }
                    >
                      {voucher.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="neutral" onClick={() => setDraft(toDraft(voucher))}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { adminVoucherApi } from '@/apiRequest/voucher';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CouponWalletCard from '@/components/recruiter/services/CouponWalletCard';
import { Button, buttonClassName } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { recruiterVoucherKeys } from '@/hooks/useRecruiterVouchers';
import {
  adminVoucherKeys,
  formatVnd,
  resolveVoucherDisplayConditions,
  VOUCHER_ACCENT_OPTIONS,
} from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import {
  saveVoucherSchema,
  toSaveVoucherPayload,
  toVoucherFormDefaults,
  VOUCHER_FIELD_LIMITS,
  type SaveVoucherFormData,
} from '@/schemas/voucher.schema';
import type { AdminServicePackage } from '@/types/admin-service-package';
import type { AdminVoucher, VoucherAccentColor, VoucherPackageSummary } from '@/types/voucher';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Lock,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AdminVoucherFormProps {
  servicePackages: AdminServicePackage[];
  editingVoucher?: AdminVoucher;
}

const INPUT_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminVoucherForm({ servicePackages, editingVoucher }: AdminVoucherFormProps) {
  const formId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditing = Boolean(editingVoucher);
  const [scopeMode, setScopeMode] = useState<'ALL' | 'SPECIFIC'>(
    editingVoucher && editingVoucher.applicablePackages.length > 0 ? 'SPECIFIC' : 'ALL',
  );
  const [packageQuery, setPackageQuery] = useState('');
  const [previewNowMs] = useState(() => Date.now());

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SaveVoucherFormData>({
    resolver: zodResolver(saveVoucherSchema),
    defaultValues: toVoucherFormDefaults(editingVoucher),
  });

  const {
    fields: conditionFields,
    append,
    remove,
    swap,
    replace,
  } = useFieldArray({
    control,
    name: 'conditions',
  });

  const [
    codeValue,
    labelValue,
    descriptionValue,
    ribbonLabelValue,
    accentColorValue,
    conditionsValue,
    applicablePackageIdsValue,
    discountTypeValue,
    maxDiscountValue,
    minOrderValue,
    endsAtValue,
    perCompanyLimitValue,
    statusValue,
  ] = useWatch({
    control,
    name: [
      'code',
      'label',
      'description',
      'ribbonLabel',
      'accentColor',
      'conditions',
      'applicablePackageIds',
      'discountType',
      'maxDiscount',
      'minOrderValue',
      'endsAt',
      'perCompanyLimit',
      'status',
    ],
  });

  const packagesById = useMemo(() => new Map(servicePackages.map((pkg) => [pkg.id, pkg])), [servicePackages]);

  const filteredPackages = useMemo(() => {
    const normalized = packageQuery.trim().toLowerCase();
    if (!normalized) return servicePackages;
    return servicePackages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(normalized) ||
        pkg.code.toLowerCase().includes(normalized) ||
        pkg.categoryCode.toLowerCase().includes(normalized),
    );
  }, [packageQuery, servicePackages]);

  const selectedPackages: VoucherPackageSummary[] = useMemo(() => {
    return (applicablePackageIdsValue ?? [])
      .map((id) => packagesById.get(id))
      .filter((pkg): pkg is AdminServicePackage => Boolean(pkg))
      .map((pkg) => ({ id: pkg.id, code: pkg.code, slug: pkg.slug, name: pkg.name }));
  }, [applicablePackageIdsValue, packagesById]);

  const previewEndsAtIso = useMemo(() => {
    if (!endsAtValue) return null;
    return new Date(`${endsAtValue}T23:59:59+07:00`).toISOString();
  }, [endsAtValue]);

  const liveConditionsList = useMemo(() => {
    const manual = (conditionsValue ?? []).map((item) => item?.text ?? '');
    return resolveVoucherDisplayConditions({
      conditions: manual,
      description: descriptionValue,
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: discountTypeValue === 'PERCENTAGE' && maxDiscountValue ? Number(maxDiscountValue) : null,
      perCompanyLimit: perCompanyLimitValue ? Number(perCompanyLimitValue) : null,
      applicablePackages: scopeMode === 'SPECIFIC' ? selectedPackages : [],
    });
  }, [
    conditionsValue,
    descriptionValue,
    discountTypeValue,
    maxDiscountValue,
    minOrderValue,
    perCompanyLimitValue,
    scopeMode,
    selectedPackages,
  ]);

  const handleScopeChange = (nextMode: 'ALL' | 'SPECIFIC') => {
    setScopeMode(nextMode);
    clearErrors('applicablePackageIds');
    if (nextMode === 'ALL') {
      setValue('applicablePackageIds', [], { shouldDirty: true, shouldValidate: true });
    }
  };

  const togglePackage = (packageId: number) => {
    const current = applicablePackageIdsValue ?? [];
    const next = current.includes(packageId) ? current.filter((id) => id !== packageId) : [...current, packageId];
    setValue('applicablePackageIds', next, { shouldDirty: true, shouldValidate: true });
    if (next.length > 0) {
      clearErrors('applicablePackageIds');
    }
  };

  const handleGenerateSuggestedConditions = () => {
    const suggestions: string[] = [];
    if (scopeMode === 'SPECIFIC' && selectedPackages.length > 0) {
      const names = selectedPackages.map((pkg) => pkg.name).join(', ');
      suggestions.push(`Áp dụng trên giá niêm yết của gói ${names} (chưa bao gồm VAT)`);
    } else {
      suggestions.push('Áp dụng trên giá niêm yết của tất cả gói dịch vụ (chưa bao gồm VAT)');
    }
    const minVal = Number(minOrderValue) || 0;
    const capVal = discountTypeValue === 'PERCENTAGE' && maxDiscountValue ? Number(maxDiscountValue) : null;
    if (minVal > 0 && capVal) {
      suggestions.push(`Đơn hàng tối thiểu ${formatVnd(minVal)}, mức giảm tối đa ${formatVnd(capVal)}`);
    } else if (minVal > 0) {
      suggestions.push(`Áp dụng cho đơn hàng dịch vụ có giá trị từ ${formatVnd(minVal)} trở lên`);
    } else if (capVal) {
      suggestions.push(`Không yêu cầu giá trị đơn hàng tối thiểu, giảm tối đa ${formatVnd(capVal)}`);
    }
    if (perCompanyLimitValue && Number(perCompanyLimitValue) > 0) {
      suggestions.push(`Mỗi doanh nghiệp được sử dụng tối đa ${Number(perCompanyLimitValue)} lần`);
    }
    suggestions.push('Mã ưu đãi chỉ được áp dụng 1 lần cho 1 đơn hàng');
    replace(suggestions.slice(0, VOUCHER_FIELD_LIMITS.maxConditions).map((text) => ({ text })));
  };

  const submitForm = handleSubmit(async (values) => {
    if (scopeMode === 'SPECIFIC' && values.applicablePackageIds.length === 0) {
      setError('applicablePackageIds', {
        type: 'manual',
        message: 'Select at least one package or switch scope back to All service packages.',
      });
      return;
    }
    const payload = toSaveVoucherPayload({
      ...values,
      applicablePackageIds: scopeMode === 'SPECIFIC' ? values.applicablePackageIds : [],
    });
    try {
      if (editingVoucher) {
        await adminVoucherApi.update(editingVoucher.id, payload);
        toast.success(`Voucher "${payload.code}" updated.`);
      } else {
        await adminVoucherApi.create(payload);
        toast.success(`Voucher "${payload.code}" created.`);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminVoucherKeys.all }),
        queryClient.invalidateQueries({ queryKey: recruiterVoucherKeys.all }),
      ]);
      router.push(ROUTES.ADMIN_SERVICE_VOUCHERS);
    } catch (cause) {
      applyFormError(cause, setError, [
        'code',
        'label',
        'description',
        'ribbonLabel',
        'discountType',
        'discountValue',
        'maxDiscount',
        'minOrderValue',
        'startsAt',
        'endsAt',
        'usageLimit',
        'perCompanyLimit',
        'applicablePackageIds',
      ]);
    }
  });

  return (
    <div className="space-y-5 pb-16">
      <AdminPageHeader
        className="mb-0"
        description={
          editingVoucher
            ? `Update discount rules, applicability scope, and conditions for ${editingVoucher.code}.`
            : 'Configure a promotional voucher with eligibility conditions and package applicability.'
        }
        actions={
          <Link
            href={ROUTES.ADMIN_SERVICE_VOUCHERS}
            className={buttonClassName({
              variant: 'outline',
              size: 'md',
              className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
            })}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to vouchers</span>
          </Link>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form id={formId} onSubmit={submitForm} noValidate className="space-y-5">
          {errors.root?.message && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errors.root.message}</span>
            </div>
          )}

          {/* Section 1: Identity & Visual Presentation */}
          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-2xl border bg-white p-5 shadow-xs sm:p-6">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">1. Identity &amp; Coupon Display</h2>
              <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-xs">
                Voucher code, headline, vertical ribbon label, and card accent color shown in Recruiter Vouchers.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={`Voucher code * (${(codeValue ?? '').length}/${VOUCHER_FIELD_LIMITS.code})`}
                value={codeValue ?? ''}
                disabled={isEditing}
                onChange={(event) =>
                  setValue('code', event.target.value.toUpperCase(), { shouldDirty: true, shouldValidate: true })
                }
                placeholder="e.g. INTERVUE25"
                rightElement={isEditing ? <Lock className="text-outline h-4 w-4" /> : undefined}
                helperText={
                  isEditing
                    ? 'A voucher code already handed out is never rewritten.'
                    : 'Uppercase A–Z, 0–9, hyphen or underscore.'
                }
                error={errors.code?.message}
                className={`${INPUT_DARK_CLASS} font-mono uppercase disabled:cursor-not-allowed disabled:opacity-65`}
              />

              <Input
                label={`Left ribbon label (${(ribbonLabelValue ?? '').length}/${VOUCHER_FIELD_LIMITS.ribbonLabel})`}
                value={ribbonLabelValue ?? ''}
                onChange={(event) =>
                  setValue('ribbonLabel', event.target.value.toUpperCase(), { shouldDirty: true, shouldValidate: true })
                }
                placeholder="e.g. ALL PACKAGES or TOP JOBS"
                helperText="Vertical tag on the coupon left strip. Leave blank for auto label."
                error={errors.ribbonLabel?.message}
                className={`${INPUT_DARK_CLASS} uppercase`}
              />

              <div className="sm:col-span-2">
                <Input
                  label={`Recruiter headline label * (${(labelValue ?? '').length}/${VOUCHER_FIELD_LIMITS.label})`}
                  placeholder="e.g. Giảm 25% tổng giá trị đơn hàng"
                  error={errors.label?.message}
                  className={INPUT_DARK_CLASS}
                  {...register('label')}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-navy dark:text-forest-100 mb-2 block text-xs font-semibold">
                  Coupon accent theme
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {VOUCHER_ACCENT_OPTIONS.map((theme) => {
                    const selected = accentColorValue === theme.key;
                    return (
                      <button
                        key={theme.key}
                        type="button"
                        onClick={() =>
                          setValue('accentColor', theme.key as VoucherAccentColor, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition',
                          selected
                            ? 'border-primary bg-primary/8 text-navy dark:text-forest-50 ring-primary/20 ring-2'
                            : 'dark:border-forest-700 dark:text-forest-200 border-outline-variant text-on-surface-variant hover:bg-surface-container-low',
                        )}
                      >
                        <span
                          aria-hidden
                          className="h-3.5 w-3.5 shrink-0 rounded-full"
                          style={{ backgroundColor: theme.swatchHex }}
                        />
                        <span className="truncate">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label={`Summary note (${(descriptionValue ?? '').length}/${VOUCHER_FIELD_LIMITS.description})`}
                  placeholder="Optional concise summary for checkout or internal notes..."
                  rows={2}
                  error={errors.description?.message}
                  className={INPUT_DARK_CLASS}
                  {...register('description')}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Discount Rules & Validity */}
          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-2xl border bg-white p-5 shadow-xs sm:p-6">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">2. Discount Mechanics &amp; Limits</h2>
              <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-xs">
                VAT is calculated on the discounted subtotal. Leave dates or redemption caps empty when unlimited.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="discountType"
                render={({ field }) => (
                  <Select
                    label="Discount type *"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    options={[
                      { value: 'PERCENTAGE', label: 'Percentage (%)' },
                      { value: 'FIXED', label: 'Fixed amount (VND)' },
                    ]}
                    className={INPUT_DARK_CLASS}
                  />
                )}
              />

              <Input
                label={discountTypeValue === 'PERCENTAGE' ? 'Percent off (%) *' : 'Amount off (VND) *'}
                type="number"
                min={1}
                max={discountTypeValue === 'PERCENTAGE' ? 100 : undefined}
                error={errors.discountValue?.message}
                className={INPUT_DARK_CLASS}
                {...register('discountValue')}
              />

              <Input
                label="Max discount cap (VND)"
                type="number"
                min={1}
                disabled={discountTypeValue === 'FIXED'}
                placeholder={discountTypeValue === 'FIXED' ? 'Not used for fixed amount' : 'No maximum cap'}
                error={errors.maxDiscount?.message}
                className={`${INPUT_DARK_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
                {...register('maxDiscount')}
              />

              <Input
                label="Minimum eligible order (VND) *"
                type="number"
                min={0}
                error={errors.minOrderValue?.message}
                className={INPUT_DARK_CLASS}
                {...register('minOrderValue')}
              />

              <Input
                label="Starts on (Vietnam time)"
                type="date"
                error={errors.startsAt?.message}
                className={INPUT_DARK_CLASS}
                {...register('startsAt')}
              />

              <Input
                label="Ends on (Vietnam time)"
                type="date"
                error={errors.endsAt?.message}
                className={INPUT_DARK_CLASS}
                {...register('endsAt')}
              />

              <Input
                label="Total redemptions limit"
                type="number"
                min={editingVoucher ? Math.max(1, editingVoucher.usedCount) : 1}
                placeholder="Unlimited"
                helperText={
                  editingVoucher
                    ? `Currently redeemed ${editingVoucher.usedCount} time(s).`
                    : 'Total claims across all companies.'
                }
                error={errors.usageLimit?.message}
                className={INPUT_DARK_CLASS}
                {...register('usageLimit')}
              />

              <Input
                label="Redemptions per company"
                type="number"
                min={1}
                placeholder="Unlimited"
                helperText="How many times one company can apply this voucher."
                error={errors.perCompanyLimit?.message}
                className={INPUT_DARK_CLASS}
                {...register('perCompanyLimit')}
              />

              <div className="sm:col-span-2">
                <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/60 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
                  <div>
                    <p className="text-navy dark:text-forest-50 text-xs font-bold">Voucher active status</p>
                    <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-[11px]">
                      {statusValue === 'ACTIVE'
                        ? 'Recruiters can view and redeem this voucher during its validity window.'
                        : 'Paused vouchers remain saved here and are hidden from recruiters.'}
                    </p>
                  </div>
                  <Switch
                    checked={statusValue === 'ACTIVE'}
                    onChange={(nextChecked) =>
                      setValue('status', nextChecked ? 'ACTIVE' : 'INACTIVE', { shouldDirty: true })
                    }
                    aria-label="Voucher active status"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Applicable Packages & Conditions */}
          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-5 rounded-2xl border bg-white p-5 shadow-xs sm:p-6">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">
                3. Applicable Packages &amp; Usage Conditions
              </h2>
              <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-xs">
                Restrict which service packages accept this voucher and customize the condition bullets displayed to
                recruiters.
              </p>
            </div>

            {/* Package Scope */}
            <div className="space-y-3">
              <label className="text-navy dark:text-forest-100 block text-xs font-semibold">
                Applicable service packages
              </label>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleScopeChange('ALL')}
                  className={cn(
                    'flex cursor-pointer flex-col items-start rounded-xl border p-3.5 text-left transition',
                    scopeMode === 'ALL'
                      ? 'border-primary bg-primary/8 ring-primary/20 ring-2'
                      : 'dark:border-forest-700 dark:hover:bg-forest-850 border-outline-variant hover:bg-surface-container-low',
                  )}
                >
                  <span className="text-navy dark:text-forest-50 text-xs font-bold">All service packages</span>
                  <span className="text-on-surface-variant dark:text-forest-300 mt-1 text-[11px]">
                    Applies across every active service package in the catalog.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScopeChange('SPECIFIC')}
                  className={cn(
                    'flex cursor-pointer flex-col items-start rounded-xl border p-3.5 text-left transition',
                    scopeMode === 'SPECIFIC'
                      ? 'border-primary bg-primary/8 ring-primary/20 ring-2'
                      : 'dark:border-forest-700 dark:hover:bg-forest-850 border-outline-variant hover:bg-surface-container-low',
                  )}
                >
                  <span className="text-navy dark:text-forest-50 text-xs font-bold">Selected packages only</span>
                  <span className="text-on-surface-variant dark:text-forest-300 mt-1 text-[11px]">
                    Only selected packages qualify at checkout and display this voucher.
                  </span>
                </button>
              </div>

              {scopeMode === 'SPECIFIC' && (
                <div className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant space-y-3 rounded-xl border p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-[200px] flex-1">
                      <Input
                        value={packageQuery}
                        onChange={(event) => setPackageQuery(event.target.value)}
                        placeholder="Search packages by name, code, or category..."
                        leftIcon={<Search className="h-3.5 w-3.5" />}
                        className={INPUT_DARK_CLASS}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="dark:text-forest-200 text-on-surface font-semibold">
                        {selectedPackages.length} selected
                      </span>
                      {selectedPackages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setValue('applicablePackageIds', [], { shouldDirty: true })}
                          className="cursor-pointer font-semibold text-rose-600 hover:underline dark:text-rose-400"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                    {filteredPackages.length === 0 ? (
                      <p className="text-on-surface-variant dark:text-forest-400 py-4 text-center text-xs">
                        No packages match your filter.
                      </p>
                    ) : (
                      filteredPackages.map((pkg) => {
                        const checked = (applicablePackageIdsValue ?? []).includes(pkg.id);
                        return (
                          <label
                            key={pkg.id}
                            className={cn(
                              'flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition',
                              checked
                                ? 'border-primary/50 bg-emerald-50/70 dark:border-emerald-700/60 dark:bg-emerald-950/35'
                                : 'dark:border-forest-800 dark:hover:bg-forest-850 border-outline-variant hover:bg-surface-container-low',
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePackage(pkg.id)}
                                className="accent-primary h-4 w-4 shrink-0 rounded"
                              />
                              <div className="min-w-0">
                                <p className="text-navy dark:text-forest-50 truncate font-semibold">{pkg.name}</p>
                                <p className="text-on-surface-variant dark:text-forest-300 text-[11px]">
                                  <span className="font-mono">{pkg.code}</span> · {pkg.categoryCode}
                                </p>
                              </div>
                            </div>
                            <span className="text-on-surface-variant dark:text-forest-200 shrink-0 font-mono text-[11px] font-semibold">
                              {formatVnd(pkg.price)}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {errors.applicablePackageIds?.message && (
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {errors.applicablePackageIds.message}
                </p>
              )}
            </div>

            {/* Structured Conditions Builder */}
            <div className="dark:border-forest-800 border-outline-variant space-y-3 border-t pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-navy dark:text-forest-100 block text-xs font-semibold">
                    Eligibility condition bullets ({conditionFields.length}/{VOUCHER_FIELD_LIMITS.maxConditions})
                  </label>
                  <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-[11px]">
                    Shown inside the Recruiter tooltip and Package Detail condition drawer.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm" variant="neutral" onClick={handleGenerateSuggestedConditions}>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Auto-fill from rules</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={conditionFields.length >= VOUCHER_FIELD_LIMITS.maxConditions}
                    onClick={() => append({ text: '' })}
                    className="dark:border-forest-700 dark:text-forest-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add bullet</span>
                  </Button>
                </div>
              </div>

              {conditionFields.length === 0 ? (
                <div className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant rounded-xl border border-dashed px-4 py-5 text-center text-xs">
                  <p className="text-on-surface-variant dark:text-forest-300">
                    No custom conditions added yet. Recruiter views will automatically summarize the discount rules.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conditionFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-3 h-4 w-4 shrink-0 text-[#00b14f]" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <Input
                          placeholder={`Condition bullet #${index + 1} (e.g. Áp dụng trên giá niêm yết...)`}
                          error={errors.conditions?.[index]?.text?.message}
                          className={INPUT_DARK_CLASS}
                          {...register(`conditions.${index}.text`)}
                        />
                      </div>
                      <div className="mt-1.5 flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => swap(index, index - 1)}
                          aria-label="Move condition up"
                          className="dark:text-forest-300 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-low cursor-pointer rounded-md p-1.5 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === conditionFields.length - 1}
                          onClick={() => swap(index, index + 1)}
                          aria-label="Move condition down"
                          className="dark:text-forest-300 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-low cursor-pointer rounded-md p-1.5 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          aria-label="Remove condition"
                          className="cursor-pointer rounded-md p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dark:border-forest-800 border-outline-variant flex items-center justify-end gap-3 border-t pt-4">
              <Link
                href={ROUTES.ADMIN_SERVICE_VOUCHERS}
                className={buttonClassName({
                  variant: 'outline',
                  size: 'md',
                  className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
                })}
              >
                Cancel
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                {isEditing ? 'Save changes' : 'Create voucher'}
              </Button>
            </div>
          </section>
        </form>

        {/* Right Sticky Recruiter Preview */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-4 shadow-xs">
            <p className="text-navy dark:text-forest-50 text-xs font-bold tracking-wider uppercase">
              Recruiter Wallet Preview
            </p>
            <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 mb-3 text-[11px]">
              How this voucher card appears in Recruiter &rarr; Vouchers.
            </p>
            <CouponWalletCard
              voucher={{
                code: (codeValue || 'VOUCHER25').toUpperCase(),
                label: labelValue || 'Giảm 25% tổng giá trị đơn hàng',
                description: descriptionValue,
                ribbonLabel: ribbonLabelValue,
                accentColor: accentColorValue,
                conditions: liveConditionsList,
                applicablePackages: scopeMode === 'SPECIFIC' ? selectedPackages : [],
                minOrderValue: Number(minOrderValue) || 0,
                maxDiscount: discountTypeValue === 'PERCENTAGE' && maxDiscountValue ? Number(maxDiscountValue) : null,
                perCompanyLimit: perCompanyLimitValue ? Number(perCompanyLimitValue) : null,
                endsAt: previewEndsAtIso,
              }}
              variant="available"
              nowMs={previewNowMs}
              isPreview
              hideTooltip
            />
          </div>

          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-4 shadow-xs">
            <p className="text-navy dark:text-forest-50 text-xs font-bold tracking-wider uppercase">
              Conditions Accordion Preview
            </p>
            <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 mb-3 text-[11px]">
              Expanded view when a recruiter clicks this voucher on Package Detail.
            </p>
            <div className="rounded-lg border border-[#00b14f]/40 bg-[#f7fef9] px-3.5 py-3 dark:border-emerald-800/60 dark:bg-emerald-950/30">
              <p className="text-[12.5px] font-bold text-slate-800 dark:text-emerald-100">Điều kiện áp dụng:</p>
              <ul className="mt-2 space-y-1.5">
                {liveConditionsList.map((condition, index) => (
                  <li
                    key={`${condition}-${index}`}
                    className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-700 dark:text-emerald-50/90"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00b14f]" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

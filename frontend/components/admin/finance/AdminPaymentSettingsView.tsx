'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPaymentSettingsPreview from '@/components/admin/finance/AdminPaymentSettingsPreview';
import { Button, buttonClassName } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import {
  BILLING_RULE_LIMITS,
  formatSampleOrderCode,
  paymentSettingsSchema,
  resolveTransferKeyword,
  toPaymentSettingsFormDefaults,
  toSaveBillingSettingsPayload,
  type PaymentSettingsFormData,
} from '@/schemas/payment-settings.schema';
import type { BillingSettings, SupportedBank } from '@/types/admin-payment';
import { formatDateTime } from '@/utils/datetime';
import { applyFormError, getErrorMessage } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRight, CheckCircle2, Info, KeyRound, Receipt, RotateCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AdminPaymentSettingsViewProps {
  initial: BillingSettings;
  banks: SupportedBank[];
}

const INPUT_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

const PAYMENT_SETTINGS_FIELDS: ReadonlyArray<keyof PaymentSettingsFormData> = [
  'vatPercent',
  'orderExpireHours',
  'orderCodePrefix',
  'maxPendingOrders',
  'bankCode',
  'bankAccountNumber',
  'bankAccountName',
  'paymentSyncEnabled',
];

export default function AdminPaymentSettingsView({ initial, banks }: AdminPaymentSettingsViewProps) {
  const formId = useId();
  const [serverMeta, setServerMeta] = useState({
    apiTokenConfigured: initial.apiTokenConfigured,
    paymentSyncSince: initial.paymentSyncSince,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PaymentSettingsFormData>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: toPaymentSettingsFormDefaults(initial),
  });

  const watched = useWatch({ control });
  const vatPercent = watched.vatPercent ?? '';
  const orderExpireHours = watched.orderExpireHours ?? '';
  const orderCodePrefix = watched.orderCodePrefix ?? '';
  const maxPendingOrders = watched.maxPendingOrders ?? '';
  const bankCode = watched.bankCode ?? '';
  const bankAccountNumber = watched.bankAccountNumber ?? '';
  const bankAccountName = watched.bankAccountName ?? '';
  const paymentSyncEnabled = Boolean(watched.paymentSyncEnabled);

  const selectedBank = useMemo(() => banks.find((bank) => bank.code === bankCode), [banks, bankCode]);
  const transferKeyword = resolveTransferKeyword(bankCode, selectedBank?.contentKeyword);

  const onSubmit = async (values: PaymentSettingsFormData) => {
    if (values.paymentSyncEnabled && !serverMeta.apiTokenConfigured) {
      setError('paymentSyncEnabled', {
        message: 'SEPAY_API_TOKEN is missing on the server environment. Add it before enabling reconciliation.',
      });
      return;
    }

    try {
      const next = await adminPaymentApi.updateSettings(toSaveBillingSettingsPayload(values));
      setServerMeta({
        apiTokenConfigured: next.apiTokenConfigured,
        paymentSyncSince: next.paymentSyncSince,
      });
      reset(toPaymentSettingsFormDefaults(next));
      toast.success('Payment settings saved.');
    } catch (cause) {
      applyFormError<PaymentSettingsFormData>(cause, setError, PAYMENT_SETTINGS_FIELDS);
      toast.error(getErrorMessage(cause));
    }
  };

  return (
    <div className="space-y-5 pb-16">
      <AdminPageHeader
        className="mb-0"
        description="Configure platform VAT, order expiration windows, SePay VietQR bank details, and automatic transfer reconciliation."
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_FINANCE_ORDERS}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <Receipt className="h-4 w-4" />
              <span>Orders</span>
            </Link>
            <Link
              href={ROUTES.ADMIN_FINANCE_TRANSACTIONS}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Bank transactions</span>
            </Link>
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={() => reset()}
                className="dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850"
              >
                Reset
              </Button>
            )}
            <Button
              type="submit"
              form={formId}
              size="md"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Save settings
            </Button>
          </>
        }
      />

      {errors.root?.message && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {errors.root.message}
        </div>
      )}

      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant mb-4 border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Billing rules</h2>
              <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                Applied automatically to every new recruiter order. Existing orders keep their snapshot at checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="VAT (%)"
                type="number"
                min={BILLING_RULE_LIMITS.vatMin}
                max={BILLING_RULE_LIMITS.vatMax}
                step="0.01"
                className={INPUT_DARK_CLASS}
                error={errors.vatPercent?.message}
                helperText="Applied to the post-discount subtotal and rounded to whole VND."
                {...register('vatPercent')}
              />

              <Input
                label="Order payment window (hours)"
                type="number"
                min={BILLING_RULE_LIMITS.expireHoursMin}
                max={BILLING_RULE_LIMITS.expireHoursMax}
                className={INPUT_DARK_CLASS}
                error={errors.orderExpireHours?.message}
                helperText="Default 72 hours (3 days). Unpaid orders expire automatically afterwards."
                {...register('orderExpireHours')}
              />

              <Input
                label="Order code prefix"
                placeholder="IVO"
                maxLength={BILLING_RULE_LIMITS.prefixMax}
                className={cn('font-mono uppercase', INPUT_DARK_CLASS)}
                error={errors.orderCodePrefix?.message}
                helperText="2–10 uppercase letters. Matched against <PREFIX> + 8 characters in bank memos."
                {...register('orderCodePrefix', {
                  onBlur: (event) =>
                    setValue('orderCodePrefix', event.target.value.trim().toUpperCase(), { shouldDirty: true }),
                })}
              />

              <Input
                label="Max unpaid orders per company"
                type="number"
                min={BILLING_RULE_LIMITS.maxPendingMin}
                max={BILLING_RULE_LIMITS.maxPendingMax}
                className={INPUT_DARK_CLASS}
                error={errors.maxPendingOrders?.message}
                helperText="Limits concurrent PENDING_PAYMENT or UNDERPAID orders per company."
                {...register('maxPendingOrders')}
              />
            </div>
          </section>

          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant mb-4 border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">SePay bank account &amp; VietQR</h2>
              <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                Recruiters see these receiving details and the matching qr.sepay.vn code on their order page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Bank"
                className={INPUT_DARK_CLASS}
                error={errors.bankCode?.message}
                options={[
                  { value: '', label: '— Not set —' },
                  ...banks.map((bank) => ({ value: bank.code, label: `${bank.code} — ${bank.name}` })),
                ]}
                helperText="Only banks supported by qr.sepay.vn are listed."
                {...register('bankCode')}
              />

              <Input
                label="Account number"
                placeholder="e.g. 108876543210"
                maxLength={BILLING_RULE_LIMITS.accountNumberMax}
                className={cn('font-mono', INPUT_DARK_CLASS)}
                error={errors.bankAccountNumber?.message}
                helperText="Digits or VA code registered with SePay (spaces stripped automatically)."
                {...register('bankAccountNumber', {
                  onBlur: (event) =>
                    setValue('bankAccountNumber', event.target.value.replace(/\s+/g, ''), { shouldDirty: true }),
                })}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Account holder"
                  placeholder="e.g. MAI TRUNG HAU"
                  maxLength={BILLING_RULE_LIMITS.accountNameMax}
                  className={INPUT_DARK_CLASS}
                  error={errors.bankAccountName?.message}
                  helperText="Displayed beside the VietQR code for manual transfer verification."
                  {...register('bankAccountName')}
                />
              </div>

              {transferKeyword && (
                <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/90 px-3.5 py-3 text-xs text-sky-950 sm:col-span-2 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                  <div className="space-y-1 leading-relaxed">
                    <p className="font-semibold">
                      {bankCode || selectedBank?.name} ({transferKeyword}) transfer prefix is active automatically
                    </p>
                    <p>
                      This bank only notifies SePay when the transfer memo starts with{' '}
                      <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono font-bold text-sky-900 dark:bg-sky-900/60 dark:text-sky-100">
                        {transferKeyword}
                      </code>
                      . InterVue automatically adds this prefix to VietQR codes and payment instructions (for example:{' '}
                      <code className="font-mono font-semibold">
                        {transferKeyword} {formatSampleOrderCode(orderCodePrefix)}
                      </code>
                      ).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant mb-4 border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Automatic SePay reconciliation</h2>
              <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                Polls SePay every 2 minutes to match incoming bank transfers against open orders.
              </p>
            </div>

            <div className="space-y-4">
              <div
                className={cn(
                  'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs font-medium',
                  serverMeta.apiTokenConfigured
                    ? 'border-emerald-200 bg-emerald-50/90 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-amber-200 bg-amber-50/90 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
                )}
              >
                <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {serverMeta.apiTokenConfigured
                    ? 'SEPAY_API_TOKEN is present in the server environment.'
                    : 'SEPAY_API_TOKEN is not set in the server environment. Add it before enabling reconciliation.'}
                </span>
              </div>

              <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/50 flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-navy dark:text-forest-50 text-sm font-semibold">
                    Run automatic reconciliation on a schedule
                  </p>
                  <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs leading-relaxed">
                    Even while disabled, admins can trigger a manual check anytime from Bank transactions.
                  </p>
                </div>

                <Controller
                  control={control}
                  name="paymentSyncEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      disabled={!serverMeta.apiTokenConfigured && !field.value}
                      onChange={(checked) => {
                        clearErrors('paymentSyncEnabled');
                        field.onChange(checked);
                      }}
                      ariaLabel="Automatic reconciliation"
                    />
                  )}
                />
              </div>

              {errors.paymentSyncEnabled?.message && (
                <p className="text-error text-xs font-medium">{errors.paymentSyncEnabled.message}</p>
              )}

              <div className="dark:border-forest-800 dark:bg-forest-950/40 border-outline-variant flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-relaxed">
                <ShieldCheck className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <div className="text-on-surface-variant dark:text-forest-300 space-y-1">
                  {serverMeta.paymentSyncSince ? (
                    <p>
                      Cut-off active since{' '}
                      <strong className="text-navy dark:text-forest-100">
                        {formatDateTime(serverMeta.paymentSyncSince)}
                      </strong>
                      . Historical personal transfers prior to that timestamp are never fetched or imported.
                    </p>
                  ) : (
                    <p>
                      Reconciliation has never been turned on yet. The first time you enable it, that timestamp becomes
                      the permanent cut-off so older personal transfers on the account are ignored.
                    </p>
                  )}
                  <p>
                    Any incoming transfer without a matching order code (e.g. a personal transfer during local testing)
                    is stored as <code className="font-mono font-semibold">UNMATCHED</code> without touching orders.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <AdminPaymentSettingsPreview
          vatPercent={vatPercent ?? ''}
          orderExpireHours={orderExpireHours ?? ''}
          orderCodePrefix={orderCodePrefix ?? ''}
          maxPendingOrders={maxPendingOrders ?? ''}
          bankCode={bankCode ?? ''}
          bankName={selectedBank?.name}
          bankContentKeyword={selectedBank?.contentKeyword}
          bankAccountNumber={bankAccountNumber ?? ''}
          bankAccountName={bankAccountName ?? ''}
          paymentSyncEnabled={Boolean(paymentSyncEnabled)}
          apiTokenConfigured={serverMeta.apiTokenConfigured}
          paymentSyncSince={serverMeta.paymentSyncSince}
        />
      </form>
    </div>
  );
}

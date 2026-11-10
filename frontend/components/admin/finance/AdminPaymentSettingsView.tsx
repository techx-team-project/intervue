'use client';

import { adminPaymentApi } from '@/apiRequest/admin-payment';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import type { BillingSettings } from '@/types/admin-payment';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, KeyRound } from 'lucide-react';
import { useState } from 'react';

interface AdminPaymentSettingsViewProps {
  initial: BillingSettings;
}

export default function AdminPaymentSettingsView({ initial }: AdminPaymentSettingsViewProps) {
  const [vatPercent, setVatPercent] = useState(String(Math.round(initial.vatRate * 10000) / 100));
  const [orderExpireHours, setOrderExpireHours] = useState(String(initial.orderExpireHours));
  const [orderCodePrefix, setOrderCodePrefix] = useState(initial.orderCodePrefix);
  const [maxPendingOrders, setMaxPendingOrders] = useState(String(initial.maxPendingOrders));
  const [bankCode, setBankCode] = useState(initial.bankCode ?? '');
  const [bankAccountNumber, setBankAccountNumber] = useState(initial.bankAccountNumber ?? '');
  const [bankAccountName, setBankAccountName] = useState(initial.bankAccountName ?? '');
  const [paymentSyncEnabled, setPaymentSyncEnabled] = useState(initial.paymentSyncEnabled);

  const [apiTokenConfigured, setApiTokenConfigured] = useState(initial.apiTokenConfigured);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      const next = await adminPaymentApi.updateSettings({
        vatRate: Number(vatPercent) / 100,
        orderExpireHours: Number(orderExpireHours),
        orderCodePrefix: orderCodePrefix.trim().toUpperCase(),
        maxPendingOrders: Number(maxPendingOrders),
        bankCode: bankCode.trim() || null,
        bankAccountNumber: bankAccountNumber.trim() || null,
        bankAccountName: bankAccountName.trim() || null,
        paymentSyncEnabled,
      });
      setApiTokenConfigured(next.apiTokenConfigured);
      setSaved(true);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-16">
      <div>
        <h1 className="text-navy text-xl font-bold sm:text-2xl">Payment settings</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Billing rules and the bank account recruiters transfer to.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          <Check className="h-4 w-4 text-emerald-600" />
          Settings saved.
        </div>
      )}

      <section className="border-outline-variant grid gap-4 rounded-2xl border bg-white p-5 shadow-2xs sm:grid-cols-2">
        <h2 className="text-on-surface text-base font-bold sm:col-span-2">Billing rules</h2>
        <Input
          label="VAT (%)"
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={vatPercent}
          onChange={(event) => setVatPercent(event.target.value)}
          helperText="Applied to the amount after discount, rounded to whole đồng"
          required
        />
        <Input
          label="Order payment window (hours)"
          type="number"
          min={1}
          max={720}
          value={orderExpireHours}
          onChange={(event) => setOrderExpireHours(event.target.value)}
          required
        />
        <Input
          label="Order code prefix"
          value={orderCodePrefix}
          onChange={(event) => setOrderCodePrefix(event.target.value)}
          helperText="Uppercase letters only. Changing this does not affect existing orders."
          required
        />
        <Input
          label="Max unpaid orders per company"
          type="number"
          min={1}
          max={20}
          value={maxPendingOrders}
          onChange={(event) => setMaxPendingOrders(event.target.value)}
          required
        />
      </section>

      <section className="border-outline-variant grid gap-4 rounded-2xl border bg-white p-5 shadow-2xs sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-on-surface text-base font-bold">SePay bank account</h2>
          <p className="text-on-surface-variant mt-0.5 text-xs">
            Recruiters see these details and the matching VietQR code on their order page.
          </p>
        </div>
        <Input
          label="Bank code"
          value={bankCode}
          onChange={(event) => setBankCode(event.target.value)}
          helperText="As used by SePay QR, e.g. MBBank or Vietcombank"
        />
        <Input
          label="Account number"
          value={bankAccountNumber}
          onChange={(event) => setBankAccountNumber(event.target.value)}
        />
        <div className="sm:col-span-2">
          <Input
            label="Account holder"
            value={bankAccountName}
            onChange={(event) => setBankAccountName(event.target.value)}
          />
        </div>

        <div
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold sm:col-span-2 ${
            apiTokenConfigured ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          {apiTokenConfigured
            ? 'SEPAY_API_TOKEN is present in the server environment.'
            : 'SEPAY_API_TOKEN is not set. Add it to the server environment before enabling reconciliation.'}
        </div>

        <label className="flex items-center gap-3 text-sm sm:col-span-2">
          <Switch
            checked={paymentSyncEnabled}
            onChange={setPaymentSyncEnabled}
            ariaLabel="Automatic reconciliation"
            size="sm"
          />
          <span className="text-on-surface font-medium">Run automatic reconciliation on a schedule</span>
        </label>
      </section>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving}>
          Save settings
        </Button>
      </div>
    </form>
  );
}

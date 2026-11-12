'use client';

import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { BusinessInvoiceInfo } from '@/types/recruiter-cart';
import { isBusinessInvoiceComplete, isValidInvoiceEmail, isValidTaxId } from '@/utils/cart-invoice';
import { useState } from 'react';

interface CartInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessInvoice: BusinessInvoiceInfo;
  onSave: (business: BusinessInvoiceInfo) => void;
}

export default function CartInvoiceModal({ isOpen, onClose, businessInvoice, onSave }: CartInvoiceModalProps) {
  const [businessDraft, setBusinessDraft] = useState<BusinessInvoiceInfo>(businessInvoice);
  const [confirmed, setConfirmed] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const taxIdError = touched.taxId && !isValidTaxId(businessDraft.taxId) ? 'Tax ID is invalid (8–20 digits).' : null;
  const companyNameError =
    touched.companyName && !businessDraft.companyName.trim() ? 'Please enter the company / business name.' : null;
  const companyAddressError =
    touched.companyAddress && !businessDraft.companyAddress.trim() ? 'Please enter the company address.' : null;
  const businessEmailError =
    touched.businessEmail && !isValidInvoiceEmail(businessDraft.recipientEmail) ? 'E-invoice email is invalid.' : null;

  const canSave = isBusinessInvoiceComplete(businessDraft) && confirmed;

  const ownerLabel = businessDraft.companyName.trim() || 'the business';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    onSave({
      taxId: businessDraft.taxId.trim(),
      companyName: businessDraft.companyName.trim(),
      companyAddress: businessDraft.companyAddress.trim(),
      recipientEmail: businessDraft.recipientEmail.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      radius="xl"
      title="Corporate e-invoice information"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="border-outline-variant bg-surface-container-high text-on-surface hover:bg-surface-container cursor-pointer rounded-lg border px-5 py-2 text-sm font-semibold transition"
          >
            Close
          </button>
          <button
            type="submit"
            form="cart-invoice-form"
            disabled={!canSave}
            className="bg-primary cursor-pointer rounded-lg px-6 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save
          </button>
        </>
      }
    >
      <form id="cart-invoice-form" onSubmit={handleSubmit} className="space-y-4">
        <p className="text-on-surface-variant text-xs leading-relaxed">
          Every order is billed as a corporate e-invoice. Please provide your company&apos;s tax details below.
        </p>

        <div className="space-y-3.5">
          <div>
            <label htmlFor="invoice-tax-id" className="text-on-surface block text-sm font-medium">
              Tax ID <span className="text-rose-500">*</span>
            </label>
            <input
              id="invoice-tax-id"
              type="text"
              value={businessDraft.taxId}
              onBlur={() => markTouched('taxId')}
              onChange={(e) => setBusinessDraft((prev) => ({ ...prev, taxId: e.target.value }))}
              placeholder="Enter the business tax ID"
              className={cn(
                'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                taxIdError ? 'border-rose-500 focus:border-rose-500' : 'border-outline-variant focus:border-primary',
              )}
            />
            {taxIdError && <p className="mt-1 text-xs text-rose-600">{taxIdError}</p>}
          </div>

          <div>
            <label htmlFor="invoice-company-name" className="text-on-surface block text-sm font-medium">
              Company / business name <span className="text-rose-500">*</span>
            </label>
            <input
              id="invoice-company-name"
              type="text"
              value={businessDraft.companyName}
              onBlur={() => markTouched('companyName')}
              onChange={(e) => setBusinessDraft((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Enter the company or business name"
              className={cn(
                'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                companyNameError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-outline-variant focus:border-primary',
              )}
            />
            {companyNameError && <p className="mt-1 text-xs text-rose-600">{companyNameError}</p>}
          </div>

          <div>
            <label htmlFor="invoice-company-address" className="text-on-surface block text-sm font-medium">
              Company address <span className="text-rose-500">*</span>
            </label>
            <input
              id="invoice-company-address"
              type="text"
              value={businessDraft.companyAddress}
              onBlur={() => markTouched('companyAddress')}
              onChange={(e) => setBusinessDraft((prev) => ({ ...prev, companyAddress: e.target.value }))}
              placeholder="Enter the registered business address"
              className={cn(
                'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                companyAddressError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-outline-variant focus:border-primary',
              )}
            />
            {companyAddressError && <p className="mt-1 text-xs text-rose-600">{companyAddressError}</p>}
          </div>

          <div>
            <label htmlFor="invoice-business-email" className="text-on-surface block text-sm font-medium">
              E-invoice email <span className="text-rose-500">*</span>
            </label>
            <input
              id="invoice-business-email"
              type="email"
              value={businessDraft.recipientEmail}
              onBlur={() => markTouched('businessEmail')}
              onChange={(e) => setBusinessDraft((prev) => ({ ...prev, recipientEmail: e.target.value }))}
              placeholder="name@company.com"
              className={cn(
                'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                businessEmailError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-outline-variant focus:border-primary',
              )}
            />
            {businessEmailError && <p className="mt-1 text-xs text-rose-600">{businessEmailError}</p>}
          </div>
        </div>

        {/* Legal responsibility confirmation */}
        <label className="text-on-surface flex cursor-pointer items-start gap-2.5 pt-1 text-[13px] leading-relaxed">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="text-primary mt-0.5 h-4 w-4 shrink-0 rounded accent-[#00b14f]"
          />
          <span>
            I confirm that I am the authorized person or a duly authorized representative of{' '}
            <strong className="font-semibold">{ownerLabel}</strong> to{' '}
            <strong className="font-semibold">agree to the VAT invoice details</strong> for this order and affirm that
            the information above is true. I take full legal responsibility for the content I have provided.
          </span>
        </label>
      </form>
    </Modal>
  );
}

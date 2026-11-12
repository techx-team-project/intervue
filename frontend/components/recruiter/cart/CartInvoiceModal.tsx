'use client';

import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { BusinessInvoiceInfo, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';
import {
  isBusinessInvoiceComplete,
  isPersonalInvoiceComplete,
  isValidInvoiceEmail,
  isValidPersonalDocumentNumber,
  isValidTaxId,
} from '@/utils/cart-invoice';
import { useState } from 'react';

interface CartInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: InvoiceType;
  businessInvoice: BusinessInvoiceInfo;
  personalInvoice: PersonalInvoiceInfo;
  onSave: (type: InvoiceType, business: BusinessInvoiceInfo, personal: PersonalInvoiceInfo) => void;
}

export default function CartInvoiceModal({
  isOpen,
  onClose,
  initialType,
  businessInvoice,
  personalInvoice,
  onSave,
}: CartInvoiceModalProps) {
  const [activeType, setActiveType] = useState<InvoiceType>(initialType);
  const [businessDraft, setBusinessDraft] = useState<BusinessInvoiceInfo>(businessInvoice);
  const [personalDraft, setPersonalDraft] = useState<PersonalInvoiceInfo>({
    personalDocumentType: personalInvoice.personalDocumentType ?? 'cccd',
    fullName: personalInvoice.fullName,
    taxOrIdentityNumber: personalInvoice.taxOrIdentityNumber,
    personalAddress: personalInvoice.personalAddress,
    recipientEmail: personalInvoice.recipientEmail,
  });
  const [confirmed, setConfirmed] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const personalDocType = personalDraft.personalDocumentType ?? 'cccd';

  const taxIdError = touched.taxId && !isValidTaxId(businessDraft.taxId) ? 'Tax ID is invalid (8–20 digits).' : null;
  const companyNameError =
    touched.companyName && !businessDraft.companyName.trim() ? 'Please enter the company / business name.' : null;
  const companyAddressError =
    touched.companyAddress && !businessDraft.companyAddress.trim() ? 'Please enter the company address.' : null;
  const businessEmailError =
    touched.businessEmail && !isValidInvoiceEmail(businessDraft.recipientEmail) ? 'E-invoice email is invalid.' : null;

  const personalDocError =
    (touched.personalDoc || personalDraft.taxOrIdentityNumber.trim().length > 0) &&
    !isValidPersonalDocumentNumber(personalDocType, personalDraft.taxOrIdentityNumber)
      ? personalDocType === 'passport'
        ? 'Passport number is invalid (6–20 letters or digits).'
        : 'Citizen ID number is invalid (must be 12 digits).'
      : null;
  const fullNameError = touched.fullName && !personalDraft.fullName.trim() ? 'Please enter your full name.' : null;
  const personalAddressError =
    touched.personalAddress && !personalDraft.personalAddress.trim() ? 'Please enter your address.' : null;
  const personalEmailError =
    touched.personalEmail && !isValidInvoiceEmail(personalDraft.recipientEmail) ? 'E-invoice email is invalid.' : null;

  const isCurrentValid =
    activeType === 'business' ? isBusinessInvoiceComplete(businessDraft) : isPersonalInvoiceComplete(personalDraft);
  const canSave = isCurrentValid && confirmed;

  const ownerLabel =
    activeType === 'business'
      ? businessDraft.companyName.trim() || 'the business'
      : personalDraft.fullName.trim() || 'the buyer';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    onSave(
      activeType,
      {
        taxId: businessDraft.taxId.trim(),
        companyName: businessDraft.companyName.trim(),
        companyAddress: businessDraft.companyAddress.trim(),
        recipientEmail: businessDraft.recipientEmail.trim(),
      },
      {
        personalDocumentType: personalDocType,
        fullName: personalDraft.fullName.trim(),
        taxOrIdentityNumber: personalDraft.taxOrIdentityNumber.trim(),
        personalAddress: personalDraft.personalAddress.trim(),
        recipientEmail: personalDraft.recipientEmail.trim(),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      radius="xl"
      title="Invoice information"
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
        {/* Invoice type selector */}
        <div>
          <p className="text-on-surface text-sm font-semibold">
            Invoice type <span className="text-rose-500">*</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {(
              [
                { value: 'business', label: 'Business invoice' },
                { value: 'personal', label: 'Personal invoice' },
              ] as const
            ).map((option) => {
              const selected = activeType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveType(option.value)}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition',
                    selected
                      ? 'border-primary bg-primary-light/50 text-primary-deep font-semibold'
                      : 'border-outline-variant text-on-surface hover:border-outline bg-white',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border',
                      selected ? 'border-primary' : 'border-outline',
                    )}
                  >
                    {selected && <span className="bg-primary h-2 w-2 rounded-full" />}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeType === 'business' ? (
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
        ) : (
          <div className="space-y-3.5">
            <div>
              <span className="text-on-surface block text-sm font-medium">
                {personalDocType === 'passport' ? 'Passport number' : 'Citizen ID number'}{' '}
                <span className="text-rose-500">*</span>
              </span>
              <div className="mt-1.5 flex items-center gap-5">
                {(
                  [
                    { value: 'cccd', label: 'CCCD' },
                    { value: 'passport', label: 'Passport' },
                  ] as const
                ).map((docOption) => {
                  const selected = personalDocType === docOption.value;
                  return (
                    <label key={docOption.value} className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="personalDocumentType"
                        checked={selected}
                        onChange={() =>
                          setPersonalDraft((prev) => ({ ...prev, personalDocumentType: docOption.value }))
                        }
                        className="text-primary h-4 w-4 accent-[#00b14f]"
                      />
                      <span className={selected ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
                        {docOption.label}
                      </span>
                    </label>
                  );
                })}
              </div>
              <input
                id="invoice-personal-doc"
                type="text"
                value={personalDraft.taxOrIdentityNumber}
                onBlur={() => markTouched('personalDoc')}
                onChange={(e) => setPersonalDraft((prev) => ({ ...prev, taxOrIdentityNumber: e.target.value }))}
                placeholder={
                  personalDocType === 'passport' ? 'Enter the passport number' : 'Enter the 12-digit citizen ID number'
                }
                className={cn(
                  'text-on-surface mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                  personalDocError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-outline-variant focus:border-primary',
                )}
              />
              {personalDocError && <p className="mt-1 text-xs text-rose-600">{personalDocError}</p>}
            </div>

            <div>
              <label htmlFor="invoice-full-name" className="text-on-surface block text-sm font-medium">
                Full name <span className="text-rose-500">*</span>
              </label>
              <input
                id="invoice-full-name"
                type="text"
                value={personalDraft.fullName}
                onBlur={() => markTouched('fullName')}
                onChange={(e) => setPersonalDraft((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter the full name of the invoice recipient"
                className={cn(
                  'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                  fullNameError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-outline-variant focus:border-primary',
                )}
              />
              {fullNameError && <p className="mt-1 text-xs text-rose-600">{fullNameError}</p>}
            </div>

            <div>
              <label htmlFor="invoice-personal-address" className="text-on-surface block text-sm font-medium">
                Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="invoice-personal-address"
                type="text"
                value={personalDraft.personalAddress}
                onBlur={() => markTouched('personalAddress')}
                onChange={(e) => setPersonalDraft((prev) => ({ ...prev, personalAddress: e.target.value }))}
                placeholder="Enter the contact address"
                className={cn(
                  'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                  personalAddressError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-outline-variant focus:border-primary',
                )}
              />
              {personalAddressError && <p className="mt-1 text-xs text-rose-600">{personalAddressError}</p>}
            </div>

            <div>
              <label htmlFor="invoice-personal-email" className="text-on-surface block text-sm font-medium">
                E-invoice email <span className="text-rose-500">*</span>
              </label>
              <input
                id="invoice-personal-email"
                type="email"
                value={personalDraft.recipientEmail}
                onBlur={() => markTouched('personalEmail')}
                onChange={(e) => setPersonalDraft((prev) => ({ ...prev, recipientEmail: e.target.value }))}
                placeholder="name@example.com"
                className={cn(
                  'text-on-surface mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-hidden',
                  personalEmailError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-outline-variant focus:border-primary',
                )}
              />
              {personalEmailError && <p className="mt-1 text-xs text-rose-600">{personalEmailError}</p>}
            </div>
          </div>
        )}

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

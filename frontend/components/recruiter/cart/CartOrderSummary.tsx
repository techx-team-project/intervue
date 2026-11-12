'use client';

import Modal from '@/components/ui/Modal';
import type { BusinessInvoiceInfo, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';
import type { VoucherPreview } from '@/types/voucher';
import { FileText, Info, Receipt, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';

interface CartOrderSummaryProps {
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  vatAmount: number;
  totalAmount: number;
  appliedVoucher: VoucherPreview | null;
  onOpenVoucherModal: () => void;
  invoiceType: InvoiceType | null;
  onSelectInvoiceType: (type: InvoiceType) => void;
  businessInvoice: BusinessInvoiceInfo;
  personalInvoice: PersonalInvoiceInfo;
  onUpdateBusinessInvoice: (data: Partial<BusinessInvoiceInfo>) => void;
  onUpdatePersonalInvoice: (data: Partial<PersonalInvoiceInfo>) => void;
  termsAccepted: boolean;
  onToggleTerms: (accepted: boolean) => void;
  onSubmitOrder: () => void;
  selectedCount: number;
  hasItems: boolean;
}

export default function CartOrderSummary({
  subtotal,
  discountAmount,
  subtotalAfterDiscount,
  vatAmount,
  totalAmount,
  appliedVoucher,
  onOpenVoucherModal,
  invoiceType,
  onSelectInvoiceType,
  businessInvoice,
  personalInvoice,
  onUpdateBusinessInvoice,
  onUpdatePersonalInvoice,
  termsAccepted,
  onToggleTerms,
  onSubmitOrder,
  selectedCount,
  hasItems,
}: CartOrderSummaryProps) {
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const canSubmit = selectedCount > 0 && !!invoiceType && termsAccepted;

  return (
    <>
      <div className="border-outline-variant rounded-xl border bg-white p-5">
        <h3 className="text-primary text-sm font-bold tracking-wider uppercase">ORDER SUMMARY</h3>

        {/* Pricing breakdown */}
        <div className="text-body-md mt-4 space-y-3">
          <div className="text-on-surface flex items-center justify-between">
            <span>Order subtotal</span>
            <span className="text-on-surface font-semibold">
              {subtotal > 0 ? `${subtotal.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="text-primary flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Ticket className="h-3.5 w-3.5" />
                <span>Promotional discount</span>
              </span>
              <span className="font-semibold">-{discountAmount.toLocaleString('vi-VN')} VND</span>
            </div>
          )}

          <div className="text-on-surface flex items-center justify-between">
            <span>Subtotal before VAT</span>
            <span className="text-on-surface font-semibold">
              {subtotalAfterDiscount > 0 ? `${subtotalAfterDiscount.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          <div className="text-on-surface flex items-center justify-between">
            <span>VAT (8%)</span>
            <span className="text-on-surface font-semibold">
              {vatAmount > 0 ? `${vatAmount.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          {/* Voucher row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-on-surface">Coupon code</span>
            <button
              type="button"
              onClick={onOpenVoucherModal}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                appliedVoucher
                  ? 'border-primary/30 bg-primary-light text-primary-deep hover:bg-primary-tag'
                  : 'border-outline text-on-surface-variant hover:border-primary hover:text-primary bg-white'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>{appliedVoucher ? appliedVoucher.code : 'Chọn mã ưu đãi'}</span>
            </button>
          </div>
        </div>

        {/* Total payment */}
        <div className="border-outline-variant mt-5 border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="shrink-0">
              <p className="text-body-md text-on-surface font-semibold">Total payment</p>
              <p className="text-label-sm text-on-surface-variant italic">(VAT included)</p>
            </div>
            <span className="text-primary text-right text-base font-bold whitespace-nowrap sm:text-[17px]">
              {totalAmount > 0 ? `${totalAmount.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          {totalAmount > 0 && (
            <div className="mt-3.5 flex items-center justify-between rounded-lg border border-amber-200/80 bg-[#fffbeb] px-3.5 py-2.5 text-xs">
              <span className="text-on-surface flex items-center gap-1.5 font-medium">
                <span>InterVue Points earned</span>
                <span title="Reward points for recruiters to redeem gifts and upgrades">
                  <Info className="text-outline h-3.5 w-3.5" />
                </span>
              </span>
              <span className="text-primary inline-flex items-center gap-1 font-bold">
                <span>+{Math.max(1, Math.round(totalAmount / 100000))}</span>
                <span className="text-label-sm flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 font-bold text-amber-900">
                  IP
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Invoice selection */}
        <div className="border-outline-variant mt-6 border-t pt-5">
          <div className="text-on-surface flex items-center gap-1.5">
            <Receipt className="text-primary h-4 w-4" />
            <h4 className="text-body-md font-bold">
              Invoice type <span className="text-rose-500">*</span>
            </h4>
          </div>
          <p className="text-label-sm text-on-surface-variant mt-0.5">
            Please choose an invoice type to proceed with checkout
          </p>

          <div className="mt-3 space-y-2">
            {/* Enterprise invoice */}
            <label
              onClick={() => onSelectInvoiceType('business')}
              className={`text-body-md flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                invoiceType === 'business'
                  ? 'border-primary bg-primary-light ring-1 ring-[#00b14f]'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="invoiceType"
                  checked={invoiceType === 'business'}
                  onChange={() => onSelectInvoiceType('business')}
                  className="text-primary h-4 w-4 focus:ring-[#00b14f]"
                />
                <span className="text-on-surface font-semibold">Corporate e-invoice</span>
              </div>
              {invoiceType === 'business' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingInvoice((prev) => !prev);
                  }}
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  {isEditingInvoice ? 'Collapse' : 'Details'}
                </button>
              )}
            </label>

            {/* Business invoice details form */}
            {invoiceType === 'business' && isEditingInvoice && (
              <div className="border-outline-variant bg-surface-container-low/60 space-y-2 rounded-lg border p-3 text-xs">
                <div>
                  <label className="text-on-surface-variant font-medium">Tax ID</label>
                  <input
                    type="text"
                    value={businessInvoice.taxId}
                    onChange={(e) => onUpdateBusinessInvoice({ taxId: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-medium">Company name</label>
                  <input
                    type="text"
                    value={businessInvoice.companyName}
                    onChange={(e) => onUpdateBusinessInvoice({ companyName: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-medium">Billing address</label>
                  <input
                    type="text"
                    value={businessInvoice.companyAddress}
                    onChange={(e) => onUpdateBusinessInvoice({ companyAddress: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-medium">E-invoice recipient email</label>
                  <input
                    type="email"
                    value={businessInvoice.recipientEmail}
                    onChange={(e) => onUpdateBusinessInvoice({ recipientEmail: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Personal invoice */}
            <label
              onClick={() => onSelectInvoiceType('personal')}
              className={`text-body-md flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                invoiceType === 'personal'
                  ? 'border-primary bg-primary-light ring-1 ring-[#00b14f]'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="invoiceType"
                  checked={invoiceType === 'personal'}
                  onChange={() => onSelectInvoiceType('personal')}
                  className="text-primary h-4 w-4 focus:ring-[#00b14f]"
                />
                <span className="text-on-surface font-semibold">Individual invoice</span>
              </div>
              {invoiceType === 'personal' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingInvoice((prev) => !prev);
                  }}
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  {isEditingInvoice ? 'Collapse' : 'Details'}
                </button>
              )}
            </label>

            {/* Personal invoice details form */}
            {invoiceType === 'personal' && isEditingInvoice && (
              <div className="border-outline-variant bg-surface-container-low/60 space-y-2 rounded-lg border p-3 text-xs">
                <div>
                  <label className="text-on-surface-variant font-medium">Full name</label>
                  <input
                    type="text"
                    value={personalInvoice.fullName}
                    onChange={(e) => onUpdatePersonalInvoice({ fullName: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-medium">Personal Tax ID / ID card number</label>
                  <input
                    type="text"
                    value={personalInvoice.taxOrIdentityNumber}
                    onChange={(e) => onUpdatePersonalInvoice({ taxOrIdentityNumber: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-medium">Personal address</label>
                  <input
                    type="text"
                    value={personalInvoice.personalAddress}
                    onChange={(e) => onUpdatePersonalInvoice({ personalAddress: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-medium">Recipient email</label>
                  <input
                    type="email"
                    value={personalInvoice.recipientEmail}
                    onChange={(e) => onUpdatePersonalInvoice({ recipientEmail: e.target.value })}
                    className="border-outline text-on-surface focus:border-primary mt-1 w-full rounded border bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms agreement */}
        <div className="mt-4">
          <label className="text-body-sm text-on-surface flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => onToggleTerms(e.target.checked)}
              className="border-outline text-primary mt-0.5 h-4 w-4 rounded-sm focus:ring-[#00b14f]"
            />
            <span>
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
                className="text-primary font-medium hover:underline"
              >
                InterVue Terms of Service
              </button>
              .
            </span>
          </label>
        </div>

        {/* Submit button */}
        <div className="mt-5">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmitOrder}
            className="bg-primary hover:bg-primary disabled:bg-primary/40 w-full rounded-lg py-3 text-center text-sm font-bold text-white transition disabled:cursor-not-allowed"
          >
            Place order
          </button>

          {!canSubmit && hasItems && (
            <p className="text-label-sm text-outline mt-2 text-center">
              {selectedCount === 0
                ? 'Please select at least 1 service'
                : !invoiceType
                  ? 'Please select an invoice type'
                  : 'Please agree to the Terms of Service'}
            </p>
          )}
        </div>
      </div>

      {/* Terms modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        maxWidth="lg"
        title={
          <div className="text-primary flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="text-on-surface font-bold">InterVue Terms of Service</span>
          </div>
        }
      >
        <div className="text-on-surface-variant max-h-72 space-y-2.5 overflow-y-auto py-1 pr-2 text-xs leading-relaxed">
          <p>
            1. <strong>Service Validity:</strong> Featured placement and AI matching packages carry specific validity
            periods (30 or 60 days) starting immediately upon payment confirmation.
          </p>
          <p>
            2. <strong>Refund Policy:</strong> InterVue provides full refunds or package exchange within 24 hours if no
            job posts have been published or activated using the purchased credits.
          </p>
          <p>
            3. <strong>VAT E-Invoices:</strong> Official electronic VAT invoices are automatically generated and emailed
            to your registered billing address within 48 business hours after payment.
          </p>
          <p>
            4. <strong>Data Privacy & Security:</strong> Recruitment data and candidate profiles are safeguarded under
            ISO 27001 information security standards and statutory personal data protection regulations.
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              onToggleTerms(true);
              setShowTermsModal(false);
            }}
            className="bg-primary hover:bg-primary cursor-pointer rounded-lg px-5 py-2.5 text-xs font-bold text-white transition"
          >
            Agree & Close
          </button>
        </div>
      </Modal>
    </>
  );
}

'use client';

import Modal from '@/components/ui/Modal';
import type { BusinessInvoiceInfo } from '@/types/recruiter-cart';
import { isBusinessInvoiceComplete } from '@/utils/cart-invoice';
import type { VoucherPreview } from '@/types/voucher';
import { ChevronDown, ChevronUp, FileText, Receipt, SquarePen, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';

interface CartOrderSummaryProps {
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  vatAmount: number;
  totalAmount: number;
  appliedVoucher: VoucherPreview | null;
  onOpenVoucherModal: () => void;
  onOpenInvoiceModal: () => void;
  businessInvoice: BusinessInvoiceInfo;
  termsAccepted: boolean;
  onToggleTerms: (accepted: boolean) => void;
  onSubmitOrder: () => void;
  selectedCount: number;
  hasItems: boolean;
  isSubmitting?: boolean;
}

export default function CartOrderSummary({
  subtotal,
  discountAmount,
  subtotalAfterDiscount,
  vatAmount,
  totalAmount,
  appliedVoucher,
  onOpenVoucherModal,
  onOpenInvoiceModal,
  businessInvoice,
  termsAccepted,
  onToggleTerms,
  onSubmitOrder,
  selectedCount,
  hasItems,
  isSubmitting = false,
}: CartOrderSummaryProps) {
  const [isInvoiceExpanded, setIsInvoiceExpanded] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const invoiceComplete = isBusinessInvoiceComplete(businessInvoice);
  const canSubmit = selectedCount > 0 && invoiceComplete && termsAccepted && !isSubmitting;

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
              <span>{appliedVoucher ? appliedVoucher.code : 'Select a voucher'}</span>
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
        </div>

        {/* Invoice information */}
        <div className="border-outline-variant mt-6 border-t pt-5">
          <div className="text-on-surface flex items-center gap-1.5">
            <Receipt className="text-primary h-4 w-4" />
            <h4 className="text-body-md font-bold">
              Corporate e-invoice <span className="text-rose-500">*</span>
            </h4>
          </div>
          <p className="text-label-sm text-on-surface-variant mt-0.5">
            Every order is billed to your company as a VAT e-invoice
          </p>

          <div className="border-primary bg-primary-light/35 mt-3 rounded-lg border ring-1 ring-[#00b14f]">
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="text-on-surface text-body-md font-semibold">E-invoice information</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenInvoiceModal}
                  className="text-primary hover:bg-primary/10 cursor-pointer rounded p-1 transition"
                  aria-label="Edit business invoice information"
                  title="Edit information"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                </button>
                {invoiceComplete && (
                  <button
                    type="button"
                    onClick={() => setIsInvoiceExpanded((prev) => !prev)}
                    className="text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded p-1 transition"
                    aria-label={isInvoiceExpanded ? 'Collapse invoice information' : 'Expand invoice information'}
                    aria-expanded={isInvoiceExpanded}
                  >
                    {isInvoiceExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {invoiceComplete && isInvoiceExpanded && (
              <dl className="border-primary/20 space-y-1.5 border-t px-3 pt-2.5 pb-3 text-xs">
                <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                  <dt className="text-on-surface-variant">Tax ID</dt>
                  <dd className="text-on-surface truncate font-medium" title={businessInvoice.taxId}>
                    {businessInvoice.taxId}
                  </dd>
                </div>
                <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                  <dt className="text-on-surface-variant">Company name</dt>
                  <dd className="text-on-surface truncate font-medium" title={businessInvoice.companyName}>
                    {businessInvoice.companyName}
                  </dd>
                </div>
                <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                  <dt className="text-on-surface-variant">Address</dt>
                  <dd className="text-on-surface truncate font-medium" title={businessInvoice.companyAddress}>
                    {businessInvoice.companyAddress}
                  </dd>
                </div>
                <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                  <dt className="text-on-surface-variant">E-invoice email</dt>
                  <dd className="text-on-surface truncate font-medium" title={businessInvoice.recipientEmail}>
                    {businessInvoice.recipientEmail}
                  </dd>
                </div>
              </dl>
            )}

            {!invoiceComplete && (
              <button
                type="button"
                onClick={onOpenInvoiceModal}
                className="text-primary hover:bg-primary/10 w-full cursor-pointer rounded-b-lg px-3 pb-3 text-left text-xs font-semibold transition"
              >
                Complete your company&apos;s e-invoice information to continue
              </button>
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
            className="bg-primary hover:bg-primary disabled:bg-primary/40 w-full cursor-pointer rounded-lg py-3 text-center text-sm font-bold text-white transition disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating order...' : 'Place order'}
          </button>

          {!canSubmit && hasItems && !isSubmitting && (
            <p className="text-label-sm text-outline mt-2 text-center">
              {selectedCount === 0
                ? 'Please select at least 1 service'
                : !invoiceComplete
                  ? 'Please complete the e-invoice information'
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

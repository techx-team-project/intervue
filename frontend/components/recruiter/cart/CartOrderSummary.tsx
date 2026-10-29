'use client';

import Modal from '@/components/ui/Modal';
import type { BusinessInvoiceInfo, DiscountVoucher, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';
import { FileText, Info, Receipt, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';

interface CartOrderSummaryProps {
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  vatAmount: number;
  totalAmount: number;
  appliedVoucher: DiscountVoucher | null;
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
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold tracking-wider text-[#00b14f] uppercase">ORDER SUMMARY</h3>

        {/* Pricing breakdown */}
        <div className="mt-4 space-y-3 text-[13.5px]">
          <div className="flex items-center justify-between text-slate-700">
            <span>Order subtotal</span>
            <span className="font-semibold text-slate-900">
              {subtotal > 0 ? `${subtotal.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-600">
              <span className="flex items-center gap-1">
                <Ticket className="h-3.5 w-3.5" />
                <span>Promotional discount</span>
              </span>
              <span className="font-semibold">-{discountAmount.toLocaleString('vi-VN')} VND</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-700">
            <span>Subtotal before VAT</span>
            <span className="font-semibold text-slate-900">
              {subtotalAfterDiscount > 0 ? `${subtotalAfterDiscount.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span>VAT (8%)</span>
            <span className="font-semibold text-slate-900">
              {vatAmount > 0 ? `${vatAmount.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          {/* Voucher row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-700">Coupon code</span>
            <button
              type="button"
              onClick={onOpenVoucherModal}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                appliedVoucher
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-[#00b14f] hover:text-[#00b14f]'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>{appliedVoucher ? appliedVoucher.code : 'Select coupon'}</span>
            </button>
          </div>
        </div>

        {/* Total payment */}
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="shrink-0">
              <p className="text-[13.5px] font-semibold text-slate-800">Total payment</p>
              <p className="text-[11.5px] text-slate-500 italic">(VAT included)</p>
            </div>
            <span className="text-right text-base font-bold whitespace-nowrap text-[#00b14f] sm:text-[17px]">
              {totalAmount > 0 ? `${totalAmount.toLocaleString('vi-VN')} VND` : '0 VND'}
            </span>
          </div>

          {totalAmount > 0 && (
            <div className="mt-3.5 flex items-center justify-between rounded-lg border border-amber-200/80 bg-[#fffbeb] px-3.5 py-2.5 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span>InterVue Points earned</span>
                <span title="Reward points for recruiters to redeem gifts and upgrades">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-[#00b14f]">
                <span>+{Math.max(1, Math.round(totalAmount / 100000))}</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-amber-900 shadow-2xs">
                  IP
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Invoice selection */}
        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex items-center gap-1.5 text-slate-900">
            <Receipt className="h-4 w-4 text-[#00b14f]" />
            <h4 className="text-[13.5px] font-bold">
              Invoice type <span className="text-rose-500">*</span>
            </h4>
          </div>
          <p className="mt-0.5 text-[11.5px] text-slate-500">Please choose an invoice type to proceed with checkout</p>

          <div className="mt-3 space-y-2">
            {/* Enterprise invoice */}
            <label
              onClick={() => onSelectInvoiceType('business')}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-[13px] transition ${
                invoiceType === 'business'
                  ? 'border-[#00b14f] bg-emerald-50/30 ring-1 ring-[#00b14f]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="invoiceType"
                  checked={invoiceType === 'business'}
                  onChange={() => onSelectInvoiceType('business')}
                  className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                />
                <span className="font-semibold text-slate-800">Corporate e-invoice</span>
              </div>
              {invoiceType === 'business' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingInvoice((prev) => !prev);
                  }}
                  className="text-xs font-semibold text-[#00b14f] hover:underline"
                >
                  {isEditingInvoice ? 'Collapse' : 'Details'}
                </button>
              )}
            </label>

            {/* Business invoice details form */}
            {invoiceType === 'business' && isEditingInvoice && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs">
                <div>
                  <label className="font-medium text-slate-500">Tax ID</label>
                  <input
                    type="text"
                    value={businessInvoice.taxId}
                    onChange={(e) => onUpdateBusinessInvoice({ taxId: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Company name</label>
                  <input
                    type="text"
                    value={businessInvoice.companyName}
                    onChange={(e) => onUpdateBusinessInvoice({ companyName: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Billing address</label>
                  <input
                    type="text"
                    value={businessInvoice.companyAddress}
                    onChange={(e) => onUpdateBusinessInvoice({ companyAddress: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">E-invoice recipient email</label>
                  <input
                    type="email"
                    value={businessInvoice.recipientEmail}
                    onChange={(e) => onUpdateBusinessInvoice({ recipientEmail: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Personal invoice */}
            <label
              onClick={() => onSelectInvoiceType('personal')}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-[13px] transition ${
                invoiceType === 'personal'
                  ? 'border-[#00b14f] bg-emerald-50/30 ring-1 ring-[#00b14f]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="invoiceType"
                  checked={invoiceType === 'personal'}
                  onChange={() => onSelectInvoiceType('personal')}
                  className="h-4 w-4 text-[#00b14f] focus:ring-[#00b14f]"
                />
                <span className="font-semibold text-slate-800">Individual invoice</span>
              </div>
              {invoiceType === 'personal' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingInvoice((prev) => !prev);
                  }}
                  className="text-xs font-semibold text-[#00b14f] hover:underline"
                >
                  {isEditingInvoice ? 'Collapse' : 'Details'}
                </button>
              )}
            </label>

            {/* Personal invoice details form */}
            {invoiceType === 'personal' && isEditingInvoice && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs">
                <div>
                  <label className="font-medium text-slate-500">Full name</label>
                  <input
                    type="text"
                    value={personalInvoice.fullName}
                    onChange={(e) => onUpdatePersonalInvoice({ fullName: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Personal Tax ID / ID card number</label>
                  <input
                    type="text"
                    value={personalInvoice.taxOrIdentityNumber}
                    onChange={(e) => onUpdatePersonalInvoice({ taxOrIdentityNumber: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Personal address</label>
                  <input
                    type="text"
                    value={personalInvoice.personalAddress}
                    onChange={(e) => onUpdatePersonalInvoice({ personalAddress: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-500">Recipient email</label>
                  <input
                    type="email"
                    value={personalInvoice.recipientEmail}
                    onChange={(e) => onUpdatePersonalInvoice({ recipientEmail: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms agreement */}
        <div className="mt-4">
          <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] text-slate-700">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => onToggleTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
            />
            <span>
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
                className="font-medium text-[#00b14f] hover:underline"
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
            className="w-full rounded-lg bg-[#00b14f] py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#00873c] disabled:cursor-not-allowed disabled:bg-emerald-300/70"
          >
            Place order
          </button>

          {!canSubmit && hasItems && (
            <p className="mt-2 text-center text-[11px] text-slate-400">
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
          <div className="flex items-center gap-2 text-[#00b14f]">
            <FileText className="h-5 w-5" />
            <span className="font-bold text-slate-900">InterVue Terms of Service</span>
          </div>
        }
      >
        <div className="max-h-72 space-y-2.5 overflow-y-auto py-1 pr-2 text-xs leading-relaxed text-slate-600">
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
            className="cursor-pointer rounded-lg bg-[#00b14f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#00873c]"
          >
            Agree & Close
          </button>
        </div>
      </Modal>
    </>
  );
}

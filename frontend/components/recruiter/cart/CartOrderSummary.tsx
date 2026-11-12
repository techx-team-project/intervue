'use client';

import Modal from '@/components/ui/Modal';
import type { BusinessInvoiceInfo, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';
import { isInvoiceInfoComplete } from '@/utils/cart-invoice';
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
  invoiceType: InvoiceType | null;
  onOpenInvoiceModal: (type: InvoiceType) => void;
  businessInvoice: BusinessInvoiceInfo;
  personalInvoice: PersonalInvoiceInfo;
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
  invoiceType,
  onOpenInvoiceModal,
  businessInvoice,
  personalInvoice,
  termsAccepted,
  onToggleTerms,
  onSubmitOrder,
  selectedCount,
  hasItems,
  isSubmitting = false,
}: CartOrderSummaryProps) {
  const [isInvoiceExpanded, setIsInvoiceExpanded] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const invoiceComplete = isInvoiceInfoComplete(invoiceType, businessInvoice, personalInvoice);
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

          <div className="mt-3 space-y-2.5">
            {/* Enterprise invoice */}
            <div
              className={`rounded-lg border transition ${
                invoiceType === 'business'
                  ? 'border-primary bg-primary-light/35 ring-1 ring-[#00b14f]'
                  : 'border-outline-variant hover:border-outline bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsInvoiceExpanded(true);
                  onOpenInvoiceModal('business');
                }}
                className="text-body-md flex w-full cursor-pointer items-center justify-between p-3 text-left"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      invoiceType === 'business' ? 'border-primary' : 'border-outline'
                    }`}
                  >
                    {invoiceType === 'business' && <span className="bg-primary h-2 w-2 rounded-full" />}
                  </span>
                  <span className="text-on-surface font-semibold">Corporate e-invoice</span>
                </span>
              </button>

              {invoiceType === 'business' && invoiceComplete && (
                <div className="border-primary/20 border-t px-3 pt-2.5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-on-surface text-xs font-bold">Thông tin xuất hóa đơn điện tử</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenInvoiceModal('business')}
                        className="text-primary hover:bg-primary/10 cursor-pointer rounded p-1 transition"
                        aria-label="Chỉnh sửa thông tin hóa đơn doanh nghiệp"
                        title="Chỉnh sửa thông tin"
                      >
                        <SquarePen className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsInvoiceExpanded((prev) => !prev)}
                        className="text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded p-1 transition"
                        aria-label={isInvoiceExpanded ? 'Thu gọn thông tin hóa đơn' : 'Mở rộng thông tin hóa đơn'}
                        aria-expanded={isInvoiceExpanded}
                      >
                        {isInvoiceExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isInvoiceExpanded && (
                    <dl className="mt-2.5 space-y-1.5 text-xs">
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Mã số thuế</dt>
                        <dd className="text-on-surface truncate font-medium" title={businessInvoice.taxId}>
                          {businessInvoice.taxId}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Tên công ty</dt>
                        <dd className="text-on-surface truncate font-medium" title={businessInvoice.companyName}>
                          {businessInvoice.companyName}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Địa chỉ</dt>
                        <dd className="text-on-surface truncate font-medium" title={businessInvoice.companyAddress}>
                          {businessInvoice.companyAddress}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Email nhận hóa đơn điện tử</dt>
                        <dd className="text-on-surface truncate font-medium" title={businessInvoice.recipientEmail}>
                          {businessInvoice.recipientEmail}
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              )}
            </div>

            {/* Personal invoice */}
            <div
              className={`rounded-lg border transition ${
                invoiceType === 'personal'
                  ? 'border-primary bg-primary-light/35 ring-1 ring-[#00b14f]'
                  : 'border-outline-variant hover:border-outline bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsInvoiceExpanded(true);
                  onOpenInvoiceModal('personal');
                }}
                className="text-body-md flex w-full cursor-pointer items-center justify-between p-3 text-left"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      invoiceType === 'personal' ? 'border-primary' : 'border-outline'
                    }`}
                  >
                    {invoiceType === 'personal' && <span className="bg-primary h-2 w-2 rounded-full" />}
                  </span>
                  <span className="text-on-surface font-semibold">Individual invoice</span>
                </span>
              </button>

              {invoiceType === 'personal' && invoiceComplete && (
                <div className="border-primary/20 border-t px-3 pt-2.5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-on-surface text-xs font-bold">Thông tin xuất hóa đơn điện tử</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenInvoiceModal('personal')}
                        className="text-primary hover:bg-primary/10 cursor-pointer rounded p-1 transition"
                        aria-label="Chỉnh sửa thông tin hóa đơn cá nhân"
                        title="Chỉnh sửa thông tin"
                      >
                        <SquarePen className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsInvoiceExpanded((prev) => !prev)}
                        className="text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded p-1 transition"
                        aria-label={isInvoiceExpanded ? 'Thu gọn thông tin hóa đơn' : 'Mở rộng thông tin hóa đơn'}
                        aria-expanded={isInvoiceExpanded}
                      >
                        {isInvoiceExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isInvoiceExpanded && (
                    <dl className="mt-2.5 space-y-1.5 text-xs">
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">
                          {personalInvoice.personalDocumentType === 'passport' ? 'Số hộ chiếu' : 'Số CCCD'}
                        </dt>
                        <dd
                          className="text-on-surface truncate font-medium"
                          title={personalInvoice.taxOrIdentityNumber}
                        >
                          {personalInvoice.taxOrIdentityNumber}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Họ và tên</dt>
                        <dd className="text-on-surface truncate font-medium" title={personalInvoice.fullName}>
                          {personalInvoice.fullName}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Địa chỉ</dt>
                        <dd className="text-on-surface truncate font-medium" title={personalInvoice.personalAddress}>
                          {personalInvoice.personalAddress}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[118px_1fr] items-start gap-2">
                        <dt className="text-on-surface-variant">Email nhận hóa đơn điện tử</dt>
                        <dd className="text-on-surface truncate font-medium" title={personalInvoice.recipientEmail}>
                          {personalInvoice.recipientEmail}
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              )}
            </div>
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
            {isSubmitting ? 'Đang tạo đơn hàng...' : 'Place order'}
          </button>

          {!canSubmit && hasItems && !isSubmitting && (
            <p className="text-label-sm text-outline mt-2 text-center">
              {selectedCount === 0
                ? 'Vui lòng chọn ít nhất 1 dịch vụ'
                : !invoiceType || !invoiceComplete
                  ? 'Vui lòng chọn và điền đầy đủ thông tin xuất hóa đơn'
                  : 'Vui lòng đồng ý với Điều khoản dịch vụ'}
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

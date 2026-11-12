'use client';

import Spinner from '@/components/common/Spinner';
import CartCheckoutSuccessModal from '@/components/recruiter/cart/CartCheckoutSuccessModal';
import CartEmptyState from '@/components/recruiter/cart/CartEmptyState';
import CartImportantNote from '@/components/recruiter/cart/CartImportantNote';
import CartItemsTable from '@/components/recruiter/cart/CartItemsTable';
import CartNoticeBanner from '@/components/recruiter/cart/CartNoticeBanner';
import CartOrderSummary from '@/components/recruiter/cart/CartOrderSummary';
import CartVoucherModal from '@/components/recruiter/cart/CartVoucherModal';
import { voucherApi } from '@/apiRequest/voucher';
import type { VoucherPreview } from '@/types/voucher';
import { useRecruiterCart } from '@/hooks/useRecruiterCart';
import { useRecruiterOrderMutations } from '@/hooks/useRecruiterOrders';
import type { BusinessInvoiceInfo, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';
import type { RecruiterOrder } from '@/types/recruiter-order';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, Undo2, X } from 'lucide-react';
import { useState } from 'react';

const DEFAULT_BUSINESS_INVOICE: BusinessInvoiceInfo = {
  taxId: '',
  companyName: '',
  companyAddress: '',
  recipientEmail: '',
};

const DEFAULT_PERSONAL_INVOICE: PersonalInvoiceInfo = {
  fullName: '',
  taxOrIdentityNumber: '',
  personalAddress: '',
  recipientEmail: '',
};

export default function RecruiterCartView() {
  const {
    items,
    selectedItems,
    isAllSelected,
    isPending,
    isError,
    error,
    subtotal,
    vatRate,
    undoDeletedItem,
    toggleItemSelect,
    toggleSelectAll,
    updateQuantity,
    removeItem,
    undoRemove,
    clearUndo,
  } = useRecruiterCart();

  const { checkout } = useRecruiterOrderMutations();

  const [invoiceType, setInvoiceType] = useState<InvoiceType | null>(null);
  const [businessInvoice, setBusinessInvoice] = useState(DEFAULT_BUSINESS_INVOICE);
  const [personalInvoice, setPersonalInvoice] = useState(DEFAULT_PERSONAL_INVOICE);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucher, setVoucher] = useState<VoucherPreview | null>(null);
  const [createdOrder, setCreatedOrder] = useState<RecruiterOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // The discount is computed from the selected lines, so a changed selection invalidates it
  const dropVoucher = () => setVoucher(null);

  const applyVoucher = async (code: string) => {
    try {
      const preview = await voucherApi.validate({ code, cartItemIds: selectedItems.map((item) => item.id) });
      setVoucher(preview);
      return { success: true, message: `Voucher applied, ${preview.discountAmount.toLocaleString('vi-VN')}đ off.` };
    } catch (cause) {
      setVoucher(null);
      return { success: false, message: getErrorMessage(cause) };
    }
  };

  const discountAmount = voucher?.discountAmount ?? 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const vatAfterDiscount = Math.round(subtotalAfterDiscount * vatRate);

  const handleSubmitOrder = () => {
    setErrorMessage(null);
    if (selectedItems.length === 0) {
      setErrorMessage('Select at least one service in your cart to place an order.');
      return;
    }
    if (!invoiceType) {
      setErrorMessage('Select an invoice type (Business or Personal).');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('Please agree to the InterVue Terms of Service.');
      return;
    }

    const invoice =
      invoiceType === 'business'
        ? {
            invoiceType: 'BUSINESS' as const,
            taxId: businessInvoice.taxId,
            companyName: businessInvoice.companyName,
            companyAddress: businessInvoice.companyAddress,
            recipientEmail: businessInvoice.recipientEmail,
          }
        : {
            invoiceType: 'PERSONAL' as const,
            fullName: personalInvoice.fullName,
            identityNumber: personalInvoice.taxOrIdentityNumber,
            personalAddress: personalInvoice.personalAddress,
            recipientEmail: personalInvoice.recipientEmail,
          };

    checkout.mutate(
      {
        cartItemIds: selectedItems.map((item) => item.id),
        termsAccepted,
        voucherCode: voucher?.code,
        ...invoice,
      },
      {
        onSuccess: (order) => setCreatedOrder(order),
        onError: (cause) => setErrorMessage(getErrorMessage(cause)),
      },
    );
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
        {getErrorMessage(error)}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-16">
      <h1 className="text-on-surface text-xl font-bold sm:text-2xl">Cart ({items.length})</h1>

      <CartNoticeBanner />

      {errorMessage && (
        <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="cursor-pointer text-rose-500 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {items.length > 0 ? (
            <CartItemsTable
              items={items}
              isAllSelected={isAllSelected}
              onToggleSelectAll={() => {
                dropVoucher();
                toggleSelectAll();
              }}
              onToggleSelect={(id) => {
                dropVoucher();
                toggleItemSelect(id);
              }}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          ) : (
            <CartEmptyState />
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:col-span-4">
          <CartOrderSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            subtotalAfterDiscount={subtotalAfterDiscount}
            vatAmount={vatAfterDiscount}
            totalAmount={subtotalAfterDiscount + vatAfterDiscount}
            appliedVoucher={voucher}
            onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
            invoiceType={invoiceType}
            onSelectInvoiceType={setInvoiceType}
            businessInvoice={businessInvoice}
            personalInvoice={personalInvoice}
            onUpdateBusinessInvoice={(data) => setBusinessInvoice((previous) => ({ ...previous, ...data }))}
            onUpdatePersonalInvoice={(data) => setPersonalInvoice((previous) => ({ ...previous, ...data }))}
            termsAccepted={termsAccepted}
            onToggleTerms={setTermsAccepted}
            onSubmitOrder={handleSubmitOrder}
            selectedCount={selectedItems.length}
            hasItems={items.length > 0}
          />

          <CartImportantNote />
        </div>
      </div>

      {undoDeletedItem && (
        <div className="animate-in slide-in-from-bottom-4 border-outline-variant text-on-surface shadow-elevation-2 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border bg-white/95 px-4.5 py-3 text-xs ring-1 ring-black/5 backdrop-blur-md transition-all duration-200 sm:bottom-8">
          <div className="bg-primary-tag text-primary-deep flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
            <Check className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-on-surface font-medium">
            Removed <strong className="font-bold">&quot;{undoDeletedItem.name}&quot;</strong> from your cart.
          </span>
          <div className="flex items-center gap-2 pl-2">
            <button
              type="button"
              onClick={undoRemove}
              className="bg-primary-light text-primary-deep hover:bg-primary-tag inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition active:scale-95"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </button>
            <button
              type="button"
              onClick={clearUndo}
              className="text-outline hover:bg-surface-container-high hover:text-on-surface-variant cursor-pointer rounded-full p-1 transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <CartVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        appliedVoucher={voucher}
        onApplyVoucher={applyVoucher}
        onRemoveVoucher={dropVoucher}
      />

      <CartCheckoutSuccessModal
        order={createdOrder}
        isOpen={createdOrder !== null}
        onClose={() => setCreatedOrder(null)}
        onFinished={() => setCreatedOrder(null)}
      />
    </div>
  );
}

'use client';

import CartCheckoutSuccessModal from '@/components/recruiter/cart/CartCheckoutSuccessModal';
import CartEmptyState from '@/components/recruiter/cart/CartEmptyState';
import CartImportantNote from '@/components/recruiter/cart/CartImportantNote';
import CartItemsTable from '@/components/recruiter/cart/CartItemsTable';
import CartNoticeBanner from '@/components/recruiter/cart/CartNoticeBanner';
import CartOrderSummary from '@/components/recruiter/cart/CartOrderSummary';
import CartVoucherModal from '@/components/recruiter/cart/CartVoucherModal';
import { useRecruiterCart } from '@/hooks/useRecruiterCart';
import { AlertCircle, Check, RotateCcw, Undo2, X } from 'lucide-react';
import { useState } from 'react';

export default function RecruiterCartView() {
  const {
    items,
    isHydrated,
    isAllSelected,
    selectedItems,
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    vatAmount,
    totalAmount,
    appliedVoucher,
    invoiceType,
    businessInvoice,
    personalInvoice,
    termsAccepted,
    lastCreatedOrder,
    undoDeletedItem,
    toggleItemSelect,
    toggleSelectAll,
    updateQuantity,
    removeItem,
    undoRemove,
    clearUndo,
    restoreDefaultItems,
    applyVoucher,
    removeVoucher,
    setInvoiceType,
    setBusinessInvoice,
    setPersonalInvoice,
    setTermsAccepted,
    createOrder,
    setLastCreatedOrder,
  } = useRecruiterCart();

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitOrder = () => {
    setErrorMessage(null);
    const result = createOrder();
    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.order) {
      setIsCheckoutModalOpen(true);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
          My Cart {isHydrated ? `(${items.length})` : '(2)'}
        </h1>

        {items.length === 0 && (
          <button
            type="button"
            onClick={restoreDefaultItems}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#00b14f] hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore sample cart</span>
          </button>
        )}
      </div>

      {/* Top Expiry Warning Banner */}
      <CartNoticeBanner />

      {/* Error notification banner if validation fails */}
      {errorMessage && (
        <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Cart items table or empty state */}
        <div className="lg:col-span-8">
          {items.length > 0 ? (
            <CartItemsTable
              items={items}
              isAllSelected={isAllSelected}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelect={toggleItemSelect}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          ) : (
            <CartEmptyState onRestoreDefaults={restoreDefaultItems} />
          )}
        </div>

        {/* Right Column: Order summary & Important note */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:col-span-4">
          <CartOrderSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            subtotalAfterDiscount={subtotalAfterDiscount}
            vatAmount={vatAmount}
            totalAmount={totalAmount}
            appliedVoucher={appliedVoucher}
            onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
            invoiceType={invoiceType}
            onSelectInvoiceType={setInvoiceType}
            businessInvoice={businessInvoice}
            personalInvoice={personalInvoice}
            onUpdateBusinessInvoice={(data) => setBusinessInvoice((prev) => ({ ...prev, ...data }))}
            onUpdatePersonalInvoice={(data) => setPersonalInvoice((prev) => ({ ...prev, ...data }))}
            termsAccepted={termsAccepted}
            onToggleTerms={setTermsAccepted}
            onSubmitOrder={handleSubmitOrder}
            selectedCount={selectedItems.length}
            hasItems={items.length > 0}
          />

          <CartImportantNote />
        </div>
      </div>

      {/* Floating Undo Notification Toast */}
      {undoDeletedItem && (
        <div className="animate-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4.5 py-3 text-xs text-slate-800 shadow-2xl ring-1 ring-black/5 backdrop-blur-md transition-all duration-200 sm:bottom-8">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="font-medium text-slate-700">
            Removed <strong className="font-bold text-slate-900">&quot;{undoDeletedItem.item.name}&quot;</strong> from
            cart.
          </span>
          <div className="flex items-center gap-2 pl-2">
            <button
              type="button"
              onClick={undoRemove}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Undo</span>
            </button>
            <button
              type="button"
              onClick={clearUndo}
              className="cursor-pointer rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CartVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        appliedVoucher={appliedVoucher}
        onApplyVoucher={applyVoucher}
        onRemoveVoucher={removeVoucher}
        subtotal={subtotal}
      />

      <CartCheckoutSuccessModal
        order={lastCreatedOrder}
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onFinished={() => {
          setIsCheckoutModalOpen(false);
          setLastCreatedOrder(null);
        }}
      />
    </div>
  );
}

'use client';

import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import { voucherApi } from '@/apiRequest/voucher';
import Spinner from '@/components/common/Spinner';
import CartCheckoutSuccessModal from '@/components/recruiter/cart/CartCheckoutSuccessModal';
import CartEmptyState from '@/components/recruiter/cart/CartEmptyState';
import CartImportantNote from '@/components/recruiter/cart/CartImportantNote';
import CartInvoiceModal from '@/components/recruiter/cart/CartInvoiceModal';
import CartItemsTable from '@/components/recruiter/cart/CartItemsTable';
import CartNoticeBanner from '@/components/recruiter/cart/CartNoticeBanner';
import CartOrderSummary from '@/components/recruiter/cart/CartOrderSummary';
import CartRecommendedServices from '@/components/recruiter/cart/CartRecommendedServices';
import CartVerificationModal from '@/components/recruiter/cart/CartVerificationModal';
import CartVoucherModal from '@/components/recruiter/cart/CartVoucherModal';
import { useRecruiterCart } from '@/hooks/useRecruiterCart';
import { useRecruiterOrderMutations } from '@/hooks/useRecruiterOrders';
import { isApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth.store';
import type { BusinessInvoiceInfo, InvoiceType, PersonalInvoiceInfo } from '@/types/recruiter-cart';
import type { RecruiterOrder } from '@/types/recruiter-order';
import type { VoucherPreview } from '@/types/voucher';
import { isInvoiceInfoComplete } from '@/utils/cart-invoice';
import { getErrorMessage } from '@/utils/error';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Check, Undo2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

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
  const authUser = useAuthStore((state) => state.recruiter.user ?? state.user);

  const companyQuery = useQuery({
    queryKey: ['recruiter', 'company', 'mine'],
    queryFn: () => recruiterCompanyApi.getMyCompany().catch(() => null),
    retry: false,
  });

  const verificationQuery = useQuery({
    queryKey: ['recruiter', 'company', 'verification'],
    queryFn: () => recruiterCompanyApi.getVerificationProfile().catch(() => null),
    retry: false,
  });

  const dbBusinessDefaults = useMemo<BusinessInvoiceInfo>(() => {
    const company = companyQuery.data;
    return {
      taxId: company?.taxCode?.trim() ?? '',
      companyName: company?.name?.trim() ?? '',
      companyAddress: (company?.registeredAddress ?? company?.address)?.trim() ?? '',
      recipientEmail: (company?.email ?? authUser?.email)?.trim() ?? '',
    };
  }, [companyQuery.data, authUser?.email]);

  const dbPersonalDefaults = useMemo<PersonalInvoiceInfo>(() => {
    const company = companyQuery.data;
    return {
      personalDocumentType: 'cccd',
      fullName: authUser?.name?.trim() ?? '',
      taxOrIdentityNumber: '',
      personalAddress: (company?.registeredAddress ?? company?.address)?.trim() ?? '',
      recipientEmail: (authUser?.email ?? company?.email)?.trim() ?? '',
    };
  }, [companyQuery.data, authUser?.email, authUser?.name]);

  const [invoiceType, setInvoiceType] = useState<InvoiceType | null>(null);
  const [editedBusinessInvoice, setEditedBusinessInvoice] = useState<BusinessInvoiceInfo | null>(null);
  const [editedPersonalInvoice, setEditedPersonalInvoice] = useState<PersonalInvoiceInfo | null>(null);
  const [invoiceModalType, setInvoiceModalType] = useState<InvoiceType | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucher, setVoucher] = useState<VoucherPreview | null>(null);
  const [createdOrder, setCreatedOrder] = useState<RecruiterOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const businessInvoice = editedBusinessInvoice ?? dbBusinessDefaults;
  const personalInvoice = editedPersonalInvoice ?? dbPersonalDefaults;
  const verificationProfile = verificationQuery.data ?? null;
  const isVerificationComplete =
    Boolean(verificationProfile?.canPublish) &&
    (verificationProfile?.stepsCompleted ?? 0) >= (verificationProfile?.stepsTotal ?? 5);

  const handleSaveInvoice = (
    savedType: InvoiceType,
    nextBusiness: BusinessInvoiceInfo,
    nextPersonal: PersonalInvoiceInfo,
  ) => {
    setInvoiceType(savedType);
    setEditedBusinessInvoice(nextBusiness);
    setEditedPersonalInvoice(nextPersonal);
    setInvoiceModalType(null);
  };

  // The discount is computed from the selected lines, so a changed selection invalidates it
  const dropVoucher = () => setVoucher(null);

  const applyVoucher = async (code: string) => {
    try {
      const preview = await voucherApi.validate({ code, cartItemIds: selectedItems.map((item) => item.id) });
      setVoucher(preview);
      return { success: true, message: `Code applied, ${preview.discountAmount.toLocaleString('vi-VN')}đ off.` };
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
    if (!invoiceType || !isInvoiceInfoComplete(invoiceType, businessInvoice, personalInvoice)) {
      setErrorMessage('Please select and complete the invoice information.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('Please agree to the InterVue Terms of Service.');
      return;
    }
    if (!isVerificationComplete) {
      setIsVerificationModalOpen(true);
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
        onError: (cause) => {
          if (isApiError(cause) && cause.code === 'NOT_COMPANY_MEMBER') {
            setIsVerificationModalOpen(true);
            return;
          }
          setErrorMessage(getErrorMessage(cause));
        },
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

  const hasItems = items.length > 0;

  return (
    <div className="space-y-5 pb-16">
      <h1 className="text-on-surface text-xl font-bold sm:text-2xl">
        {hasItems ? `My cart (${items.length})` : 'My cart'}
      </h1>

      {hasItems ? (
        <>
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
                onOpenInvoiceModal={setInvoiceModalType}
                businessInvoice={businessInvoice}
                personalInvoice={personalInvoice}
                termsAccepted={termsAccepted}
                onToggleTerms={setTermsAccepted}
                onSubmitOrder={handleSubmitOrder}
                selectedCount={selectedItems.length}
                hasItems={hasItems}
                isSubmitting={checkout.isPending}
              />

              <CartImportantNote />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <CartEmptyState />
          <CartRecommendedServices />
        </div>
      )}

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

      {invoiceModalType !== null && (
        <CartInvoiceModal
          key={invoiceModalType}
          isOpen
          onClose={() => setInvoiceModalType(null)}
          initialType={invoiceModalType}
          businessInvoice={businessInvoice}
          personalInvoice={personalInvoice}
          onSave={handleSaveInvoice}
        />
      )}

      <CartVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        verificationProfile={verificationProfile}
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

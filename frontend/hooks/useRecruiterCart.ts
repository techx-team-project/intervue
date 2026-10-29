'use client';

import {
  AVAILABLE_VOUCHERS,
  DEFAULT_BUSINESS_INVOICE,
  DEFAULT_PERSONAL_INVOICE,
  INITIAL_RECRUITER_CART_ITEMS,
} from '@/mocks/recruiter-cart.mock';
import type {
  BusinessInvoiceInfo,
  CartCreatedOrder,
  DiscountVoucher,
  InvoiceType,
  PersonalInvoiceInfo,
  RecruiterCartItem,
} from '@/types/recruiter-cart';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const CART_STORAGE_KEY = 'intervue.recruiter.cart.v1';
const CART_EVENT_NAME = 'intervue:recruiter-cart-updated';

// External memory cache so snapshots remain referentially stable between renders
let cachedItems: RecruiterCartItem[] | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function readStorageItems(): RecruiterCartItem[] {
  if (typeof window === 'undefined') return INITIAL_RECRUITER_CART_ITEMS;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return INITIAL_RECRUITER_CART_ITEMS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return INITIAL_RECRUITER_CART_ITEMS;
  } catch {
    return INITIAL_RECRUITER_CART_ITEMS;
  }
}

function writeStorageItems(newItems: RecruiterCartItem[]) {
  cachedItems = newItems;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(
        new CustomEvent(CART_EVENT_NAME, {
          detail: { count: newItems.length },
        }),
      );
    } catch {
      // Ignore quota error
    }
  }
  notifyListeners();
}

function getCartSnapshot(): RecruiterCartItem[] {
  if (cachedItems === null) {
    cachedItems = readStorageItems();
  }
  return cachedItems;
}

function getCartServerSnapshot(): RecruiterCartItem[] {
  return INITIAL_RECRUITER_CART_ITEMS;
}

function subscribeCart(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      cachedItems = readStorageItems();
      callback();
    }
  };
  const handleCustom = () => {
    cachedItems = readStorageItems();
    callback();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    window.addEventListener(CART_EVENT_NAME, handleCustom);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(CART_EVENT_NAME, handleCustom);
    }
  };
}

// Hook for header counter with hydration-safe subscription
export function useRecruiterCartCount(): number {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  return items.length;
}

export function useRecruiterCart() {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const [invoiceType, setInvoiceType] = useState<InvoiceType | null>(null);
  const [businessInvoice, setBusinessInvoice] = useState<BusinessInvoiceInfo>(DEFAULT_BUSINESS_INVOICE);
  const [personalInvoice, setPersonalInvoice] = useState<PersonalInvoiceInfo>(DEFAULT_PERSONAL_INVOICE);
  const [appliedVoucher, setAppliedVoucher] = useState<DiscountVoucher | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<CartCreatedOrder | null>(null);
  const [undoDeletedItem, setUndoDeletedItem] = useState<{ item: RecruiterCartItem; index: number } | null>(null);

  const toggleItemSelect = useCallback(
    (id: string) => {
      const next = items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item));
      writeStorageItems(next);
    },
    [items],
  );

  const toggleSelectAll = useCallback(
    (selected?: boolean) => {
      const shouldSelect = typeof selected === 'boolean' ? selected : !items.every((it) => it.selected);
      const next = items.map((item) => ({ ...item, selected: shouldSelect }));
      writeStorageItems(next);
    },
    [items],
  );

  const updateQuantity = useCallback(
    (id: string, delta: number) => {
      const next = items.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      });
      writeStorageItems(next);
    },
    [items],
  );

  const removeItem = useCallback(
    (id: string) => {
      const itemIndex = items.findIndex((it) => it.id === id);
      if (itemIndex === -1) return;
      const target = items[itemIndex];
      const next = items.filter((it) => it.id !== id);
      setUndoDeletedItem({ item: target, index: itemIndex });
      writeStorageItems(next);
      setTimeout(() => {
        setUndoDeletedItem((current) => (current?.item.id === id ? null : current));
      }, 6000);
    },
    [items],
  );

  const clearUndo = useCallback(() => {
    setUndoDeletedItem(null);
  }, []);

  const undoRemove = useCallback(() => {
    if (!undoDeletedItem) return;
    const next = [...items];
    next.splice(undoDeletedItem.index, 0, undoDeletedItem.item);
    writeStorageItems(next);
    setUndoDeletedItem(null);
  }, [items, undoDeletedItem]);

  const restoreDefaultItems = useCallback(() => {
    writeStorageItems(INITIAL_RECRUITER_CART_ITEMS);
    setAppliedVoucher(null);
    setUndoDeletedItem(null);
  }, []);

  // Price calculations
  const selectedItems = useMemo(() => items.filter((it) => it.selected), [items]);
  const isAllSelected = useMemo(() => items.length > 0 && items.every((it) => it.selected), [items]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  }, [selectedItems]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher || subtotal === 0) return 0;
    if (appliedVoucher.minOrderValue && subtotal < appliedVoucher.minOrderValue) return 0;

    if (appliedVoucher.discountType === 'percentage') {
      return Math.round((subtotal * appliedVoucher.discountValue) / 100);
    }
    return Math.min(subtotal, appliedVoucher.discountValue);
  }, [appliedVoucher, subtotal]);

  const subtotalAfterDiscount = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);

  const vatRate = 0.08; // 8% VAT
  const vatAmount = useMemo(() => {
    if (subtotalAfterDiscount === 0) return 0;
    return Math.round(subtotalAfterDiscount * vatRate);
  }, [subtotalAfterDiscount]);

  const totalAmount = useMemo(() => {
    if (subtotalAfterDiscount === 0) return 0;
    return subtotalAfterDiscount + vatAmount;
  }, [subtotalAfterDiscount, vatAmount]);

  const applyVoucher = useCallback(
    (code: string): { success: boolean; message: string } => {
      const clean = code.trim().toUpperCase();
      const match = AVAILABLE_VOUCHERS.find((v) => v.code === clean);
      if (!match) {
        return { success: false, message: 'Invalid or expired coupon code.' };
      }
      if (match.minOrderValue && subtotal < match.minOrderValue) {
        return {
          success: false,
          message: `Coupon ${clean} requires a minimum order of ${match.minOrderValue.toLocaleString('vi-VN')} VND.`,
        };
      }
      setAppliedVoucher(match);
      return { success: true, message: `Coupon ${clean} applied successfully!` };
    },
    [subtotal],
  );

  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null);
  }, []);

  const createOrder = useCallback((): { order: CartCreatedOrder | null; error?: string } => {
    if (selectedItems.length === 0) {
      return { order: null, error: 'Please select at least one service in your cart to place an order.' };
    }
    if (!invoiceType) {
      return { order: null, error: 'Please select an invoice type (Corporate or Individual).' };
    }
    if (!termsAccepted) {
      return { order: null, error: 'Please agree to the InterVue Terms of Service.' };
    }

    const now = new Date();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `IV-ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate(),
    ).padStart(2, '0')}-${randomSuffix}`;

    const expires = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes payment hold

    const order: CartCreatedOrder = {
      orderId: `ord-${Date.now()}`,
      orderCode,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      items: selectedItems,
      subtotal,
      discountAmount,
      discountCode: appliedVoucher?.code,
      subtotalAfterDiscount,
      vatRate,
      vatAmount,
      totalAmount,
      invoiceType,
      invoiceData: invoiceType === 'business' ? businessInvoice : personalInvoice,
      bankAccount: {
        bankName: 'Military Commercial Joint Stock Bank (MB Bank) - Head Office',
        accountNumber: '0812665001',
        accountHolder: 'INTERVUE TECHNOLOGY VIETNAM JSC',
        transferSyntax: `${orderCode} PAYMENT`,
      },
    };

    setLastCreatedOrder(order);

    // Remove ordered items from cart
    const remainingItems = items.filter((it) => !it.selected);
    writeStorageItems(remainingItems);

    return { order };
  }, [
    selectedItems,
    invoiceType,
    termsAccepted,
    subtotal,
    discountAmount,
    appliedVoucher?.code,
    subtotalAfterDiscount,
    vatAmount,
    totalAmount,
    businessInvoice,
    personalInvoice,
    items,
  ]);

  return {
    items,
    isHydrated: true,
    isAllSelected,
    selectedItems,
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    vatRate,
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
  };
}

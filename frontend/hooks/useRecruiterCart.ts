'use client';

import { recruiterCartApi } from '@/apiRequest/recruiter-cart';
import type { RecruiterCart, RecruiterCartItem } from '@/types/recruiter-cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

export const recruiterCartKeys = {
  all: ['recruiter', 'cart'] as const,
};

const EMPTY_CART: RecruiterCart = {
  items: [],
  subtotal: 0,
  vatRate: 0,
  vatAmount: 0,
  totalAmount: 0,
  currency: 'VND',
};

const UNDO_WINDOW_MS = 6000;

export function useRecruiterCartQuery() {
  return useQuery({ queryKey: recruiterCartKeys.all, queryFn: recruiterCartApi.get });
}

export function useRecruiterCartCount() {
  const { data } = useRecruiterCartQuery();
  return data?.items.length ?? 0;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packageId, quantity }: { packageId: number; quantity: number }) =>
      recruiterCartApi.addItem(packageId, quantity),
    onSuccess: (cart) => queryClient.setQueryData(recruiterCartKeys.all, cart),
  });
}

export function useRecruiterCart() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useRecruiterCartQuery();
  const cart = data ?? EMPTY_CART;

  const [deselectedIds, setDeselectedIds] = useState<number[]>([]);
  const [undoDeletedItem, setUndoDeletedItem] = useState<RecruiterCartItem | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyCart = useCallback(
    (next: RecruiterCart) => queryClient.setQueryData(recruiterCartKeys.all, next),
    [queryClient],
  );

  const items: RecruiterCartItem[] = cart.items.map((item) => ({
    ...item,
    selected: !deselectedIds.includes(item.id),
  }));
  const selectedItems = items.filter((item) => item.selected);
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const subtotal = selectedItems.reduce((total, item) => total + item.lineTotal, 0);
  const vatAmount = Math.round(subtotal * cart.vatRate);

  const mutate = useMutation({
    mutationFn: async (action: () => Promise<RecruiterCart>) => action(),
    onSuccess: applyCart,
  });

  const toggleItemSelect = useCallback((id: number) => {
    setDeselectedIds((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setDeselectedIds((previous) => (previous.length === 0 ? cart.items.map((item) => item.id) : []));
  }, [cart.items]);

  const updateQuantity = useCallback(
    (id: number, delta: number) => {
      const current = cart.items.find((item) => item.id === id);
      if (!current) return;
      const next = Math.min(99, Math.max(1, current.quantity + delta));
      if (next === current.quantity) return;
      mutate.mutate(() => recruiterCartApi.updateItem(id, next));
    },
    [cart.items, mutate],
  );

  const clearUndo = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoDeletedItem(null);
  }, []);

  const removeItem = useCallback(
    (id: number) => {
      const target = cart.items.find((item) => item.id === id);
      if (!target) return;
      mutate.mutate(() => recruiterCartApi.removeItem(id), {
        onSuccess: () => {
          setUndoDeletedItem(target);
          if (undoTimer.current) clearTimeout(undoTimer.current);
          undoTimer.current = setTimeout(() => setUndoDeletedItem(null), UNDO_WINDOW_MS);
        },
      });
    },
    [cart.items, mutate],
  );

  // Undo re-adds the line; it comes back at the end of the cart rather than its old position
  const undoRemove = useCallback(() => {
    const target = undoDeletedItem;
    if (!target) return;
    clearUndo();
    mutate.mutate(() => recruiterCartApi.addItem(target.packageId, target.quantity));
  }, [undoDeletedItem, clearUndo, mutate]);

  return {
    items,
    selectedItems,
    isAllSelected,
    isPending,
    isError,
    error,
    subtotal,
    vatRate: cart.vatRate,
    vatAmount,
    totalAmount: subtotal + vatAmount,
    currency: cart.currency,
    undoDeletedItem,
    isMutating: mutate.isPending,
    toggleItemSelect,
    toggleSelectAll,
    updateQuantity,
    removeItem,
    undoRemove,
    clearUndo,
  };
}

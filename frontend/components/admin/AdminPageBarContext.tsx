'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AdminPageBarSlotContextValue {
  slotEl: HTMLElement | null;
  setSlotEl: (el: HTMLElement | null) => void;
}

const AdminPageBarSlotContext = createContext<AdminPageBarSlotContextValue | null>(null);

export function AdminPageBarProvider({ children }: { children: ReactNode }) {
  const [slotEl, setSlotEl] = useState<HTMLElement | null>(null);
  return <AdminPageBarSlotContext.Provider value={{ slotEl, setSlotEl }}>{children}</AdminPageBarSlotContext.Provider>;
}

export function useAdminPageBarSlotRef() {
  return useContext(AdminPageBarSlotContext)?.setSlotEl;
}

export function AdminPageBarActions({ children }: { children: ReactNode }) {
  const slotEl = useContext(AdminPageBarSlotContext)?.slotEl ?? null;
  if (!slotEl) return null;
  return createPortal(children, slotEl);
}

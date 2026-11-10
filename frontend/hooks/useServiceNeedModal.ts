'use client';

import { SERVICE_NEED_MODAL_STORAGE_KEY } from '@/constants/service-package';
import { useCallback, useSyncExternalStore } from 'react';

const DISMISS_EVENT = 'intervue:service-need-modal-dismissed';

function subscribe(onStoreChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener(DISMISS_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(SERVICE_NEED_MODAL_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function useServiceNeedModal() {
  // Server snapshot is "dismissed" so the modal never renders before hydration
  const dismissedForever = useSyncExternalStore(subscribe, getSnapshot, () => true);

  const dismissForever = useCallback(() => {
    try {
      window.localStorage.setItem(SERVICE_NEED_MODAL_STORAGE_KEY, '1');
    } catch {
      return;
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }, []);

  return { dismissedForever, dismissForever };
}

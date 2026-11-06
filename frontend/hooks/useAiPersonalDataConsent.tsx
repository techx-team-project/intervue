'use client';

import AiPersonalDataConsentDialog from '@/components/ai/AiPersonalDataConsentDialog';
import { AI_PERSONAL_DATA_CONSENT_CONFIG, AI_PERSONAL_DATA_CONSENT_STORAGE_KEY } from '@/constants/ai-consent';
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react';

export interface AiConsentRecord {
  consented: boolean;
  version: string;
  consentedAt: string;
}

const listeners = new Set<() => void>();

function notifyConsentChange() {
  listeners.forEach((listener) => listener());
}

function subscribeToConsent(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AI_PERSONAL_DATA_CONSENT_STORAGE_KEY) {
      callback();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function getConsentSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AI_PERSONAL_DATA_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function useAiPersonalDataConsent() {
  const consentRaw = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerSnapshot);

  const consentRecord = useMemo<AiConsentRecord | null>(() => {
    if (!consentRaw) return null;
    try {
      return JSON.parse(consentRaw) as AiConsentRecord;
    } catch {
      return null;
    }
  }, [consentRaw]);

  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState<boolean>(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const hasConsented = useMemo(() => {
    if (!consentRecord || !consentRecord.consented) return false;
    // Ask again when the version changes
    return consentRecord.version === AI_PERSONAL_DATA_CONSENT_CONFIG.version;
  }, [consentRecord]);

  const acceptConsent = useCallback(() => {
    const newRecord: AiConsentRecord = {
      consented: true,
      version: AI_PERSONAL_DATA_CONSENT_CONFIG.version,
      consentedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(AI_PERSONAL_DATA_CONSENT_STORAGE_KEY, JSON.stringify(newRecord));
      notifyConsentChange();
    } catch {
      // Storage unavailable / private mode fallback
    }

    setIsConsentDialogOpen(false);

    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  }, []);

  const declineConsent = useCallback(() => {
    setIsConsentDialogOpen(false);
    pendingActionRef.current = null;
  }, []);

  const revokeConsent = useCallback(() => {
    try {
      window.localStorage.removeItem(AI_PERSONAL_DATA_CONSENT_STORAGE_KEY);
      notifyConsentChange();
    } catch {
      // Storage unavailable
    }
  }, []);

  const requestConsent = useCallback((onApproved?: () => void) => {
    const currentRaw = getConsentSnapshot();
    let currentRecord: AiConsentRecord | null = null;
    if (currentRaw) {
      try {
        currentRecord = JSON.parse(currentRaw) as AiConsentRecord;
      } catch {
        currentRecord = null;
      }
    }

    const isApproved =
      currentRecord?.consented === true && currentRecord?.version === AI_PERSONAL_DATA_CONSENT_CONFIG.version;

    if (isApproved) {
      onApproved?.();
      return;
    }

    pendingActionRef.current = onApproved ?? null;
    setIsConsentDialogOpen(true);
  }, []);

  const consentDialog = (
    <AiPersonalDataConsentDialog isOpen={isConsentDialogOpen} onConfirm={acceptConsent} onCancel={declineConsent} />
  );

  return {
    hasConsented,
    consentRecord,
    isConsentDialogOpen,
    requestConsent,
    acceptConsent,
    declineConsent,
    revokeConsent,
    consentDialog,
  };
}

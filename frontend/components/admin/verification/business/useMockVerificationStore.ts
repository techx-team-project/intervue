'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  computeSummaryFromDossiers,
  getStoredCompanies,
  getStoredDossiers,
  INITIAL_MOCK_COMPANIES,
  INITIAL_MOCK_DOSSIERS,
  resetMockStorage,
  updateDossierInStore,
  type ExtendedVerificationDetail,
  type ManagedCompanyItem,
} from './mock-verification-data';

const EVENT_NAME = 'intervue_admin_mock_data_changed';

let cachedDossiers: ExtendedVerificationDetail[] = INITIAL_MOCK_DOSSIERS;
let cachedCompanies: ManagedCompanyItem[] = INITIAL_MOCK_COMPANIES;
let isInitialized = false;

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    cachedDossiers = getStoredDossiers();
    cachedCompanies = getStoredCompanies();
    callback();
  };

  window.addEventListener(EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

function getDossiersSnapshot(): ExtendedVerificationDetail[] {
  if (!isInitialized && typeof window !== 'undefined') {
    cachedDossiers = getStoredDossiers();
    cachedCompanies = getStoredCompanies();
    isInitialized = true;
  }
  return cachedDossiers;
}

function getCompaniesSnapshot(): ManagedCompanyItem[] {
  if (!isInitialized && typeof window !== 'undefined') {
    cachedDossiers = getStoredDossiers();
    cachedCompanies = getStoredCompanies();
    isInitialized = true;
  }
  return cachedCompanies;
}

function getServerDossiersSnapshot(): ExtendedVerificationDetail[] {
  return INITIAL_MOCK_DOSSIERS;
}

function getServerCompaniesSnapshot(): ManagedCompanyItem[] {
  return INITIAL_MOCK_COMPANIES;
}

export function useMockVerificationStore() {
  const dossiers = useSyncExternalStore(subscribe, getDossiersSnapshot, getServerDossiersSnapshot);

  const companies = useSyncExternalStore(subscribe, getCompaniesSnapshot, getServerCompaniesSnapshot);

  const summary = computeSummaryFromDossiers(dossiers);

  const approve = useCallback((documentId: number, expiresAt?: string) => {
    return updateDossierInStore(documentId, 'APPROVE', { expiresAt });
  }, []);

  const reject = useCallback((documentId: number, reason: string) => {
    return updateDossierInStore(documentId, 'REJECT', { reason });
  }, []);

  const requestInfo = useCallback((documentId: number, reason: string) => {
    return updateDossierInStore(documentId, 'REQUEST_INFO', { reason });
  }, []);

  const revoke = useCallback((documentId: number, reason: string) => {
    return updateDossierInStore(documentId, 'REVOKE', { reason });
  }, []);

  const reset = useCallback(() => {
    resetMockStorage();
  }, []);

  return {
    dossiers,
    companies,
    summary,
    isReady: true,
    approve,
    reject,
    requestInfo,
    revoke,
    reset,
  };
}

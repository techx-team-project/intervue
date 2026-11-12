'use client';

import { adminCompanyCreditApi, adminFreeQuotaApi, creditApi } from '@/apiRequest/credit';
import type { AdjustCompanyCreditsInput, ConvertCreditsInput, SaveFreeQuotaSettingsInput } from '@/types/credit';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const creditKeys = {
  wallet: ['recruiter', 'credits', 'wallet'] as const,
  ledgerRoot: ['recruiter', 'credits', 'ledger'] as const,
  ledger: (page: number, size: number) => ['recruiter', 'credits', 'ledger', page, size] as const,
  adminFreeQuotas: ['admin', 'free-quotas'] as const,
  adminCompanyCreditsRoot: ['admin', 'credits', 'companies'] as const,
  adminCompanyCredits: (q: string, page: number, size: number) =>
    ['admin', 'credits', 'companies', q, page, size] as const,
  adminCompanyCreditDetail: (companyId: number) => ['admin', 'credits', 'companies', 'detail', companyId] as const,
  adminCompanyCreditLedger: (companyId: number, page: number, size: number) =>
    ['admin', 'credits', 'companies', 'ledger', companyId, page, size] as const,
};

export function useCreditWallet() {
  return useQuery({ queryKey: creditKeys.wallet, queryFn: creditApi.getWallet });
}

export function useCreditLedger(enabled: boolean, page = 0, size = 10) {
  return useQuery({
    queryKey: creditKeys.ledger(page, size),
    queryFn: () => creditApi.getLedger({ page, size }),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useConvertCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ConvertCreditsInput) => creditApi.convert(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creditKeys.wallet });
      qc.invalidateQueries({ queryKey: creditKeys.ledgerRoot });
      qc.invalidateQueries({ queryKey: ['recruiter', 'entitlements'] });
    },
  });
}

export function useAdminFreeQuotas(enabled = true) {
  return useQuery({
    queryKey: creditKeys.adminFreeQuotas,
    queryFn: adminFreeQuotaApi.get,
    enabled,
  });
}

export function useUpdateAdminFreeQuotas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveFreeQuotaSettingsInput) => adminFreeQuotaApi.update(input),
    onSuccess: (updated) => {
      qc.setQueryData(creditKeys.adminFreeQuotas, updated);
    },
  });
}

export function useAdminCompanyCredits(q: string, page: number, size = 10, enabled = true) {
  return useQuery({
    queryKey: creditKeys.adminCompanyCredits(q, page, size),
    queryFn: () => adminCompanyCreditApi.list({ q, page, size }),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useAdminCompanyCreditDetail(companyId: number | null) {
  return useQuery({
    queryKey: creditKeys.adminCompanyCreditDetail(companyId ?? 0),
    queryFn: () => adminCompanyCreditApi.detail(companyId!),
    enabled: companyId !== null,
  });
}

export function useAdminCompanyCreditLedger(companyId: number | null, page: number, size = 10, enabled = true) {
  return useQuery({
    queryKey: creditKeys.adminCompanyCreditLedger(companyId ?? 0, page, size),
    queryFn: () => adminCompanyCreditApi.ledger(companyId!, { page, size }),
    enabled: companyId !== null && enabled,
    placeholderData: keepPreviousData,
  });
}

export function useAdjustCompanyCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, input }: { companyId: number; input: AdjustCompanyCreditsInput }) =>
      adminCompanyCreditApi.adjust(companyId, input),
    onSuccess: (detail, { companyId }) => {
      qc.setQueryData(creditKeys.adminCompanyCreditDetail(companyId), detail);
      qc.invalidateQueries({ queryKey: creditKeys.adminCompanyCreditsRoot });
    },
  });
}

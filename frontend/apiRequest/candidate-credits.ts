import { request } from './http';
import type { CandidateCreditSummary, TopupCreditsRequest } from '@/types/cv-review';

export async function getCandidateCredits(): Promise<CandidateCreditSummary> {
  return request<CandidateCreditSummary>('/candidate/credits', {
    method: 'GET',
    auth: true,
  });
}

export async function topupCandidateCredits(amount: number): Promise<CandidateCreditSummary> {
  return request<CandidateCreditSummary>('/candidate/credits/topup', {
    method: 'POST',
    body: { amount } as TopupCreditsRequest,
    auth: true,
  });
}

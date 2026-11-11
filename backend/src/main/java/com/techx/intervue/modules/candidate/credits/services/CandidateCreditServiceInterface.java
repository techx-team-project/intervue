package com.techx.intervue.modules.candidate.credits.services;

import com.techx.intervue.modules.candidate.credits.resources.CandidateCreditSummaryResource;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;

public interface CandidateCreditServiceInterface {

    int getBalance(Long candidateId);

    void charge(
            CandidateProfile candidate,
            int amount,
            String feature,
            String referenceId,
            String description);

    void refund(
            CandidateProfile candidate,
            int amount,
            String feature,
            String referenceId,
            String description);

    CandidateCreditSummaryResource topup(Long candidateUserId, int amount);

    CandidateCreditSummaryResource getSummary(Long candidateUserId);
}

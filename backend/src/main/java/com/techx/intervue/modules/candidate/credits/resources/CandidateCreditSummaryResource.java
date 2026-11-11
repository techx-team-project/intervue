package com.techx.intervue.modules.candidate.credits.resources;

import java.util.List;
import lombok.Builder;

@Builder
public record CandidateCreditSummaryResource(
        Long candidateId,
        int currentBalance,
        int totalCharged,
        int totalRefunded,
        List<CandidateCreditTransactionResource> recentTransactions) {}

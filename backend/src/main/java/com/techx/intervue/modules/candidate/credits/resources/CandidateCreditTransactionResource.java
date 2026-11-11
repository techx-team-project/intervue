package com.techx.intervue.modules.candidate.credits.resources;

import com.techx.intervue.modules.candidate.credits.enums.CreditTransactionType;
import java.time.Instant;
import lombok.Builder;

@Builder
public record CandidateCreditTransactionResource(
        Long id,
        int amount,
        int balanceAfter,
        CreditTransactionType type,
        String feature,
        String referenceId,
        String description,
        Instant createdAt) {}

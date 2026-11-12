package com.techx.intervue.modules.billing.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminCompanyCreditSummaryResource(
        Long companyId,
        String companyName,
        String taxCode,
        String address,
        long availableBalance,
        long lifetimeGranted,
        long lifetimeSpent,
        long expiredBalance,
        Instant nearestExpiryAt) {}

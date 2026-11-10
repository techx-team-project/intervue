package com.techx.intervue.modules.ai.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record ResumeMatchQuotaResource(
        int freeUsedThisMonth,
        int freeLimit,
        int freeRemaining,
        int paidRemaining,
        int totalRemaining,
        Instant resetAt) {}

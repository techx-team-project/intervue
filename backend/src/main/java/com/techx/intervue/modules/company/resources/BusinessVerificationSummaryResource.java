package com.techx.intervue.modules.company.resources;

import lombok.Builder;

@Builder
public record BusinessVerificationSummaryResource(
        long total,
        long pendingReview,
        long moreInfoRequired,
        long approved,
        long rejected,
        long revoked,
        long expired) {}

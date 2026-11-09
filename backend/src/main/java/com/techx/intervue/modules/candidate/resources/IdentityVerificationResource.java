package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record IdentityVerificationResource(
        IdentityVerificationStatus status,
        String rejectReason,
        int attemptsLeft,
        boolean canSubmit,
        boolean canRequestManualReview,
        boolean required,
        String fullName,
        String idNumberLast4,
        Instant submittedAt,
        Instant reviewedAt,
        Instant manualReviewRequestedAt) {}
